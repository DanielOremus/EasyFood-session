import { DataTypes } from "sequelize"
import { sequelize } from "../../../config/db.mjs"

const Side = sequelize.define(
  "side",
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required",
        },
        len: {
          args: [1, 50],
          msg: "Name can container 1-50 chars",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  { timestamps: false, underscored: true }
)

export default Side
