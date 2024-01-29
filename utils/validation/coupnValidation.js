/**
 * countryValidation.js
 * @description :: validate each post and put request as per country model
 */

const joi = require("joi");
const {
  options,
  isCountOnly,
  populate,
  select,
} = require("./commonFilterValidation");

/** validation keys and properties of country */
exports.schemaKeys = joi
  .object({
    code: joi.string().allow(null).allow(""),
    discount: joi.number().allow(null).allow(""),
    discount_type: joi.string().allow(null).allow(""),
    seller: joi.string().allow(null).allow(""),
  })
  .unknown(true);

/** validation keys and properties of country for updation */
exports.updateSchemaKeys = joi
  .object({
    code: joi.string().allow(null).allow(""),
    discount: joi.number().allow(null).allow(""),
    discount_type: joi.string().allow(null).allow(""),
    seller: joi.string().allow(null).allow(""),
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  })
  .unknown(true);

let keys = ["query", "where"];
/** validation keys and properties of country for filter documents from collection */
exports.findFilterKeys = joi
  .object({
    options: options,
    ...Object.fromEntries(
      keys.map((key) => [
        key,
        joi
          .object({
            countryName: joi
              .alternatives()
              .try(joi.array().items(), joi.string(), joi.object()),
            phoneCode: joi
              .alternatives()
              .try(joi.array().items(), joi.string(), joi.object()),
            isActive: joi
              .alternatives()
              .try(joi.array().items(), joi.boolean(), joi.object()),
            isDeleted: joi
              .alternatives()
              .try(joi.array().items(), joi.boolean(), joi.object()),
            id: joi.any(),
            _id: joi
              .alternatives()
              .try(
                joi.array().items(),
                joi.string().regex(/^[0-9a-fA-F]{24}$/),
                joi.object()
              ),
          })
          .unknown(true),
      ])
    ),
    isCountOnly: isCountOnly,
    populate: joi.array().items(populate),
    select: select,
  })
  .unknown(true);
