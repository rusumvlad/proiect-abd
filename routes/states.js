const express = require("express");

const router = express.Router();

const stateController = require("../controllers/state.controller");

router.get("/", stateController.getStates);

router.get("/population", stateController.getStatesByPopulation);

router.get(
  "/population/:state",
  stateController.getAverageCityPopulationByState
);

router.get("/cityList", stateController.getCityListSorted);

router.get("/countryList", stateController.getCountryListSorted);

router.get("/nearZip", stateController.getZip);

router.get("/populationTotal", stateController.getTotalPopulation);

router.put("/populateGeo", stateController.updateGeo);

module.exports = router;
