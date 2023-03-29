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
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    secondStreetAddress: {
      type: String,
      required: false,
    },
    zipCode: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(UniqueValidator);

module.exports = mongoose.model("User", userSchema);
