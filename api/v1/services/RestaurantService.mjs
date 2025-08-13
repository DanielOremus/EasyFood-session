import CustomError from "../../../utils/CustomError.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import { sequelize } from "../../../config/db.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import Dish from "../models/Dish.mjs"
import Restaurant from "../models/Restaurant.mjs"
import { v4 as uuidv4 } from "uuid"
import UploadsManager from "../../../utils/UploadsManager.mjs"

class RestaurantService extends CRUDManager {
  static fieldsConfig = [
    {
      fieldName: "name",
      filterCategory: "search",
    },
    {
      fieldName: "cuisineType",
      filterCategory: "search",
    },
  ]
  static paginationDefaultData = {
    page: 0,
    perPage: 8,
  }
  async getAllWithQuery(
    reqQuery,
    filters = {},
    projection = null,
    populateParams = null,
    options = {}
  ) {
    try {
      return await super.getAllWithQuery(
        reqQuery,
        RestaurantService.fieldsConfig,
        RestaurantService.paginationDefaultData,
        filters,
        projection,
        populateParams,
        options
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
      model: Dish,
      as: "dishes",
      attributes: {
        exclude: ["restaurantId", "subcategoryId"],
      },
    },
    options = {}
  ) {
    try {
      const restaurant = await super.getById(id, projection, populateParams, options)
      if (!restaurant) throw new CustomError("Restaurant not found", 404)

      return restaurant
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async create(data) {
    let fileName
    try {
      const result = await sequelize.transaction(async (t) => {
        if (data.image?.buffer) {
          fileName = `restaurant_${uuidv4()}.png`
          const relativePath = await UploadsManager.uploadToSubfolder(
            "restaurants",
            fileName,
            data.image.buffer
          )
          data.imageUrl = relativePath
        }

        //Створюємо ресторан в бд
        return await super.create(data, {
          transaction: t,
        })
      })

      return result
    } catch (error) {
      //Якщо щось пішло не так: видаляємо раніше створене зображення ресторану
      if (fileName) {
        await UploadsManager.deleteFromSubfolder("restaurants", fileName).catch((e) => {
          console.log("Failed to delete uploaded restaurant image: " + e.message)
        })
      }
      debugLog(error)
      throw error
    }
  }
  async update(id, data) {
    let fileName
    try {
      const result = await sequelize.transaction(async (t) => {
        const exists = await super.getById(id, ["imageUrl"], null, {
          transaction: t,
        })
        if (!exists) throw new CustomError("Restaurant not found", 404)

        const currentImageUrl = exists.imageUrl
        if (data.image?.buffer) {
          fileName = `restaurant_${uuidv4()}.png`
          const relativePath = await UploadsManager.uploadToSubfolder(
            "restaurants",
            fileName,
            data.image.buffer
          )
          data.imageUrl = relativePath
        }
        //Робимо зміни в бд
        const affected = await super.update(id, data, {
          transaction: t,
        })
        //Якщо шлях до зображення певного рядка не співпадає: спробуємо видалити старе зображення
        if (affected && currentImageUrl && currentImageUrl !== data.imageUrl)
          await UploadsManager.deleteAbsolute(currentImageUrl)

        return await super.getById(id, null, null, { transaction: t })
      })
      return result
    } catch (error) {
      if (fileName) {
        await UploadsManager.deleteFromSubfolder("restaurants", fileName).catch((e) => {
          console.log("Failed to delete uploaded restaurant image: " + e.message)
        })
      }
      debugLog(error)
      throw error
    }
  }
  async delete(id) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const exists = await super.getById(id, ["imageUrl"], null, {
          transaction: t,
        })
        if (!exists) throw new CustomError("Restaurant not found", 404)

        await Promise.all([
          UploadsManager.deleteAbsolute(exists.imageUrl),
          super.delete(id, { transaction: t }),
        ])
        return true
      })

      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new RestaurantService(Restaurant)
