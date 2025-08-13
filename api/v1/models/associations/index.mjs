import Location from "../Location.mjs"
import User from "../User.mjs"
import Restaurant from "../Restaurant.mjs"
import Dish from "../Dish.mjs"
import UserReward from "../UserReward.mjs"
import Card from "../Card.mjs"
import Review from "../Review.mjs"
import Order from "../Order.mjs"
import OrderItem from "../OrderItem.mjs"
import Side from "../Side.mjs"
import Reward from "../Reward.mjs"
import Category from "../Category.mjs"
import Subcategory from "../Subcategory.mjs"
import OrderItemSide from "../OrderItemSide.mjs"

export default function () {
  //User
  User.hasMany(Location, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  Location.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  User.hasMany(Card, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  Card.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  User.hasMany(Order, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  Order.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  User.hasMany(Review, {
    foreignKey: {
      name: "userId",
      allowNull: true,
    },
    onDelete: "SET NULL",
  })

  Review.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: true,
    },
    onDelete: "SET NULL",
  })

  User.hasMany(UserReward, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  UserReward.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Reward.hasMany(UserReward, {
    foreignKey: {
      name: "rewardId",
      allowNull: false,
    },
    // as: "reward",
    onDelete: "CASCADE",
  })
  UserReward.belongsTo(Reward, {
    foreignKey: {
      name: "rewardId",
      allowNull: false,
    },
    // as: "reward",
    onDelete: "CASCADE",
  })

  Category.hasMany(Reward, {
    foreignKey: {
      name: "applyCategoryId",
      allowNull: true,
    },
  })

  Reward.belongsTo(Category, {
    foreignKey: {
      name: "applyCategoryId",
      allowNull: true,
    },
  })

  Subcategory.hasMany(Reward, {
    foreignKey: {
      name: "applySubcategoryId",
      allowNull: true,
    },
  })

  Reward.belongsTo(Subcategory, {
    foreignKey: {
      name: "applySubcategoryId",
      allowNull: true,
    },
  })
  //Restaurant

  Restaurant.hasMany(Review, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  Review.belongsTo(Restaurant, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Restaurant.hasMany(Order, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Order.belongsTo(Restaurant, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Restaurant.hasMany(Dish, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  Dish.belongsTo(Restaurant, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  //Dish

  Dish.hasMany(Side, {
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },

    onDelete: "CASCADE",
  })
  Side.belongsTo(Dish, {
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },

    onDelete: "CASCADE",
  })

  Dish.hasMany(Review, {
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Review.belongsTo(Dish, {
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  //Order

  Order.hasMany(OrderItem, {
    foreignKey: { name: "orderId", allowNull: false },
    as: "items",
    onDelete: "CASCADE",
  })
  OrderItem.belongsTo(Order, {
    foreignKey: { name: "orderId", allowNull: false },
    as: "items",
    onDelete: "CASCADE",
  })

  Dish.hasMany(OrderItem, {
    foreignKey: { name: "dishId", allowNull: true },
    onDelete: "SET NULL",
  })

  OrderItem.belongsTo(Dish, {
    foreignKey: { name: "dishId", allowNull: true },
    onDelete: "SET NULL",
  })

  // OrderItem.belongsToMany(Side, {
  //   through: "order_item_sides",
  //   timestamps: false,
  //   as: "sides",
  // })
  // Side.belongsToMany(OrderItem, {
  //   through: "order_item_sides",
  //   timestamps: false,
  //   as: "orderItems",
  // })
  OrderItem.hasMany(OrderItemSide, {
    foreignKey: { name: "orderItemId", allowNull: false },
    onDelete: "CASCADE",
    as: "sides",
  })
  OrderItemSide.belongsTo(OrderItem, {
    foreignKey: { name: "orderItemId", allowNull: false },
    onDelete: "CASCADE",
    as: "sides",
  })

  Side.hasMany(OrderItemSide, {
    foreignKey: { name: "sideId", allowNull: true },
    onDelete: "SET NULL",
  })

  OrderItemSide.belongsTo(Side, {
    foreignKey: { name: "sideId", allowNull: true },
    onDelete: "SET NULL",
  })

  //Categories

  Subcategory.hasMany(Dish, {
    foreignKey: {
      name: "subcategoryId",
      allowNull: false,
    },
  })
  Dish.belongsTo(Subcategory, {
    foreignKey: {
      name: "subcategoryId",
      allowNull: false,
    },
  })

  Category.hasMany(Subcategory, {
    foreignKey: {
      name: "categoryId",
      allowNull: false,
    },
  })

  Subcategory.belongsTo(Category, {
    foreignKey: {
      name: "categoryId",
      allowNull: false,
    },
  })

  console.log("Successfully made associations")
}
