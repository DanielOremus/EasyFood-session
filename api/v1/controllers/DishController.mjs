import { validationResult } from "express-validator"
import DishService from "../services/DishService.mjs"
import ReviewService from "../services/ReviewService.mjs"

class DishController {
  static async getDishesList(req, res) {
    try {
      const { documents, count, page, perPage } = await DishService.getAllWithQuery(req.query)
      res.json({ success: true, page, perPage, count, data: documents })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async getRestaurantDishes(req, res) {
    const { restaurantId } = req.params
    try {
      const dishes = await DishService.getAllByRestId(restaurantId)
      res.json({ success: true, data: dishes })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async getDishById(req, res) {
    const id = req.params.id
    try {
      const dish = await DishService.getById(id)
      res.json({ success: true, data: dish })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async createOrUpdateDish(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const id = req.params.id

    const {
      restaurantId,
      name,
      description,
      price,
      imageUrl,
      kcal,
      weight,
      proteins,
      carbs,
      fats,
      rating,
      subcategoryId,
      isAvailable,
    } = req.body

    let image

    if (req.file) {
      image = req.file
    }
    try {
      const data = {
        restaurantId,
        name,
        description,
        price,
        imageUrl,
        image,
        kcal,
        weight,
        proteins,
        carbs,
        fats,
        rating,
        subcategoryId,
        isAvailable,
      }
      let dish
      let statusCode
      if (id) {
        dish = await DishService.update(id, data)
        statusCode = 200
      } else {
        dish = await DishService.create(data)
        statusCode = 201
      }

      res.status(statusCode).json({ success: true, data: dish })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async deleteDish(req, res) {
    const id = req.params.id
    try {
      await DishService.delete(id)

      res.json({ success: true, msg: "Dish was successfully deleted" })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default DishController
