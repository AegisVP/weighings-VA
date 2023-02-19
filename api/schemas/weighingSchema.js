const { Schema } = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const now = new Date();

const weighingDbSchema = new Schema(
  {
    date: {
      year: {
        type: Number,
        required: true,
        default: now.getFullYear(),
      },
      month: {
        type: Number,
        required: true,
        default: now.getMonth() + 1,
      },
      day: {
        type: Number,
        required: true,
        default: now.getDate(),
      },
    },
    auto: {
      id: {
        type: String,
        ref: 'autos',
        required: true,
      },
      driver: {
        type: String,
        ref: 'drivers',
        required: true,
      },
    },
    crop: {
      id: {
        type: String,
        ref: 'crops',
        required: true,
      },
      source: {
        type: String,
        ref: 'sources',
        required: true,
      },
      destination: {
        type: String,
        ref: 'destinations',
        required: true,
      },
    },
    weighing: {
      tare: {
        type: Number,
        required: true,
      },
      brutto: {
        type: Number,
        required: true,
      },
      netto: {
        type: Number,
        required: true,
      },
    },
    harvesters: [
      {
        id: {
          type: String,
          ref: 'harvesters',
          required: true,
        },
        weight: {
          type: Number,
          required: true,
        },
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const addSchema = Joi.object({
  date: {
    year: Joi.number().required(),
    month: Joi.number().required(),
    day: Joi.number().required(),
  },
  auto: {
    id: Joi.string().required(),
    driver: Joi.string().required(),
  },
  crop: {
    id: Joi.string().required(),
    source: Joi.string().required(),
    destination: Joi.string().required(),
  },
  weighing: {
    tare: Joi.number().required(),
    brutto: Joi.number().required(),
    netto: Joi.number(),
  },
  harvesters: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      weight: Joi.number(),
    })
  ),
});

module.exports = {
  weighingDbSchema,
  weighingJoiSchema: {
    addSchema,
  },
};
