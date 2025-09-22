import axios from "axios";
import Cookies from "js-cookie";


const instance = axios.create({
  baseURL: "http://localhost:5001/api/",
});

export default instance;
