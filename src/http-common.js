import axios from "axios";

export default axios.create({
// url of the backend server
// used to make requests
  baseURL: "http://localhost:5000/api/route",
  headers: {
    "Content-type": "application/json",
  }
});
