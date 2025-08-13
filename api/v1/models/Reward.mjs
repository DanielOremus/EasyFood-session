import { sequelize } from "../../../config/db.mjs"
import { DataTypes } from "sequelize"

const Reward = sequelize.define(
  "reward",
  {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required",
        },
        len: {
          args: [1 - 50],
          msg: "Title must be between 1-50 chars",
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
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    pointsRequired: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: "Code must be between 1-50 chars",
        },
      },
    },
    type: {
      type: DataTypes.ENUM("percentage", "fixed", "free_item"),
      allowNull: false,
    },

    expireDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    createdAt: "startDate",
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        fields: ["code"],
      },
    ],
  }
)

export default Reward
