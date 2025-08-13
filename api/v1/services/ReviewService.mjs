import Review from "../models/Review.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import { sequelize } from "../../../config/db.mjs"
import DishService from "./DishService.mjs"
import User from "../models/User.mjs"
import Restaurant from "../models/Restaurant.mjs"

class ReviewService extends CRUDManager {
  async getAllByDishId(
    id,
    projection = { exclude: ["id", "userId", "restaurantId", "dishId"] }
  ) {
    try {
      await DishService.getById(id)
      return await super.getAll({ dishId: id }, projection, {
        model: User,
        attributes: ["username", "avatarUrl"],
      })
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const dish = await DishService.getById(
          data.dishId,
          ["id"],
          {
            model: Restaurant,
          },
          { transaction: t }
        )

        return await super.create(
          { ...data, restaurantId: dish.restaurant.id },
          { transaction: t }
        )
      })

      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new ReviewService(Review)
