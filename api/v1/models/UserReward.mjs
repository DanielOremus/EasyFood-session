import { DataTypes } from "sequelize"
import { sequelize } from "../../../config/db.mjs"

const UserReward = sequelize.define(
  "userReward",
  {
    isClaimed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    claimedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
)

export default UserReward
