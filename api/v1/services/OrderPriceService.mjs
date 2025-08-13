import { default as orderConfig } from "../../../config/order.mjs"
import { default as rewardConfig } from "../../../config/reward.mjs"
import { debugLog } from "../../../utils/logger.mjs"

class OrderPriceService {
  static rewardTypeActions = {
    [rewardConfig.types.PERCENTAGE]: ({ applyItemsPrice, discount }) => applyItemsPrice * discount,
    [rewardConfig.types.FIXED]: ({ applyItemsPrice, discount }) =>
      Math.min(discount, applyItemsPrice),
    [rewardConfig.types.FREE_ITEM]: ({ applyItemsPrice }) => applyItemsPrice,
  }
  static rewardScopes = {
    category: "categoryId",
    subcategory: "subcategoryId",
  }
  getRewardScope(reward) {
    if (reward.applySubcategoryId)
      return {
        key: "applySubcategoryId",
        field: OrderPriceService.rewardScopes.subcategory,
      }
    if (reward.applyCategoryId)
      return {
        key: "applyCategoryId",
        field: OrderPriceService.rewardScopes.category,
      }
    return null
  }
  getApplicableItemsPrice(reward, orderItems, dishMap, itemsTotalPrice) {
    // total price - ціна без sides
    const rewardScope = this.getRewardScope(reward)
    if (!rewardScope) return itemsTotalPrice

    if (reward.type === rewardConfig.types.PERCENTAGE || reward.type === rewardConfig.types.FIXED) {
      return orderItems.reduce((acc, item) => {
        const scope = dishMap.get(item.dishId)[rewardScope.field]
        //Ціна без side (reward не дає знижку на side)
        return reward[rewardScope.key] === scope ? acc + item.price * item.quantity : acc
      }, 0)
    }

    if (reward.type === rewardConfig.types.FREE_ITEM) {
      const item = rewardScope
        ? orderItems.find((item) => {
            const scope = dishMap.get(item.dishId)[rewardScope.field]
            if (reward[rewardScope.key] === scope) return item
          })
        : orderItems[0]
      return item?.price || 0
    }

    return 0
  }
  getRewardDiscount(reward, applicableItemsPrice) {
    const discountFunc = OrderPriceService.rewardTypeActions[reward.type]
    if (!discountFunc) {
      debugLog(`Reward type '${reward.type}' is not supported`)
      return 0
    }
    return discountFunc({
      applyItemsPrice: applicableItemsPrice,
      discount: reward.discount,
    })
  }
  applyReward(reward, orderItems, dishMap, itemsTotalPrice, fullTotalPrice) {
    let isRewardApplied = false
    let rewardApplyMsg = null
    let priceWithDiscount = fullTotalPrice
    if (!reward) return { isRewardApplied, priceWithDiscount }

    const applicableItemsPrice = this.getApplicableItemsPrice(
      reward,
      orderItems,
      dishMap,
      itemsTotalPrice
    )
    debugLog("Applicable Items Price: " + applicableItemsPrice)

    if (applicableItemsPrice > 0) {
      const discount = this.getRewardDiscount(reward, applicableItemsPrice)
      priceWithDiscount -= discount
      isRewardApplied = true
    } else {
      rewardApplyMsg = "There is no item to apply a reward to."
    }
    return { isRewardApplied, priceWithDiscount, rewardApplyMsg }
  }
  getMaxPointDiscount(fullTotalPrice) {
    return fullTotalPrice * orderConfig.maxPointSalePercentage
  }
  applyPoints(usePoints, fullTotalPrice) {
    let pointsUsed = 0
    let priceWithDiscount = fullTotalPrice
    if (usePoints <= 0) return { pointsUsed, priceWithDiscount }

    const maxDiscount = this.getMaxPointDiscount(fullTotalPrice)
    const requestedDiscount = usePoints * orderConfig.pointsUseRate
    const discount = Math.min(requestedDiscount, maxDiscount)
    priceWithDiscount -= discount
    pointsUsed = Math.ceil(discount / orderConfig.pointsUseRate)

    return { pointsUsed, priceWithDiscount }
  }
  getFullTotalPrice(orderItems) {
    //prices without discount
    let itemsTotalPrice = 0
    let sidesTotalPrice = 0
    let fullTotalPrice = 0

    for (const item of orderItems) {
      itemsTotalPrice += item.price * item.quantity
      for (const side of item.sides) {
        sidesTotalPrice += side.price * item.quantity
      }
    }

    fullTotalPrice = itemsTotalPrice + sidesTotalPrice

    return { itemsTotalPrice, sidesTotalPrice, fullTotalPrice }
  }
  getDiscountData(reward, usePoints, orderItems, dishMap) {
    const { fullTotalPrice, itemsTotalPrice, sidesTotalPrice } = this.getFullTotalPrice(orderItems)
    let discountedTotalPrice = fullTotalPrice
    let isRewardApplied = false
    let rewardApplyMsg = null
    if (reward) {
      const {
        isRewardApplied: isApplied,
        priceWithDiscount,
        rewardApplyMsg: applyMsg,
      } = this.applyReward(reward, orderItems, dishMap, itemsTotalPrice, fullTotalPrice)
      discountedTotalPrice = priceWithDiscount
      isRewardApplied = isApplied
      rewardApplyMsg = applyMsg
    }
    let pointsUsed = 0
    if (usePoints > 0 && !isRewardApplied) {
      const { priceWithDiscount, pointsUsed: points } = this.applyPoints(usePoints, fullTotalPrice)
      discountedTotalPrice = priceWithDiscount
      pointsUsed = points
    }

    return { discountedTotalPrice, pointsUsed, isRewardApplied, rewardApplyMsg }
  }
}

export default new OrderPriceService()
