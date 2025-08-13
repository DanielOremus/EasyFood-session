import { validationResult } from "express-validator"
import RewardService from "../services/RewardService.mjs"
import { formatUserRewardsResponse } from "../../../utils/responseHelper.mjs"

class RewardController {
  static async getRewardsByUserId(req, res) {
    const userId = req.params.id
    try {
      const userRewards = await RewardService.getAllByUserId(userId)
      const resRewards = formatUserRewardsResponse(userRewards)
      res.json({ success: true, data: resRewards })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async getRewardsList(req, res) {
    try {
      const rewards = await RewardService.getAll()

      res.json({ success: true, data: rewards })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async addRewardForUser(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const userId = req.params.id
    const rewardId = req.body.rewardId
    try {
      await RewardService.addRewardForUser({ userId, rewardId })
      res.json({ success: true, msg: "User got reward successfully" })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default RewardController
