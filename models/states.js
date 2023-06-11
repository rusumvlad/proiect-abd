const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
  zip: {
    type: Number,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  city: {
    type: String,
  },
  state_id: {
    type: String,
  },
  state_name: {
    type: String,
  },
  zcta: {
    type: Boolean,
  },
  population: {
    type: Number,
  },
  density: {
    type: Number,
  },
  country_fips: {
    type: Number,
  },
  country_name: {
    type: String,
  },
  country_weights: {
    type: Object,
  },
  country_name_all: {
    type: String,
  },
  country_fips_all: {
    type: String,
  },
  imprecise: {
    type: Boolean,
  },
  military: {
    type: Boolean,
  },
  timezone: {
    type: String,
  },
  geo: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
});

module.exports = mongoose.model("states", StateSchema);
