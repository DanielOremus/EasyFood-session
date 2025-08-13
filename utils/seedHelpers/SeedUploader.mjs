import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import User from "../../api/v1/models/User.mjs"
import Restaurant from "../../api/v1/models/Restaurant.mjs"
import Reward from "../../api/v1/models/Reward.mjs"
import Dish from "../../api/v1/models/Dish.mjs"
import Review from "../../api/v1/models/Review.mjs"
import Side from "../../api/v1/models/Side.mjs"
import Order from "../../api/v1/models/Order.mjs"
import OrderItem from "../../api/v1/models/OrderItem.mjs"
import UserReward from "../../api/v1/models/UserReward.mjs"
import Card from "../../api/v1/models/Card.mjs"
import Location from "../../api/v1/models/Location.mjs"
import Category from "../../api/v1/models/Category.mjs"
import Subcategory from "../../api/v1/models/Subcategory.mjs"

class SeedUploader {
  static __filename = fileURLToPath(import.meta.url)
  static __dirname = path.dirname(SeedUploader.__filename)
  static getFilePath(fileName) {
    return path.join(SeedUploader.__dirname, `../seed/${fileName}`)
  }

  static async uploadTable(entity, seedName) {
    const filePath = SeedUploader.getFilePath(seedName)
    const data = await fs.readFile(filePath, "utf8")
    const items = JSON.parse(data)
    await entity.bulkCreate(items)
  }
  static async getEntityPromises(entity, seedName) {
    const filePath = SeedUploader.getFilePath(seedName)
    const data = await fs.readFile(filePath, "utf8")
    const items = JSON.parse(data)
    return items.map((item) => entity.create(item))
  }

  static async uploadUsers() {
    const promises = await this.getEntityPromises(User, "users.json")
    await Promise.all[promises]
    // await this.uploadTable(User, "users.json")
    console.log("Users seed was uploaded successfully")
  }
  static async uploadRests() {
    await this.uploadTable(Restaurant, "restaurants.json")
    console.log("Restaurants seed was uploaded successfully")
  }
  static async uploadRewards() {
    await this.uploadTable(Reward, "rewards.json")
    await this.uploadTable(UserReward, "user_rewards.json")
    console.log("Rewards seed was uploaded successfully")
  }
  static async uploadDishes() {
    await this.uploadTable(Dish, "dishes.json")
    console.log("Dishes seed was uploaded successfully")
  }
  static async uploadReviews() {
    await this.uploadTable(Review, "reviews.json")
    console.log("Reviews seed was uploaded successfully")
  }
  static async uploadSides() {
    await this.uploadTable(Side, "sides.json")
    console.log("Sides seed was uploaded successfully")
  }
  static async uploadOrders() {
    await this.uploadTable(Order, "orders.json")
    await this.uploadTable(OrderItem, "order_items.json")
    console.log("Order seed was uploaded successfully")
  }
  static async uploadLocations() {
    await this.uploadTable(Location, "locations.json")
    console.log("Locations seed was uploaded successfully")
  }
  static async uploadCards() {
    await this.uploadTable(Card, "cards.json")
    console.log("Cards seed was uploaded successfully")
  }
  static async uploadCategories() {
    await this.uploadTable(Category, "categories.json")
    await this.uploadTable(Subcategory, "subcategories.json")
    console.log("Cards seed was uploaded successfully")
  }
  static async uploadAll() {
    await this.uploadUsers()
    await this.uploadRests()
    await this.uploadCategories()
    await this.uploadDishes()
    await Promise.all([
      this.uploadOrders(),
      this.uploadRewards(),
      this.uploadLocations(),
      this.uploadCards(),
      this.uploadSides(),
      this.uploadReviews(),
    ])
  }
}

export default SeedUploader
