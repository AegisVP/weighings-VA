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
        type: Schema.Types.ObjectId,
        ref: 'autos',
        required: true,
      },
      driver: {
        type: Schema.Types.ObjectId,
        ref: 'drivers',
        required: true,
      },
    },
    crop: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'crops',
        required: true,
      },
      source: {
        type: Schema.Types.ObjectId,
        ref: 'sources',
        required: true,
      },
      destination: {
        type: Schema.Types.ObjectId,
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
      isIncoming: {
        type: Boolean,
        default: true,
        required: true,
      },
    },
    harvesters: [
      {
        id: {
          type: Schema.Types.ObjectId,
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
    id: Joi.objectId().required(),
    driver: Joi.string().required(),
  },
  crop: {
    name: Joi.string().required(),
    source: Joi.string()
      // .valid(...allConstants.sourcesList)
      .required(),
    destination: Joi.string()
      // .valid(...allConstants.destinationsList)
      .required(),
  },
  weighing: {
    tare: Joi.number().required(),
    brutto: Joi.number().required(),
    netto: Joi.number(),
    isIncoming: Joi.boolean().required(),
  },
  harvesters: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
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
