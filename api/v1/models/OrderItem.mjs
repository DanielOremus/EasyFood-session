import { DataTypes } from "sequelize"
import { sequelize } from "../../../config/db.mjs"

const OrderItem = sequelize.define(
  "orderItem",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
)

export default OrderItem
