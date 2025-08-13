import UserService from "../services/UserService.mjs"
import { validationResult } from "express-validator"

class UserController {
  static async getUsersList(req, res) {
    try {
      const users = await UserService.getAll()
      res.json({ success: true, data: users })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async getUserById(req, res) {
    const id = req.params.id
    try {
      const user = await UserService.getById(id)
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async getOwnProfile(req, res) {
    try {
      const user = await UserService.getById(req.user.id)

      res.json({
        success: true,
        data: user,
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async updateUserById(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const id = req.params.id
    const { username, phone, email, avatarUrl } = req.body

    let avatar = avatarUrl

    if (req.file) {
      avatar = req.file
    }
    try {
      const user = await UserService.update(id, {
        username,
        phone,
        email,
        avatar,
      })

      res.json({ success: true, data: user })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async updatePassword(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const id = req.params.id
    const { password, newPassword } = req.body

    try {
      await UserService.updatePassword(id, {
        newPassword,
        password,
      })

      res.json({ success: true, msg: "Password was changed successfully" })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default UserController
