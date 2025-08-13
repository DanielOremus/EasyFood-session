import { DataTypes } from "sequelize"
import { sequelize } from "../../../config/db.mjs"
const Restaurant = sequelize.define(
  "restaurant",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: "Name is required",
        len: {
          args: [1, 255],
          msg: "Name must be between 1-255 chars",
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: "Name is required",
        len: {
          args: [1, 255],
          msg: "Address must be between 1-255 chars",
        },
      },
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    openHours: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Open hours are required",
        },
        len: {
          args: [1, 255],
          msg: "Open hours must be between 1-255 chars",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required",
        },
        len: {
          args: [1, 255],
          msg: "Description must be between 1-255 chars",
        },
      },
    },
    cuisineType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Cuisine type is required",
        },
        len: {
          args: [1, 100],
          msg: "Description must be between 1-100 chars",
        },
      },
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
)

export default Restaurant
