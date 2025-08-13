import User from "../models/User.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import { sequelize } from "../../../config/db.mjs"
import UploadsManager from "../../../utils/UploadsManager.mjs"
import { v4 as uuidv4 } from "uuid"
import CustomError from "../../../utils/CustomError.mjs"
import { comparePasswords } from "../../../utils/authHelpers.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import { Op } from "sequelize"

class UserService extends CRUDManager {
  async getAll(
    filters = {},
    projection = ["id", "username", "avatarUrl", "isAdmin"],
    populateParams = null
  ) {
    return await super.getAll(filters, projection, populateParams)
  }
  async getById(id, projection = { exclude: ["password"] }, populateParams = null, options = {}) {
    try {
      const user = await super.getById(id, projection, populateParams, options)
      if (!user) throw new CustomError("User not found", 404)
      return user
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async update(id, data) {
    let fileName
    try {
      const result = await sequelize.transaction(async (t) => {
        const isEmailTaken = await super.getAll(
          {
            id: {
              [Op.ne]: id,
            },
            email: data.email,
          },
          ["id"],
          null,
          {
            transaction: t,
          }
        )

        if (isEmailTaken.length > 0) throw new CustomError("This email is already in use", 400)
        const exists = await super.getById(id, ["avatarUrl"], null, {
          transaction: t,
        })

        if (!exists) throw new CustomError("User not found", 404)

        const currentAvatarUrl = exists.avatarUrl
        if (data.avatar) {
          if (data.avatar?.buffer) {
            fileName = `avatar_${uuidv4()}.png`
            const relativePath = await UploadsManager.uploadToSubfolder(
              "avatars",
              fileName,
              data.avatar.buffer
            )
            data.avatarUrl = relativePath
          } else {
            data.avatarUrl = data.avatar
          }
        }

        //Робимо зміни в бд
        const affected = await super.update(id, data, {
          individualHooks: true,
          transaction: t,
        })

        //Якщо шлях до аватару певного рядка не співпадає: спробуємо видалити старий аватар
        if (affected && currentAvatarUrl && data.avatarUrl && currentAvatarUrl !== data.avatarUrl)
          await UploadsManager.deleteAbsolute(currentAvatarUrl)

        const user = await super.getById(id, { exclude: ["password"] }, null, {
          transaction: t,
        })

        return user
      })

      return result
    } catch (error) {
      //Якщо щось пішло не так: видаляємо раніше створений аватар
      if (fileName) {
        await UploadsManager.deleteFromSubfolder("avatars", fileName).catch((e) => {
          console.log("Failed to delete uploaded avatar: " + e.message)
        })
      }

      debugLog(error)

      throw error
    }
  }
  async updatePassword(id, data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const user = await super.getById(id, ["password"], null, {
          transaction: t,
        })
        if (!user) throw new CustomError("User not found", 404)
        const isValid = await comparePasswords(data.password, user.password)
        if (!isValid) throw new CustomError("Incorrect password", 400)
        const isSame = await comparePasswords(data.newPassword, user.password)
        if (isSame) throw new CustomError("Current password is the same as the new one", 400)
        await super.update(
          id,
          { password: data.newPassword },
          {
            individualHooks: true,
            transaction: t,
          }
        )

        return true
      })
      return result
    } catch (error) {
      debugLog(error)

      throw error
    }
  }
}

export default new UserService(User)
