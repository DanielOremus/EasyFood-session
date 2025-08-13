import Order from "../models/Order.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import UserReward from "../models/UserReward.mjs"
import UserService from "./UserService.mjs"
import OrderItem from "../models/OrderItem.mjs"
import { default as orderConfig } from "../../../config/order.mjs"
import { sequelize } from "../../../config/db.mjs"
import OrderStatusHandler from "./OrderStatusHandler.mjs"
import { default as businessValidator } from "../businessValidators/order.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import CustomError from "../../../utils/CustomError.mjs"
import OrderItemSide from "../models/OrderItemSide.mjs"
import OrderPriceService from "./OrderPriceService.mjs"
import { generateDishMap, generateOrderItemsArr } from "../../../utils/orderHelpers.mjs"

class OrderService extends CRUDManager {
  static fieldsConfig = [
    {
      fieldName: "status",
      filterCategory: "search",
    },
  ]
  static paginationDefaultData = {
    page: 0,
    perPage: 5,
  }
  async getAllByUserId(id, reqQuery) {
    try {
      await UserService.getById(id)
      return await super.getAllWithQuery(
        reqQuery,
        OrderService.fieldsConfig,
        OrderService.paginationDefaultData,
        { userId: id },
        { exclude: ["userId"] },
        {
          model: OrderItem,
          as: "items",
          attributes: {
            exclude: ["orderId"],
          },
          include: {
            model: OrderItemSide,
            as: "sides",
            attributes: {
              exclude: ["orderItemId", "sideId"],
            },
          },
        },

        {
          order: [["createdAt", "DESC"]],
        }
      )
    } catch (error) {
      debugLog(error)
      throw error
    }
  }

  async getById(
    id,
    projection = null,
    populateParams = {
      model: OrderItem,
      as: "items",
      attributes: {
        exclude: ["orderId"],
      },
    },
    options = {}
  ) {
    try {
      const order = await super.getById(id, projection, populateParams, options)
      if (!order) throw new CustomError("Order not found", 404)

      return order
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const { user, existDishes } = await businessValidator.validateOrderData(data, t)

        const reward = user.userRewards?.[0]?.reward

        const dishMap = generateDishMap(existDishes)
        const orderItems = generateOrderItemsArr(data.items, dishMap)

        const { discountedTotalPrice, isRewardApplied, pointsUsed, rewardApplyMsg } =
          OrderPriceService.getDiscountData(reward, data.usePoints, orderItems, dishMap)

        const order = await super.create(
          {
            userId: user.id,
            restaurantId: data.restaurantId,
            deliveryAddress: data.deliveryAddress,
            paymentMethod: data.paymentMethod,
            pointsUsed,
            rewardApplied: isRewardApplied ? reward.code : null,
            totalAmount: discountedTotalPrice,
            status: orderConfig.statuses.PENDING,
            items: orderItems,
          },
          {
            include: {
              model: OrderItem,
              as: "items",
              include: {
                model: OrderItemSide,
                as: "sides",
              },
            },
            transaction: t,
          }
        )

        if (isRewardApplied) {
          await UserReward.update(
            { isClaimed: true, claimedDate: new Date() },
            {
              where: {
                userId: user.id,
                rewardId: reward.id,
              },
              transaction: t,
            }
          )
        }

        if (pointsUsed > 0) {
          await UserService.model.update(
            { points: sequelize.literal(`points-${pointsUsed}`) },
            {
              where: {
                id: user.id,
              },
              transaction: t,
            }
          )
        }

        return { order, orderItems, rewardApplyMsg }
      })
      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }

  async updateStatus(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const order = await super.getById(
          data.orderId,
          ["id", "status", "userId", "rewardApplied", "pointsUsed", "totalAmount"],
          null,
          { transaction: t }
        )
        if (!order) throw new CustomError("Order not found", 404)

        const { pointsEarned } = await OrderStatusHandler.handleStatusChange(order, data.status, t)

        await super.update(order.id, { status: data.status }, { transaction: t })

        return pointsEarned
      })
      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new OrderService(Order)
