const asyncHandler = require('express-async-handler');
const Installation = require('../models/Installation');
const Customer = require('../models/Customer');
const Technician = require('../models/Technician');

const createCrudController = require('./crudController');

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
  const customer = await Customer.findOne({
    user: req.user._id
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer profile not found');
  }

  const data = {
    ...req.body,
    customer: customer._id
  };

  const installation = await Installation.create(data);

  const populatedInstallation = await Installation.findById(
    installation._id
  )
    .populate('customer')
    .populate('systemPackage')
    .populate('technicians');

  res.status(201).json({
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

          if (
            technician.assignedInstallations.length === 0 &&
            technician.assignedMaintenance.length === 0
          ) {
            technician.status = 'available';
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


module.exports = {
  ...crudController,
  create: createInstallation,
  updateInstallationManagement
};