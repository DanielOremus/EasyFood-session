import { sequelize } from "../../../config/db.mjs"
import { DataTypes } from "sequelize"

const Order = sequelize.define(
  "order",
  {
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Delivery address is required",
        },
      },
    },

    paymentMethod: {
      type: DataTypes.ENUM("card", "cash"),
      allowNull: false,
    },
    pointsUsed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    rewardApplied: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "preparing", "delivered", "cancelled"),
      allowNull: false,
    },
  },
  {
    updatedAt: false,
    underscored: true,
  }
)

export default Order
