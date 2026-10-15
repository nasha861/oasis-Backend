const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('express-async-handler');
const Installation = require('../models/Installation');
const Customer = require('../models/Customer');
const Technician = require('../models/Technician');

const createCrudController = require('./crudController');

const getInstallations = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(
    Math.max(Number(req.query.limit) || 10, 1),
    100
  );

  const filters = {};

  ['customer', 'systemPackage', 'status'].forEach((field) => {
    if (req.query[field] !== undefined) {
      filters[field] = req.query[field];
    }
  });

  if (req.query.search) {
    filters.$or = ['address', 'note'].map((field) => ({
      [field]: {
        $regex: req.query.search,
        $options: 'i'
      }
    }));
  }

  // Enforce the user's actual access scope after applying query filters.
  if (req.user.role === 'customer') {
    const customer = await Customer.findOne({
      user: req.user._id
    });

    if (!customer) {
      res.status(403);
      throw new Error('Customer profile not found');
    }

    filters.customer = customer._id;
  } else if (req.user.role === 'technician') {
    const technician = await Technician.findOne({
      user: req.user._id
    });

    if (!technician) {
      res.status(403);
      throw new Error('Technician profile not found');
    }

    filters.technicians = technician._id;
  } else if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: insufficient permissions');
  }

  const sort = req.query.sort || '-createdAt';
  const skip = (page - 1) * limit;

  const query = Installation.find(filters)
    .populate('customer')
    .populate('systemPackage')
    .populate({
      path: 'technicians',
      populate: {
        path: 'user',
        select: 'name email'
      }
    })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const [documents, total] = await Promise.all([
    query,
    Installation.countDocuments(filters)
  ]);

  sendSuccess(
    res,
    documents,
    'Installation records fetched',
    200,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  );
});

const getInstallationById = asyncHandler(async (req, res, next) => {
  const installation = await Installation.findById(req.params.id);

  if (!installation) {
    res.status(404);
    throw new Error('Installation not found');
  }

  if (req.user.role === 'customer') {
    const customer = await Customer.findOne({
      user: req.user._id
    });

    if (
      !customer ||
      String(installation.customer) !== String(customer._id)
    ) {
      res.status(403);
      throw new Error('You cannot access this installation');
    }
  } else if (req.user.role === 'technician') {
    const technician = await Technician.findOne({
      user: req.user._id
    });

    const isAssigned = technician &&
      installation.technicians.some(
        (id) => String(id) === String(technician._id)
      );

    if (!isAssigned) {
      res.status(403);
      throw new Error('You are not assigned to this installation');
    }
  } else if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: insufficient permissions');
  }

  // Reuse the existing populated response from the CRUD controller.
  return crudController.getById(req, res, next);
});
const crudController = createCrudController(Installation, {
  populate: [
    'customer',
    'systemPackage',
    {
      path: 'technicians',
      populate: {
        path: 'user',
        select: 'name email'
      }
    }
  ],
  filterFields: ['customer', 'systemPackage', 'status'],
  searchableFields: ['address', 'note']
});

