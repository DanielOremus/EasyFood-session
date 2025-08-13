import { default as rewardConfig } from "../config/reward.mjs"
import CustomIdValidator from "./CustomIdValidator.mjs"

class RewardValidator {
  static defaultSchema = {
    title: {
      trim: true,
      notEmpty: {
        errorMessage: "Title is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 50,
        },
        errorMessage: "Title must be at most 50 chars long",
      },
    },
    description: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Description is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        errorMessage: "Description must be at most 255 chars long",
      },
    },
    type: {
      trim: true,
      toLowerCase: true,
      notEmpty: {
        errorMessage: "Type is required",
        bail: true,
      },
      custom: {
        options: (v) => {
          const rewardTypes = Object.values(rewardConfig.types)
          if (!rewardTypes.includes(v))
            throw new Error(`Reward type '${v}' is not supported`)
          return true
        },
      },
    },
  }
  static addForUserSchema = {
    rewardId: {
      custom: {
        options: (v) => {
          const validator = new CustomIdValidator("Reward ID")
          validator.validate(v)
          return true
        },
      },
    },
  }
}

export default RewardValidator
