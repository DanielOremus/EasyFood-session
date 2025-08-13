import { sequelize } from "../../../config/db.mjs"
import CustomError from "../../../utils/CustomError.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import { v4 as uuidv4 } from "uuid"
import config from "../../../config/default.mjs"
import RewardService from "./RewardService.mjs"
import UserReward from "../models/UserReward.mjs"
import UserService from "./UserService.mjs"
import { comparePasswords } from "../../../utils/authHelpers.mjs"

class AuthService {
  async register(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const [user, created] = await UserService.model.findOrCreate({
          where: { email: data.email },
          defaults: data,
          transaction: t,
        })
        if (!created) throw new CustomError("This email is already in use", 400)

        const availableRewards = await RewardService.getAll(
          {
            pointsRequired: user.points,
          },
          null,
          null,
          {
            transaction: t,
          }
        )

        if (availableRewards.length) {
          await UserReward.bulkCreate(
            availableRewards.map((reward) => ({
              userId: user.id,
              rewardId: reward.id,
              isClaimed: false,
            })),
            {
              transaction: t,
            }
          )
        }

        return user
      })
      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async login(data) {
    try {
      const user = await UserService.getOne(
        { email: data.email },
        { exclude: ["phone", "createdAt"] },
        null
      )
      if (!user) throw new CustomError("Invalid email or password", 401)

      const isSame = await comparePasswords(data.password, user.password)
      if (!isSame) throw new CustomError("Invalid email or password", 401)

      return user
    } catch (error) {
      debugLog(error)

      throw error
    }
  }
}

export default new AuthService()
