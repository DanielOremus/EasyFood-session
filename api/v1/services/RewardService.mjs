import { sequelize } from "../../../config/db.mjs"
import CustomError from "../../../utils/CustomError.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import UserService from "./UserService.mjs"
import UserReward from "../models/UserReward.mjs"
import Reward from "../models/Reward.mjs"

class RewardService extends CRUDManager {
  async getAllByUserId(id) {
    try {
      const user = await UserService.getById(id, null, {
        model: UserReward,
        where: {
          userId: id,
        },
        attributes: {
          exclude: ["rewardId", "userId"],
        },
        include: {
          model: this.model,
          as: "reward",
        },
        required: false,
      })

      return user.userRewards || []
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async getById(id, projection = null, populateParams = null, options = {}) {
    try {
      const reward = await super.getById(id, projection, populateParams, options)
      if (!reward) throw new CustomError("Reward not found", 404)

      return reward
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async addRewardForUser(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const [user] = await Promise.all([
          UserService.getById(
            data.userId,
            null,
            {
              model: UserReward,
              where: {
                rewardId: data.rewardId,
              },
              required: false,
            },
            { transaction: t }
          ),
          this.getById(data.rewardId, null, null, { transaction: t }),
        ])

        if (user.userRewards.length > 0) throw new CustomError("User already has this reward", 409)

        const userReward = await UserReward.create(
          { userId: data.userId, rewardId: data.rewardId },
          { transaction: t }
        )

        return userReward
      })

      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new RewardService(Reward)
