import { Router } from "express"
import UserController from "../controllers/UserController.mjs"
import {
  ensureAccOwnerOrAdmin,
  requireAdmin,
  requireAuth,
  ownerChecker,
} from "../../../middlewares/auth.mjs"
import { checkSchema } from "express-validator"
import UserValidator from "../../../validators/UserValidator.mjs"
import upload from "../../../middlewares/multer.mjs"
import LocationValidator from "../../../validators/LocationValidator.mjs"
import LocationController from "../controllers/LocationController.mjs"
import OrderController from "../controllers/OrderController.mjs"
import CardValidator from "../../../validators/CardValidator.mjs"
import CardController from "../controllers/CardController.mjs"
import RewardController from "../controllers/RewardController.mjs"
import RewardValidator from "../../../validators/RewardValidator.mjs"

const router = Router()

router.get("/", requireAdmin, UserController.getUsersList)

router.get(
  "/:id/locations",
  ensureAccOwnerOrAdmin("params", "id"),
  LocationController.getUserLocations
)

router.get(
  "/:id/orders",
  ensureAccOwnerOrAdmin("params", "id"),
  OrderController.getOrdersByUserId
)

router.get("/me", requireAuth, UserController.getOwnProfile)

router.get("/:id", requireAdmin, UserController.getUserById)

router.get(
  "/:id/rewards",
  ensureAccOwnerOrAdmin("params", "id"),
  RewardController.getRewardsByUserId
)

router.get("/:id/cards", ownerChecker("params", "id"), CardController.getCardsByUserId)

router.post(
  "/:id/locations",
  ownerChecker("params", "id"),
  checkSchema(LocationValidator.defaultSchema),
  LocationController.addUserLocation
)

router.post(
  "/:id/cards",
  ownerChecker("params", "id"),
  checkSchema(CardValidator.defaultSchema),
  CardController.createCard
)

router.post(
  "/:id/rewards",
  requireAdmin,
  checkSchema(RewardValidator.addForUserSchema),
  RewardController.addRewardForUser
)

router.put(
  "/:id",
  ownerChecker("params", "id"),
  upload.single("avatar"),
  checkSchema(UserValidator.updateSchema),
  UserController.updateUserById
)

router.put(
  "/:id/password",
  ownerChecker("params", "id"),
  checkSchema(UserValidator.newPasswordSchema),
  UserController.updatePassword
)
export default router
