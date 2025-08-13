import { DataTypes } from "sequelize"
import { sequelize } from "../../../config/db.mjs"

const Subcategory = sequelize.define(
  "subcategory",
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

export default Subcategory
