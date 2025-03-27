// validations/productValidations.js
import { body, param } from "express-validator";
import mongoose from "mongoose";
import {
  Category,
  Product,
  SubCategory,
  Unit,
} from "../models/products/productsModel.js";
import { findOneDocument, isValidObjectId } from "../utils/dbUtils.js";

export const createCategoryRules = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .custom(async (name) => {
      const category = await findOneDocument(Category, { name });
      if (category) {
        return Promise.reject("Category already exists");
      }
    }),
  body("description").optional().isString(),
];

export const createSubCategoryRules = [
  param("category")
    .notEmpty()
    .withMessage("Category ID is required")
    .bail()
    .custom(isValidObjectId("Category ID"))
    .bail()
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        return Promise.reject("Category does not exist");
      }
    }),
  body("name")
    .notEmpty()
    .withMessage("Sub Category name is required")
    .bail()
    .custom(async (name, { req }) => {
      const subCategory = await findOneDocument(SubCategory, {
        name,
        parent: req.params.category,
      });
      if (subCategory) {
        return Promise.reject("Sub Category already exists");
      }
    }),
  body("description").optional().isString(),
];

export const getSubCategoriesRules = [
  param("category")
    .notEmpty()
    .withMessage("Category ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid category ID.")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        return Promise.reject("Category does not exist");
      }
    }),
];

export const createUnitRules = [
  body("name")
    .notEmpty()
    .withMessage("Unit name is required")
    .custom(async (name) => {
      const unit = await Unit.findOne({ name });
      if (unit) {
        return Promise.reject("Unit already exists");
      }
    }),
  body("description").optional().isString(),
];
