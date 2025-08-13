import { sequelize } from "../../../config/db.mjs"
import { DataTypes } from "sequelize"

const Location = sequelize.define(
  "location",
  {
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address is required",
        },
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
  },
  {
    timestamps: false,
    underscored: true,
  }
)

export default Location
