import OrderService from "../services/OrderService.mjs"
import { validationResult } from "express-validator"

class OrderController {
  static async getOrdersByUserId(req, res) {
    const userId = req.params.id
    try {
      const { documents, count, page, perPage } = await OrderService.getAllByUserId(
        userId,
        req.query
      )

      res.json({
        success: true,
        page,
        perPage,
        count,
        data: documents,
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async getOrderById(req, res) {
    const id = req.params.id
    try {
      const order = await OrderService.getById(id)

      res.json({ success: true, data: order })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async createOrder(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const userId = req.user.id

    const { restaurantId, items, deliveryAddress, paymentMethod, cardId, usePoints, rewardCode } =
      req.body

    try {
      const { order, orderItems, rewardApplyMsg } = await OrderService.create({
        userId,
        restaurantId,
        items,
        deliveryAddress,
        paymentMethod,
        cardId,
        usePoints,
        rewardCode,
      })

      const resOrder = order.toJSON()
      resOrder.items = orderItems

      return res.status(201).json({
        success: true,
        data: resOrder,
        msg: rewardApplyMsg || undefined,
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async updateOrderStatus(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const { status } = req.body
    const orderId = req.params.id
    try {
      const pointsEarned = await OrderService.updateStatus({
        orderId,
        status,
      })

      res.json({
        success: true,
        msg: "Order status successfully changed",
        data: {
          orderId,
          status,
          pointsEarned,
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async
}

export default OrderController
