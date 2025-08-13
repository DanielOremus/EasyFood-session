import LocationService from "../services/LocationService.mjs"
import { validationResult } from "express-validator"
class LocationController {
  static async getUserLocations(req, res) {
    const id = req.params.id
    try {
      const locations = await LocationService.getAllByUserId(id)
      return res.json({ success: true, data: locations })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async addUserLocation(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const { address, lat, lng } = req.body
    const id = req.params.id
    try {
      const location = await LocationService.create({
        userId: id,
        address,
        lat,
        lng,
      })

      return res.json({
        success: true,
        msg: "Location added",
        data: {
          id: location.id,
          address: location.address,
          lat: location.lat,
          lng: location.lng,
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default LocationController
