const mongoose = require("mongoose");
const UniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    streetAddress: {
      type: String,
      default: null,
    },
    secondStreetAddress: {
      type: String,
      default: null,
    },
    zipCode: {
      type: Number,
      default: null,
    },
    profilType: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    request_id: {
      type: String,
      default: null,
    },
    numberVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(UniqueValidator);

module.exports = mongoose.model("User", userSchema);
