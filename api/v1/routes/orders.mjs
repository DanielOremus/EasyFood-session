import { Router } from "express"
import OrderController from "../controllers/OrderController.mjs"
import { ensureAccOwnerOrAdmin, requireAdmin, requireAuth } from "../../../middlewares/auth.mjs"
import { checkSchema } from "express-validator"
import OrderValidator from "../../../validators/OrderValidator.mjs"
const router = Router()

router.post(
  "/",
  requireAuth,
  checkSchema(OrderValidator.defaultSchema),
  OrderController.createOrder
)

router.get("/:id", ensureAccOwnerOrAdmin("params", "id"), OrderController.getOrderById)

router.put(
  "/:id/status",
  requireAdmin,
  checkSchema(OrderValidator.statusSchema),
  OrderController.updateOrderStatus
)

export default router
