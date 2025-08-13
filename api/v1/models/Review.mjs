import { DataTypes } from "sequelize"
import { sequelize } from "../../../config/db.mjs"

const Review = sequelize.define(
  "review",
  {
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      validate: {
        min: 1,
      },
      get() {
        return parseFloat(this.getDataValue("rating"))
      },
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Comment is required",
        },
        len: {
          args: [5, 500],
          msg: "Comment must contain 5-500 chars",
        },
      },
    },
  },
  {
    updatedAt: false,
    underscored: true,
  }
)

export default Review
