const States = require("../models/states");

exports.getStates = async (req, res) => {
  try {
    const states = await States.find();
    return res.json(states);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Get the states with a total population of over 10 million
exports.getStatesByPopulation = async (req, res) => {
  const populationCompareNumber = 100000; //10millions doesn't exists
  try {
    const states = await States.find({
      population: { $gt: populationCompareNumber },
    });
    return res.json(states);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Get the average city population by state
exports.getAverageCityPopulationByState = async (req, res) => {
  const selectedState = req.params.state;
  try {
    const states = await States.aggregate([
      {
        $match: { state_name: selectedState },
      },
      {
        $group: {
          _id: null,
          averagePopulation: { $avg: "$population" },
        },
      },
      {
        $project: {
          _id: 0,
          averagePopulation: { $floor: "$averagePopulation" },
        },
      },
    ]);
    return res.json(states);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get the largest and the smallest city in each state
exports.getCityListSorted = async (req, res) => {
  try {
    const states = await States.aggregate([
      {
        $sort: {
          population: -1,
        },
      },
      {
        $group: {
          _id: "$state_id",
          state_name: { $first: "$state_name" },
          largestCity: { $first: "$city" },
          smallestCity: { $last: "$city" },
        },
      },
      {
        $project: {
          _id: 0,
          state_name: 1,
          largestCity: 1,
          smallestCity: 1,
        },
      },
    ]);
    res.json(states);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

//Get the largest and the smallest counties in each state
exports.getCountryListSorted = async (req, res) => {
  try {
    const states = await States.aggregate([
      {
        $sort: {
          population: -1,
        },
      },
      {
        $group: {
          _id: "$state_id",
          state_name: { $first: "$state_name" },
          largestCountry: { $first: "$county_name" },
          smallestCountry: { $last: "$county_name" },
        },
      },
      {
        $project: {
          _id: 0,
          state_name: 1,
          largestCountry: 1,
          smallestCountry: 1,
        },
      },
    ]);
    res.json(states);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

//Get the nearest 10 zips from one of Chicago's landmarks, the Willis Tower situated at coordinates 41.878876, -87.635918.
exports.getZip = async (req, res) => {
  try {
    const maxDistance = 2500; // in Meters
    const limitOfResults = 10;
    const states = await States.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [-87.635918, 41.878876], // Willis Tower coordinates
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: maxDistance,
        },
      },
      { $limit: limitOfResults },
      {
        $project: {
          _id: 0,
          city: 1,
          zip: 1,
          distance: 1,
        },
      },
    ]);
    res.json(states);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

// Get the total population situated between 50 and 200 kms around New York's landmark, the Statue of Liberty at coordinates 40.689247, -74.044502
exports.getTotalPopulation = async (req, res) => {
  try {
    const minDistance = 50000; // In meters
    const maxDistance = 200000; // In meters
    const states = await States.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [-74.044502, 40.689247], // Statue of Liberty coordinates
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: maxDistance,
        },
      },
      {
        $match: {
          distance: {
            $gte: minDistance,
            $lte: maxDistance,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPopulation: { $sum: "$population" },
        },
      },
      {
        $project: {
          _id: 0,
          totalPopulation: 1,
        },
      },
    ]);
    res.json(states);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

exports.updateGeo = async (req, res) => {
  try {
    const states = await States.find();

    states.forEach(async (state) => {
      state.geo = {
        type: "Point",
        coordinates: [state.lng, state.lat],
      };
      await state.save();
    });

    res.json(states);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};
