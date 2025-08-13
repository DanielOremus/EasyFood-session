import { Router } from "express"
import usersRoutes from "./users.mjs"
import authRoutes from "./auth.mjs"
import restaurantsRoutes from "./restaurants.mjs"
import orderRoutes from "./orders.mjs"
import dishesRoutes from "./dishes.mjs"
import rewardRoutes from "./rewards.mjs"
import docsRoutes from "./docs.mjs"

const router = Router()

router.use("/users", usersRoutes)
router.use("/auth", authRoutes)
router.use("/restaurants", restaurantsRoutes)
router.use("/orders", orderRoutes)
router.use("/dishes", dishesRoutes)
router.use("/rewards", rewardRoutes)
router.use("/docs", docsRoutes)

export default router
