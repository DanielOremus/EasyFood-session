function generateSidesMap(sides) {
  const sidesMap = new Map()
  for (const side of sides) {
    const { id, name, price } = side
    sidesMap.set(`${id}`, { name, price })
  }
  return sidesMap
}
export const generateDishMap = (existDishes) => {
  const dishMap = new Map()
  for (const dish of existDishes) {
    const { id, name, price, sides, subcategory } = dish
    const sidesMap = generateSidesMap(sides)
    dishMap.set(`${id}`, {
      name,
      price,
      sidesMap,
      categoryId: subcategory.category.id,
      subcategoryId: subcategory.id,
    })
  }
  return dishMap
}
export const generateOrderItemsArr = (reqItems, dishMap) => {
  const orderItems = []
  for (const item of reqItems) {
    const dishData = dishMap.get(item.dishId)
    orderItems.push({
      dishId: item.dishId,
      quantity: item.quantity,
      price: dishData.price,
      notes: item.notes,
      sides: item.sides.map((sideId) => {
        const sideData = dishData.sidesMap.get(sideId)
        return {
          sideId,
          name: sideData.name,
          price: sideData.price,
        }
      }),
    })
  }
  return orderItems
}
