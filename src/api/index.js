import axios from "axios";

const mainURL = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://fragranta-server-api.vercel.app"
});

export default mainURL;
