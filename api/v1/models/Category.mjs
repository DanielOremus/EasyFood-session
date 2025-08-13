import { DataTypes } from "sequelize"
import { sequelize } from "../../../config/db.mjs"

const Category = sequelize.define(
  "category",
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
)

export default Category
