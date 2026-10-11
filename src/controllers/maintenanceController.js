const Maintenance = require('../models/Maintenance');
const Technician = require('../models/Technician');
const Customer = require('../models/Customer');
const Installation = require('../models/Installation');

const createCrudController = require('./crudController');

const controller = createCrudController(Maintenance, {
  populate: [
    'installation',
    {
      path: 'technician',
      populate: {
        path: 'user',
        select: 'name email'
      }
    }
  ],
  filterFields: [
    'installation',
    'technician',
    'type',
    'status'
  ],
  searchableFields: ['completionNotes']
});

controller.getMyMaintenance = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      user: req.user._id
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    const installations = await Installation.find({
      customer: customer._id
    }).select('_id');

    const installationIds = installations.map(
      installation => installation._id
    );

    const maintenance = await Maintenance.find({
      installation: { $in: installationIds }
    })
      .populate('installation')
      .populate({
        path: 'technician',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: maintenance,
      message: 'Customer maintenance requests fetched'
    });
  } catch (error) {
    console.error(
      'Get customer maintenance error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch customer maintenance requests',
      error: error.message
    });
  }
};

controller.assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: 'technicianId is required'
      });
    }

    const technician = await Technician.findById(
      technicianId
    );

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    const maintenance = await Maintenance.findById(
      req.params.id
    );

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    maintenance.technician = technician._id;
    maintenance.status = 'assigned';

    await maintenance.save();

    if (
      !technician.assignedMaintenance.includes(
        maintenance._id
      )
    ) {
      technician.assignedMaintenance.push(
        maintenance._id
      );
    }

    technician.status = 'busy';

    await technician.save();

    const updatedMaintenance =
      await Maintenance.findById(
        maintenance._id
      )
        .populate('installation')
        .populate({
          path: 'technician',
          populate: {
            path: 'user',
            select: 'name email'
          }
        });

    res.status(200).json({
      success: true,
      data: updatedMaintenance,
      message: 'Technician assigned successfully'
    });

  } catch (error) {
    console.error(
      'Assign technician error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to assign technician',
      error: error.message
    });
  }
};

controller.updateTechnicianStatus = async (
  req,
  res
) => {
  try {
    const {
      status,
      completionNotes,
      scheduledDate
    } = req.body;

    const allowedStatuses = [
      'scheduled',
      'in-progress',
      'completed'
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid maintenance status'
      });
    }

    const maintenance =
      await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    const technician =
      await Technician.findOne({
        user: req.user._id
      });

    if (!technician) {
      return res.status(403).json({
        success: false,
        message: 'Technician profile not found'
      });
    }

    const isAssigned =
      maintenance.technician &&
      String(maintenance.technician) ===
        String(technician._id);

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message:
          'You are not assigned to this maintenance request'
      });
    }

    maintenance.status = status;

    if (scheduledDate) {
      maintenance.scheduledDate = scheduledDate;
    }

    if (completionNotes) {
      maintenance.completionNotes =
        completionNotes;
    }

    await maintenance.save();

    if (status === 'completed') {
      technician.status = 'available';

      technician.assignedMaintenance =
        technician.assignedMaintenance.filter(
          id =>
            String(id) !==
            String(maintenance._id)
        );

      await technician.save();
    }

    const updatedMaintenance =
      await Maintenance.findById(
        maintenance._id
      )
        .populate('installation')
        .populate({
          path: 'technician',
          populate: {
            path: 'user',
            select: 'name email'
          }
        });

    res.status(200).json({
      success: true,
      data: updatedMaintenance,
      message:
        'Technician status updated successfully'
    });

  } catch (error) {
    console.error(
      'Technician status update error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to update maintenance status',
      error: error.message
    });
  }
};


/* ==========================================
   ADMIN MAINTENANCE MANAGEMENT
========================================== */

controller.updateMaintenanceManagement = async (
  req,
  res
) => {
  try {
    const {
      technicianId,
      status,
      scheduledDate,
      completionNotes
    } = req.body;

    const maintenance =
      await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    const allowedStatuses = [
      'pending',
      'assigned',
      'scheduled',
      'in-progress',
      'completed',
      'cancelled'
    ];

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid maintenance status'
      });
    }

    /* -------------------------------
       TECHNICIAN CHANGE
    -------------------------------- */

    if (technicianId !== undefined) {

      const oldTechnicianId =
        maintenance.technician
          ? String(maintenance.technician)
          : null;

      const newTechnicianId =
        technicianId || null;

      /* Remove previous technician */

      if (
        oldTechnicianId &&
        oldTechnicianId !== newTechnicianId
      ) {
        const oldTechnician =
          await Technician.findById(
            oldTechnicianId
          );

        if (oldTechnician) {

          oldTechnician.assignedMaintenance =
            oldTechnician.assignedMaintenance.filter(
              id =>
                String(id) !==
                String(maintenance._id)
            );

          if (
            oldTechnician.assignedMaintenance
              .length === 0 &&
            oldTechnician.assignedInstallations
              .length === 0
          ) {
            oldTechnician.status = 'available';
          }

          await oldTechnician.save();
        }
      }

      /* Assign new technician */

      if (newTechnicianId) {

        const technician =
          await Technician.findById(
            newTechnicianId
          );

        if (!technician) {
          return res.status(404).json({
            success: false,
            message: 'Technician not found'
          });
        }

        maintenance.technician =
          technician._id;

        if (
          !technician.assignedMaintenance.includes(
            maintenance._id
          )
        ) {
          technician.assignedMaintenance.push(
            maintenance._id
          );
        }

        technician.status = 'busy';

        await technician.save();

      } else {

        maintenance.technician = null;

      }
    }

    /* -------------------------------
       STATUS
    -------------------------------- */

    if (status !== undefined) {
      maintenance.status = status;
    }

    /* -------------------------------
       SCHEDULED DATE
    -------------------------------- */

    if (scheduledDate !== undefined) {
      maintenance.scheduledDate =
        scheduledDate || null;
    }

    /* -------------------------------
       NOTE
    -------------------------------- */

    if (completionNotes !== undefined) {
      maintenance.completionNotes =
        completionNotes;
    }

    await maintenance.save();

    /* -------------------------------
       COMPLETED
    -------------------------------- */

    if (status === 'completed') {

      const assignedTechnician =
        maintenance.technician
          ? await Technician.findById(
              maintenance.technician
            )
          : null;

      if (assignedTechnician) {

        assignedTechnician.assignedMaintenance =
          assignedTechnician.assignedMaintenance.filter(
            id =>
              String(id) !==
              String(maintenance._id)
          );

        if (
          assignedTechnician.assignedMaintenance
            .length === 0 &&
          assignedTechnician.assignedInstallations
            .length === 0
        ) {
          assignedTechnician.status =
            'available';
        }

        await assignedTechnician.save();
      }
    }

    const updatedMaintenance =
      await Maintenance.findById(
        maintenance._id
      )
        .populate('installation')
        .populate({
          path: 'technician',
          populate: {
            path: 'user',
            select: 'name email'
          }
        });

    res.status(200).json({
      success: true,
      data: updatedMaintenance,
      message:
        'Maintenance updated successfully'
    });

  } catch (error) {
    console.error(
      'Maintenance management error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to update maintenance',
      error: error.message
    });
  }
};

module.exports = controller;