export default Object.freeze({
  pointsUseRate: 0.5, //1 point = 0.5 currency value
  pointsCollectRate: 0.6, //1 point = 0.6 currency value
  maxPointSalePercentage: 0.2,
  paymentMethods: {
    CASH: "cash",
    CARD: "card",
  },
  statuses: {
    PENDING: "pending",
    PREPARING: "preparing",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
  },
})
