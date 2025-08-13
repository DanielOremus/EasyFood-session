import { Router } from "express"
import RewardController from "../controllers/RewardController.mjs"
const router = Router()

router.get("/", RewardController.getRewardsList)

export default router
