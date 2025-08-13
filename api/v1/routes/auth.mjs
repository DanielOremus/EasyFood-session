import { Router } from "express"
import AuthController from "../controllers/AuthController.mjs"
import rateLimiter from "../../../middlewares/rateLimiter.mjs"
import UserValidator from "../../../validators/UserValidator.mjs"
import { checkSchema } from "express-validator"

const router = Router()

router.post(
  "/register",
  rateLimiter,
  checkSchema(UserValidator.registerSchema),
  AuthController.register
)

router.post("/login", rateLimiter, checkSchema(UserValidator.loginSchema), AuthController.login)

router.post("/logout", AuthController.logout)

export default router
