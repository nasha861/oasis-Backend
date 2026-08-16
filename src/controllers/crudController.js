const asyncHandler = require('express-async-handler');
const { sendSuccess } = require('../utils/apiResponse');

const createCrudController = (Model, options = {}) => {
  const populate = options.populate || [];
  const searchableFields = options.searchableFields || [];
  const filterFields = options.filterFields || [];

  const applyPopulate = (query) => {
    populate.forEach((path) => {
      query.populate(path);
    });
    return query;
  };

  return {
    create: asyncHandler(async (req, res) => {
      const data = { ...req.body };
      console.log('CRUD create request user:', req.user);

      const userId = req.user?._id;

        ['user', 'author', 'owner', 'createdBy'].forEach(field => {
          if (Model.schema.paths[field] && userId) {
            data[field] = userId;
          }
        });
        if (!userId) {
          console.log('CRUD create: no authenticated user available for', Model.modelName);
        }
      

      const document = await Model.create(data);

      sendSuccess(res, document, `${Model.modelName} created`, 201);
    }),
  
    getAll: asyncHandler(async (req, res) => {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
      const skip = (page - 1) * limit;
      const filters = {};

      filterFields.forEach((field) => {
        if (req.query[field] !== undefined) {
          filters[field] = req.query[field];
        }
      });

      if (req.query.search && searchableFields.length) {
        filters.$or = searchableFields.map((field) => ({
          [field]: { $regex: req.query.search, $options: 'i' }
        }));
      }

      const sort = req.query.sort || '-createdAt';
      const query = applyPopulate(Model.find(filters).sort(sort).skip(skip).limit(limit));
      const [documents, total] = await Promise.all([query, Model.countDocuments(filters)]);

      sendSuccess(res, documents, `${Model.modelName} records fetched`, 200, {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      });
    }),

    getById: asyncHandler(async (req, res) => {
      const document = await applyPopulate(Model.findById(req.params.id)).lean();

      if (!document) {
        res.status(404);
        throw new Error(`${Model.modelName} not found`);
      }

      sendSuccess(res, document, `${Model.modelName} fetched`);
    }),

    update: asyncHandler(async (req, res) => {
      const document = await applyPopulate(
        Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
        })
      );

      if (!document) {
        res.status(404);
        throw new Error(`${Model.modelName} not found`);
      }

      sendSuccess(res, document, `${Model.modelName} updated`);
    }),

    remove: asyncHandler(async (req, res) => {
      const document = await Model.findByIdAndDelete(req.params.id);

      if (!document) {
        res.status(404);
        throw new Error(`${Model.modelName} not found`);
      }

      sendSuccess(res, { id: document._id }, `${Model.modelName} deleted`);
    })
  };
};

module.exports = createCrudController;
