import { sequelize } from "../../../config/db.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import UserService from "./UserService.mjs"
import Card from "../models/Card.mjs"

class CardService extends CRUDManager {
  async getAllByUserId(userId) {
    try {
      const user = await UserService.getById(userId, ["id"], {
        model: Card,
        as: "cards",
        attributes: {
          exclude: ["userId"],
        },
      })

      return user.cards
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        await UserService.getById(data.userId, ["id"], null, {
          transaction: t,
        })

        const last4 = data.cardNumber.slice(-4)

        if (data.isDefault) {
          await super.updateOne(
            { userId: data.userId },
            { isDefault: false },
            {
              transaction: t,
            }
          )
        }
        console.log(data)

        const card = await super.create(
          {
            ...data,
            last4,
          },
          {
            transaction: t,
          }
        )

        return card
      })
      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new CardService(Card)
