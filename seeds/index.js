const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const axios = require("axios");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "FyptLXOPmTy11XVE42dLILiIdZV38gqNHHWxBNVE77A",
        collections: 483251,
      },
    });
    return resp.data.urls.small;
  } catch (e) {
    console.log(e);
  }
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 2; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: await seedImg(),
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, voluptate.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
