import RestaurantService from "../services/RestaurantService.mjs"
import { validationResult } from "express-validator"

class RestaurantController {
  static async getRestaurantsList(req, res) {
    try {
      const { documents, count, page, perPage } = await RestaurantService.getAllWithQuery(req.query)

      res.json({ success: true, page, perPage, data: documents, count })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async getRestaurantById(req, res) {
    const id = req.params.id
    try {
      const restaurant = await RestaurantService.getById(id)

      res.json({
        success: true,
        data: restaurant,
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async createOrUpdateRestaurant(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const id = req.params.id

    const {
      name,
      address,
      price,
      lat,
      lng,
      imageUrl = null,
      openHours,
      description,
      cuisineType,
    } = req.body

    let image

    if (req.file) {
      image = req.file
    }
    try {
      const data = {
        name,
        address,
        price,
        lat,
        lng,
        imageUrl,
        image,
        openHours,
        description,
        cuisineType,
      }
      let restaurant
      let statusCode
      if (id) {
        restaurant = await RestaurantService.update(id, data)
        statusCode = 200
      } else {
        restaurant = await RestaurantService.create(data)
        statusCode = 201
      }

      res.status(statusCode).json({ success: true, data: restaurant })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async deleteRestaurant(req, res) {
    const id = req.params.id
    try {
      await RestaurantService.delete(id)
      res.json({ success: true, msg: "Restaurant and attached dishes were successfully deleted" })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default RestaurantController
