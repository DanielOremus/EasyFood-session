import { validationResult } from "express-validator"
import CardService from "../services/CardService.mjs"

class CardController {
  static async getCardsByUserId(req, res) {
    const userId = req.params.id
    try {
      const cards = await CardService.getAllByUserId(userId)

      res.json({ success: true, data: cards })
    } catch (error) {
      return res.status(400).json({ success: false, msg: error.message })
    }
  }
  static async createCard(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, msg: errors.array() })

    const userId = req.user.id
    const { cardNumber, brand, holderName, expMonth, expYear, isDefault } =
      req.body
    try {
      const card = await CardService.create({
        userId,
        cardNumber,
        brand,
        holderName,
        expMonth,
        expYear,
        isDefault,
      })

      res.status(201).json({
        success: true,
        msg: "Card was successfully added",
        data: {
          cardId: card.id,
          isDefault: card.isDefault,
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default CardController
