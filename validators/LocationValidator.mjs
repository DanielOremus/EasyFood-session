class LocationValidator {
  static defaultSchema = {
    address: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Address is required",
      },
      isLength: {
        options: {
          max: 255,
        },
        errorMessage: "Address can contain at most 255 chars",
      },
    },
    lat: {
      notEmpty: {
        errorMessage: "Latitude is required",
        bail: true,
      },
      isFloat: {
        options: {
          min: -90,
          max: 90,
        },
        errorMessage: "Latitude must be a float and its value must be between -90 and 90",
      },
      toFloat: true,
    },
    lng: {
      notEmpty: {
        errorMessage: "Longitude is required",
        bail: true,
      },
      isFloat: {
        options: {
          min: -180,
          max: 180,
        },
        errorMessage: "Longitude must be a float and its value must be between -180 and 180",
      },
      toFloat: true,
    },
  }
}

export default LocationValidator
