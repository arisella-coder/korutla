// utils/dbUtils.js
/**
 * Creates and saves a new document.
 * @param {Mongoose.Model} Model - The Mongoose model.
 * @param {Object} data - Data to create the document.
 * @returns {Promise<Object>} - The saved document.
 */
export const createDocument = async (Model, data) => {
  const doc = new Model(data);
  return await doc.save();
};

export const findDocuments = async (Model, filter = {}, options = {}) => {
  const { skip = 0, limit = 0, sort = {} } = options;
  return await Model.find(filter).skip(skip).limit(limit).sort(sort);
};

/**
 * Returns a custom validator function to check if a value is a valid ObjectId.
 * @param {string} fieldName - The name of the field (used in error message).
 * @returns {Function} - Custom validator function.
 */
export const isValidObjectId = (fieldName = "ID") => {
  return (value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error(`Invalid ${fieldName}.`);
    }
    return true;
  };
};

/**
 * Finds a single document that matches the provided filter.
 * @param {Mongoose.Model} Model - The Mongoose model.
 * @param {Object} filter - The filter to use for the query.
 * @returns {Promise<Object|null>} - The found document or null if not found.
 */
export const findOneDocument = async (Model, filter = {}) => {
  return await Model.findOne(filter);
};

/**
 * Finds a document by ID.
 * @param {Mongoose.Model} Model - The Mongoose model.
 * @param {String} id - The document ID.
 * @returns {Promise<Object|null>} - The found document or null if not found.
 */
export const findDocumentById = async (Model, id) => {
  return await Model.findById(id);
};

/**
 * Updates a document based on filter.
 * @param {Mongoose.Model} Model - The Mongoose model.
 * @param {Object} filter - The filter to match the document.
 * @param {Object} updateData - The data to update.
 * @param {Object} options - Additional options (default new: true).
 * @returns {Promise<Object|null>} - The updated document.
 */
export const updateDocument = async (
  Model,
  filter,
  updateData,
  options = {}
) => {
  return await Model.findOneAndUpdate(filter, updateData, {
    new: true,
    ...options,
  });
};

/**
 * Counts documents that match a filter.
 * @param {Mongoose.Model} Model - The Mongoose model.
 * @param {Object} filter - The filter criteria.
 * @returns {Promise<Number>} - The count of documents.
 */
export const countDocuments = async (Model, filter = {}) => {
  return await Model.countDocuments(filter);
};
