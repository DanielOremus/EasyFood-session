import { Router } from "express"
import DishController from "../controllers/DishController.mjs"
import ReviewController from "../controllers/ReviewController.mjs"
import { requireAdmin } from "../../../middlewares/auth.mjs"
import { checkSchema } from "express-validator"
import DishValidator from "../../../validators/DishValidator.mjs"
import upload from "../../../middlewares/multer.mjs"

const router = Router()

router.get("/", DishController.getDishesList)

router.get("/:id", DishController.getDishById)

router.get("/:id/reviews", ReviewController.getReviewsByDishId)

router.post(
  "/",
  requireAdmin,
  upload.single("image"),
  checkSchema(DishValidator.defaultSchema),
  DishController.createOrUpdateDish
)

router.put(
  "/:id",
  requireAdmin,
  upload.single("image"),
  checkSchema(DishValidator.defaultSchema),
  DishController.createOrUpdateDish
)

router.delete("/:id", requireAdmin, DishController.deleteDish)

export default router
