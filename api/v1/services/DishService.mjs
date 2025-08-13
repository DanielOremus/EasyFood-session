import Dish from "../models/Dish.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import CustomError from "../../../utils/CustomError.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import RestaurantService from "./RestaurantService.mjs"
import { sequelize } from "../../../config/db.mjs"
import { v4 as uuidv4 } from "uuid"
import UploadsManager from "../../../utils/UploadsManager.mjs"
import Side from "../models/Side.mjs"
import Subcategory from "../models/Subcategory.mjs"
import Category from "../models/Category.mjs"
import SubcategoryService from "./SubcategoryService.mjs"

class DishService extends CRUDManager {
  static fieldsConfig = [
    {
      fieldName: "name",
      filterCategory: "search",
    },
    {
      fieldName: "price",
      filterCategory: "range",
    },
    {
      fieldName: "kcal",
      filterCategory: "range",
    },
    {
      fieldName: "weight",
      filterCategory: "range",
    },
    {
      fieldName: "proteins",
      filterCategory: "range",
    },
    {
      fieldName: "carbs",
      filterCategory: "range",
    },
    {
      fieldName: "rating",
      filterCategory: "range",
    },
    {
      fieldName: "restaurantId",
      filterCategory: "list",
    },
    {
      fieldName: "subcategoryId",
      filterCategory: "list",
    },
    {
      fieldName: "categoryId",
      filterCategory: "list",
      refModel: Subcategory,
    },
  ]
  static paginationDefaultData = {
    page: 0,
    perPage: 8,
  }
  async getAllWithQuery(
    reqQuery,
    filters = {},
    projection = { exclude: ["restaurantId", "subcategoryId"] },
    populateParams = {
      model: Subcategory,
      attributes: ["id", "name"],
      include: {
        model: Category,
        attributes: ["id", "name"],
      },
    },
    options = {}
  ) {
    try {
      return await super.getAllWithQuery(
        reqQuery,
        DishService.fieldsConfig,
        DishService.paginationDefaultData,
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
  async getAllByRestId(
    restId,
    projection = { exclude: ["restaurantId", "subcategoryId"] },
    populateParams = {
      model: Subcategory,
      attributes: ["id", "name"],
      include: {
        model: Category,
        attributes: ["id", "name"],
      },
    }
  ) {
    try {
      await RestaurantService.getById(restId)
      return await super.getAll({ restaurantId: restId }, projection, populateParams)
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async getById(
    id,
    projection = { exclude: ["restaurantId", "subcategoryId"] },
    populateParams = [
      {
        model: Side,
        attributes: {
          exclude: ["dishId"],
        },
        as: "sides",
      },
      {
        model: Subcategory,
        attributes: ["id", "name"],
        include: {
          model: Category,
          attributes: ["id", "name"],
        },
      },
    ],
    options = {}
  ) {
    const dish = await super.getById(id, projection, populateParams, options)
    if (!dish) throw new CustomError("Dish not found", 404)
    return dish
  }
  async create(data) {
    let fileName
    try {
      const result = await sequelize.transaction(async (t) => {
        await Promise.all([
          RestaurantService.getById(data.restaurantId, ["id"], null, {
            transaction: t,
          }),
          SubcategoryService.getById(data.subcategoryId, ["id"], null, {
            transaction: t,
          }),
        ])
        if (data.image?.buffer) {
          fileName = `dish_${uuidv4()}.png`
          const relativePath = await UploadsManager.uploadToSubfolder(
            "dishes",
            fileName,
            data.image.buffer
          )
          data.imageUrl = relativePath
        }

        //Створюємо страву в бд
        return await super.create(data, {
          transaction: t,
        })
      })

      return result
    } catch (error) {
      //Якщо щось пішло не так: видаляємо раніше створене зображення страви
      if (fileName) {
        await UploadsManager.deleteFromSubfolder("dishes", fileName).catch((e) => {
          console.log("Failed to delete uploaded dish image: " + e.message)
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
        await Promise.all([
          RestaurantService.getById(data.restaurantId, ["id"], null, {
            transaction: t,
          }),
          SubcategoryService.getById(data.subcategoryId, ["id"], null, {
            transaction: t,
          }),
        ])
        const exists = await super.getById(id, ["imageUrl"], null, {
          transaction: t,
        })
        if (!exists) throw new CustomError("Dish not found", 404)
        const currentImageUrl = exists.imageUrl
        if (data.image?.buffer) {
          fileName = `dish_${uuidv4()}.png`
          const relativePath = await UploadsManager.uploadToSubfolder(
            "dishes",
            fileName,
            data.image.buffer
          )
          data.imageUrl = relativePath
        }
        //Робимо зміни в бд
        const affected = await super.update(id, data, {
          transaction: t,
        })
        //Якщо шлях до аватару певного рядка не співпадає: спробуємо видалити старий аватар
        if (affected && currentImageUrl && currentImageUrl !== data.imageUrl)
          await UploadsManager.deleteAbsolute(currentImageUrl)

        return await super.getById(id, null, null, { transaction: t })
      })
      return result
    } catch (error) {
      if (fileName) {
        await UploadsManager.deleteFromSubfolder("dishes", fileName).catch((e) => {
          console.log("Failed to delete uploaded dish image: " + e.message)
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
        if (!exists) throw new CustomError("Dish not found", 404)

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

export default new DishService(Dish)
