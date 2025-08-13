import CRUDManager from "../models/CRUDManager/index.mjs"
import Subcategory from "../models/Subcategory.mjs"

class SubcategoryService extends CRUDManager {
  async getById(id, projection = null, populateParams = {}, options = {}) {
    try {
      const subcategory = await super.getById(
        id,
        projection,
        populateParams,
        options
      )
      if (!subcategory) throw new CustomError("Subcategory not found", 404)

      return subcategory
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new SubcategoryService(Subcategory)
