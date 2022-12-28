//DAO - Data Access Objects

import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

//use to store a reference to db
let restaurants;

export default class RestaurantsDAO {
  //initial connection to db as soon as server starts
  static async injectDB(conn) {
    //if already filled just return
    if (restaurants) {
      return;
    }
    //if not filled, connect to db and fill the var
    try {
      restaurants = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("restaurants");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${e}`
      );
    }
  }

  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        //if equals to cuisine
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    let cursor;
    //find the query from the db
    try {
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    //if no error limit the results
    //skip from beginning to next page
    const displayCursor = cursor
      .limit(restaurantsPerPage)
      .skip(restaurantsPerPage * page);

    try {
      //set it to an array
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);

      //return the arrray
      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }
  // getting the reviews from one collection & put it back into restaurant
  static async getRestaurantByID(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          //look up other items that is in reviews to add to the result
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                //match the restaurant id and find all the reviews that match the restaurant id
                $match: {
                  $expr: {
                    $eq: ["$restaurant_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "reviews",
          },
        },
        {
          //add it into the results
          $addFields: {
            reviews: "$reviews",
          },
        },
      ];
      //aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines documents enter a multi-stage pipeline that transforms the documents into aggregated results.
      return await restaurants.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`);
      throw e;
    }
  }

  static async getCuisines() {
    let cuisines = [];
    try {
      //get the cuisine one time
      cuisines = await restaurants.distinct("cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }
}
