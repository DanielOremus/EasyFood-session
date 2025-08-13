import CRUDManager from "../models/CRUDManager.mjs"
import OrderItem from "../models/order_item/OrderItem.mjs"

class OrderItemService extends CRUDManager {}

export default new OrderItemService(OrderItem)
