const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      // required: true,
    },
    country: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
    },
    streetAddress: {
      type: String,
      // required: true,
    },
    secondStreetAddress: {
      type: String,
      // required: false,
    },
    zipCode: {
      type: Number,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(findOrCreate);
module.exports = mongoose.model("User", userSchema);
