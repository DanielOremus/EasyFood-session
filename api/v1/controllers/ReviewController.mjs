import { formatReviewsResponse } from "../../../utils/responseHelper.mjs"
import ReviewService from "../services/ReviewService.mjs"
import { validationResult } from "express-validator"
class ReviewController {
  static async addReview(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, msg: errors.array() })

    const dishId = req.params.id
    const userId = req.user.id

    const { comment, rating } = req.body
    try {
      const review = await ReviewService.create({
        dishId,
        userId,
        comment,
        rating,
      })

      res.status(201).json({
        success: true,
        msg: "Review added successfully",
        data: {
          dishId: review.dishId,
          restaurantId: review.restaurantId,
          comment: review.comment,
          rating: review.rating,
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async getReviewsByDishId(req, res) {
    const dishId = req.params.id
    try {
      const reviews = await ReviewService.getAllByDishId(dishId)

      const resReviews = formatReviewsResponse(reviews)
      res.json({ success: true, data: resReviews })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default ReviewController
