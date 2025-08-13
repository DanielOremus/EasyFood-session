import User from "../models/User.mjs"
import { default as orderConfig } from "../../../config/order.mjs"
import { sequelize } from "../../../config/db.mjs"
import UserReward from "../models/UserReward.mjs"
import Reward from "../models/Reward.mjs"
import { Op } from "sequelize"
import CustomError from "../../../utils/CustomError.mjs"

class OrderStatusHandler {
  static statusActions = {
    [orderConfig.statuses.PENDING]: () => true,
    [orderConfig.statuses.PREPARING]: () => true,
    [orderConfig.statuses.DELIVERED]: async (order, transaction) => {
      const pointsEarned = Math.floor(order.totalAmount * orderConfig.pointsCollectRate)
      await User.update(
        {
          points: sequelize.literal(`points + ${pointsEarned}`),
        },
        {
          where: { id: order.userId },
          transaction,
        }
      )

      const user = await User.findByPk(order.userId, {
        transaction,
        attributes: ["points", "id"],
        include: {
          model: UserReward,
          attributes: ["rewardId"],
        },
      })

      const userRewardsIds = user.userRewards.map(({ rewardId }) => rewardId)

      const availableRewards = await Reward.findAll({
        where: {
          id: {
            [Op.notIn]: userRewardsIds,
          },
          pointsRequired: {
            [Op.lte]: user.points,
          },
        },
        transaction,
      })

      if (availableRewards.length) {
        await UserReward.bulkCreate(
          availableRewards.map((reward) => ({
            userId: user.id,
            rewardId: reward.id,
            isClaimed: false,
          })),
          {
            transaction,
          }
        )
      }

      return { pointsEarned }
    },
    [orderConfig.statuses.CANCELLED]: async (order, transaction) => {
      return true
    },
  }
  async handleStatusChange(order, status, transaction) {
    console.log(order.status)

    if (
      order.status === orderConfig.statuses.DELIVERED ||
      order.status === orderConfig.statuses.CANCELLED
    )
      throw new CustomError("Order is already delivered or cancelled", 422)
    if (!OrderStatusHandler.statusActions[status]) {
      throw new CustomError(`Order status '${status}' is not supported`, 400)
    }
    const { pointsEarned } = await OrderStatusHandler.statusActions[status](order, transaction)
    return { pointsEarned }
  }
}

export default new OrderStatusHandler()
