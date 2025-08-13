import Location from "../models/Location.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import { sequelize } from "../../../config/db.mjs"
import UserService from "./UserService.mjs"
import { debugLog } from "../../../utils/logger.mjs"

class LocationService extends CRUDManager {
  async getAllByUserId(userId) {
    try {
      await UserService.getById(userId)
      return await super.getAll({ userId: userId }, { exclude: ["userId"] })
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        await UserService.getById(data.userId, null, null, {
          transaction: t,
        })

        const location = await super.create(data, {
          attributes: { exclude: ["userId"] },
          transaction: t,
        })

        return location
      })
      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new LocationService(Location)
