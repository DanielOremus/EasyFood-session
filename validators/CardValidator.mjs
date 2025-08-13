class CardValidator {
  static defaultSchema = {
    cardNumber: {
      trim: true,
      notEmpty: {
        errorMessage: "Card number is required",
        bail: true,
      },
      // isCreditCard: {
      //   errorMessage: "Card number is invalid",
      // },
      matches: {
        options: new RegExp(/^[0-9]{13,19}$/),
        errorMessage: "Card number is invalid",
      },
    },
    brand: {
      trim: true,
      notEmpty: {
        errorMessage: "Card brand is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 50,
          errorMessage: "Card brand must be at most 50 chars long",
        },
      },
    },
    holderName: {
      trim: true,
      notEmpty: {
        errorMessage: "Holder name is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 50,
        },
        errorMessage: "Holder name must be at most 50 chars long",
      },
    },
    expMonth: {
      trim: true,
      notEmpty: {
        errorMessage: "Expire month is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 2,
          errorMessage: "Expire month must be at most 2 chars long",
        },
        bail: true,
      },
      matches: {
        options: new RegExp(/^(0[1-9]|1[0-2])$/),
        errorMessage: "Expire month is invalid",
      },
    },
    expYear: {
      trim: true,
      notEmpty: {
        errorMessage: "Expire year is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 2,
          errorMessage: "Expire year must be at most 2 chars long",
        },
        bail: true,
      },
      matches: {
        options: new RegExp(/^(2[5-9]|[3-4][0-9]|5[0-5])$/),
        errorMessage: "Expire year is invalid",
      },
    },
    isDefault: {
      optional: true,
      isBoolean: {
        errorMessage: "Must be boolean",
      },
      toBoolean: true,
    },
  }
}

export default CardValidator
