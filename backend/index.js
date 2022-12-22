import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";
dotenv.config(); //load env variables

//get access from mongoClient
const MongoClient = mongodb.MongoClient;

//if 5000 cannot be accessed use 8000
const port = process.env.PORT || 8000;

//connect the database
MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  maxPoolSize: 50, //50 people
  wtimeoutMS: 2500, //every 2500 millisec request will timeout
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    //get the initial reference to the restaurants collection in db
    await RestaurantsDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
