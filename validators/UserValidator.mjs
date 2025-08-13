class UserValidator {
  static registerSchema = {
    username: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Username is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 3,
          max: 50,
        },
        errorMessage: "Username must be at least 3 and at most 50 chars long",
      },
    },
    email: {
      trim: true,
      notEmpty: {
        errorMessage: "Email is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        errorMessage: "Email must be at most 255 chars long",
        bail: true,
      },
      isEmail: {
        errorMessage: "Invalid email format",
      },

      normalizeEmail: true,
    },
    phone: {
      trim: true,
      notEmpty: {
        errorMessage: "Phone number is required",
        bail: true,
      },
      isNumeric: {
        errorMessage: "Must provide a valid phone number",
        bail: true,
      },
      isMobilePhone: {
        options: ["uk-UA"],
        errorMessage: "Must provide a valid UA phone number",
      },
    },
    password: {
      trim: true,
      notEmpty: {
        errorMessage: "Password is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 3,
          max: 16,
        },
        errorMessage: "Password must be at least 3 and at most 16 chars long",
      },
    },
  }
  static loginSchema = {
    email: {
      trim: true,
      notEmpty: {
        errorMessage: "Email is required",
        bail: true,
      },
      isEmail: {
        errorMessage: "Invalid email format",
      },
      normalizeEmail: true,
    },
    password: {
      trim: true,
      notEmpty: {
        errorMessage: "Password is required",
      },
    },
  }
  static newPasswordSchema = {
    password: UserValidator.loginSchema.password,
    newPassword: {
      trim: true,
      notEmpty: {
        errorMessage: "New password is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 3,
          max: 16,
        },
        errorMessage: "New password must be at least 3 and at most 16 chars long",
      },
    },
  }
  static updateSchema = {
    username: UserValidator.registerSchema.username,
    phone: UserValidator.registerSchema.phone,
    email: UserValidator.registerSchema.email,
    avatarUrl: {
      optional: true,
      trim: true,
      notEmpty: {
        errorMessage: "Avatar url is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        bail: true,
        errorMessage: "Avatar url must be at most 255 chars",
      },
      isURL: {
        options: {
          requireTld: true,
        },
        errorMessage: "Avatar url is invalid",
      },
    },
  }
}

export default UserValidator