const createInstallation = asyncHandler(async (req, res) => {
  const { systemPackage, address, note } = req.body;

  if (!systemPackage) {
    res.status(400);
    throw new Error('System package is required');
  }

  const SystemPackage = require('../models/SystemPackage');

  const packageExists = await SystemPackage.findById(
    systemPackage
  );

  if (!packageExists) {
    res.status(404);
    throw new Error('System package not found');
  }

  let customer;

  if (req.user.role === 'customer') {
    customer = await Customer.findOne({
      user: req.user._id
    });

    if (!customer) {
      res.status(404);
      throw new Error('Customer profile not found');
    }
  } else if (req.user.role === 'admin') {
    if (!req.body.customer) {
      res.status(400);
      throw new Error(
        'Customer ID is required when an admin creates an installation'
      );
    }

    customer = await Customer.findById(req.body.customer);

    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }
  } else {
    res.status(403);
    throw new Error(
      'You are not authorized to create an installation'
    );
  }

  const installation = await Installation.create({
    customer: customer._id,
    systemPackage,
    address,
    note
  });

  const populatedInstallation = await Installation.findById(
    installation._id
  )
    .populate('customer')
    .populate('systemPackage')
    .populate({
      path: 'technicians',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

  return res.status(201).json({
    success: true,
    message: 'Installation created',
    data: populatedInstallation
  });
});


/*
  ADMIN:
  Assign technician, update status and schedule installation.
*/
const updateInstallationManagement = asyncHandler(
  async (req, res) => {
    const {
      technicianId,
      status,
      installationDate,
      note
    } = req.body;

    const installation = await Installation.findById(
      req.params.id
    );

    if (!installation) {
      res.status(404);
      throw new Error('Installation not found');
    }

    // Assign technician
    if (technicianId !== undefined) {
      const technician = await Technician.findById(
        technicianId
      );

      if (!technician) {
        res.status(404);
        throw new Error('Technician not found');
      }

      // Avoid duplicate technician assignment
      const alreadyAssigned =
        installation.technicians.some(
          (id) => String(id) === String(technician._id)
        );

      if (!alreadyAssigned) {
        installation.technicians.push(
          technician._id
        );
      }

      // Keep technician available/busy state consistent
      technician.status = 'busy';

      if (
        !technician.assignedInstallations.includes(
          installation._id
        )
      ) {
        technician.assignedInstallations.push(
          installation._id
        );
      }

      await technician.save();
    }

    // Update status
    if (status !== undefined) {
      const allowedStatuses = [
        'survey',
        'pending',
        'in-progress',
        'completed'
      ];

      if (!allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid installation status');
      }

      installation.status = status;

      // When installation is completed,
      // release assigned technicians.
      if (status === 'completed') {
        const assignedTechnicians =
          await Technician.find({
            _id: {
              $in: installation.technicians
            }
          });

        for (const technician of assignedTechnicians) {
          technician.assignedInstallations =
            technician.assignedInstallations.filter(
              (id) =>
                String(id) !==
                String(installation._id)
            );

                    if (technician.status !== 'inactive') {
            if (
              technician.assignedInstallations.length === 0 &&
              technician.assignedMaintenance.length === 0
            ) {
              technician.status = 'available';
            } else {
              technician.status = 'busy';
            }
          }

          await technician.save();
        }
      }
    }

    // Schedule installation
    if (installationDate !== undefined) {
      installation.installationDate =
        installationDate || null;
    }

    // Update note
    if (note !== undefined) {
      installation.note = note;
    }

    await installation.save();

   const updatedInstallation =
  await Installation.findById(
    installation._id
  )
    .populate('customer')
    .populate('systemPackage')
    .populate({
      path: 'technicians',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Installation updated successfully',
      data: updatedInstallation
    });
  }
);
const updateInstallation = asyncHandler(async (req, res, next) => {
  // Admins retain the existing CRUD update behavior.
  if (req.user.role === 'admin') {
    return crudController.update(req, res, next);
  }

  // Find the technician profile belonging to this user.
  const technician = await Technician.findOne({
    user: req.user._id
  });

  if (!technician) {
    res.status(403);
    throw new Error('Technician profile not found');
  }

  const installation = await Installation.findById(req.params.id);

  if (!installation) {
    res.status(404);
    throw new Error('Installation not found');
  }

  // A technician may update only jobs assigned to them.
  const isAssigned = installation.technicians.some(
    id => String(id) === String(technician._id)
  );

  if (!isAssigned) {
    res.status(403);
    throw new Error('You are not assigned to this installation');
  }

  // Safely handle requests without a body.
  const body = req.body || {};

  // Technicians may change only status and notes.
  const allowedFields = ['status', 'note'];
  const submittedFields = Object.keys(body);
  if (submittedFields.length === 0) {
  res.status(400);
  throw new Error('Please provide at least one field to update');
}
  const invalidField = submittedFields.find(
    field => !allowedFields.includes(field)
  );

  if (invalidField) {
    res.status(403);
    throw new Error(
      `Technicians cannot update the ${invalidField} field`
    );
  }

  if (body.status !== undefined) {
    const allowedStatuses = [
      'survey',
      'pending',
      'in-progress',
      'completed'
    ];

    if (!allowedStatuses.includes(body.status)) {
      res.status(400);
      throw new Error('Invalid installation status');
    }

    installation.status = body.status;
  }

  if (body.note !== undefined) {
    installation.note = body.note;
  }

  if (body.status === 'completed') {
    technician.assignedInstallations =
      technician.assignedInstallations.filter(
        id => String(id) !== String(installation._id)
      );

    if (
      technician.assignedInstallations.length === 0 &&
      technician.assignedMaintenance.length === 0
    ) {
      technician.status = 'available';
    } else {
      technician.status = 'busy';
    }

    await technician.save();
  }

  await installation.save();


  const updatedInstallation = await Installation.findById(
    installation._id
  )
    .populate('customer')
    .populate('systemPackage')
    .populate({
      path: 'technicians',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

  res.status(200).json({
    success: true,
    message: 'Installation updated successfully',
    data: updatedInstallation
  });
});
module.exports = {
  ...crudController,
  getAll: getInstallations,
  getById: getInstallationById,
  create: createInstallation,
  update: updateInstallation,
  updateInstallationManagement
};
