import CustomIdValidator from "./CustomIdValidator.mjs"

class DishValidator {
  static nutritionValidator = (nutritionName) => ({
    trim: true,
    notEmpty: {
      errorMessage: `${nutritionName} is required`,
      bail: true,
    },
    isInt: {
      options: {
        min: 0,
      },
      errorMessage: `${nutritionName} must be a positive integer`,
    },
    toInt: true,
  })
  static defaultSchema = {
    restaurantId: {
      custom: {
        options: (v) => {
          const validator = new CustomIdValidator("Restaurant Id")
          validator.validate(v)
          return true
        },
      },
    },
    name: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Name is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 50,
        },
        errorMessage: "Name must be at most 50 chars long",
      },
    },
    description: {
      optional: true,
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Description is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 500,
        },
        errorMessage: "Description must be at most 500 chars long",
      },
    },
    price: {
      trim: true,
      notEmpty: {
        errorMessage: "Price is required",
        bail: true,
      },
      isFloat: {
        options: {
          min: 0,
        },
        errorMessage: "Price must be a non negative float",
      },
      toFloat: true,
    },
    imageUrl: {
      optional: true,
      trim: true,
      notEmpty: {
        errorMessage: "Image url is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        bail: true,
        errorMessage: "Image url must be at most 255 chars",
      },
      isURL: {
        options: {
          requireTld: true,
        },
        errorMessage: "Image url is invalid",
      },
    },
    kcal: {
      ...DishValidator.nutritionValidator("Kcal"),
      isInt: {
        options: {
          gt: 0,
        },
        errorMessage: "Kcal must be a positive integer",
      },
    },
    weight: {
      ...DishValidator.nutritionValidator("Weight"),
      isInt: {
        options: {
          gt: 0,
        },
        errorMessage: "Weight must be a positive integer",
      },
    },
    proteins: {
      ...DishValidator.nutritionValidator("Proteins"),
    },
    carbs: {
      ...DishValidator.nutritionValidator("Carbs"),
    },
    fats: {
      ...DishValidator.nutritionValidator("Fats"),
    },
    rating: {
      trim: true,
      notEmpty: {
        errorMessage: "Rating is required",
        bail: true,
      },
      isFloat: {
        options: {
          min: 0,
          max: 5,
        },
        errorMessage: "Rating must be a float with value 0-5",
      },
      toFloat: true,
    },
    subcategoryId: {
      custom: {
        options: (v) => {
          const validator = new CustomIdValidator("Subcategory ID")
          validator.validate(v)
          return true
        },
      },
    },
    isAvailable: {
      optional: true,
      trim: true,
      isBoolean: {
        errorMessage: "Is available must be a boolean",
      },
      toBoolean: true,
    },
  }
}

export default DishValidator
