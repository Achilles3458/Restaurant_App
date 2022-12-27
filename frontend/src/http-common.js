//helper file
import axios from "axios";

export default axios.create({
  //base URL for backend server
  baseURL: "http://localhost:5000/api/v1/restaurants",
  headers: {
    "Content-type": "application/json",
  },
});
