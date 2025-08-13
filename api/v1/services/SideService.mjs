import Side from "../models/side/Side.mjs"
import CRUDManager from "../models/CRUDManager.mjs"

class SideService extends CRUDManager {}

export default new SideService(Side)
