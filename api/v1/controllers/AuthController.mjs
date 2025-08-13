import { validationResult } from "express-validator"
import AuthService from "../services/AuthService.mjs"
import { serializeUser } from "../../../utils/authHelpers.mjs"

class AuthController {
  static async register(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const { username, email, phone, password } = req.body
    try {
      const user = await AuthService.register({
        username,
        email,
        phone,
        password,
      })

      serializeUser(req, user.id)

      res.status(201).json({
        success: true,
        msg: "User created",
        data: {
          id: user.id,
          username: user.username,
          points: user.points,
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async login(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const { email, password } = req.body
    try {
      const user = await AuthService.login({ email, password })

      serializeUser(req, user.id)

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          points: user.points,
          avatarUrl: user.avatarUrl,
          isAdmin: user.isAdmin,
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err)
        return res.status(500).json({ success: false, msg: "Failed to logout, try again later" })
      res.clearCookie("connect.sid")
      res.sendStatus(204)
    })
  }
}

export default AuthController
