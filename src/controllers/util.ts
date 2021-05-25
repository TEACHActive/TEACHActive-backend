import * as Const from "../constants";

const BASE_URL_HTTPS = "https://teachactive.engineering.iastate.edu";
const EDUSENSE_STORAGE_URL = BASE_URL_HTTPS + ":5000";
const EDUSENSE_STORAGE_URL_DEV = BASE_URL_HTTPS + ":5001";

const getAxiosConfig = (
  method: "post" | "get" | "put",
  endpoint: string,
  data?: any
) => {
  const env = process.env.NODE_ENV || "development";

  const URL =
    env === "production" ? EDUSENSE_STORAGE_URL : EDUSENSE_STORAGE_URL_DEV;

  return {
    method: method,
    url: `${URL}${endpoint}`,
    data: data,
    auth: {
      username: Const.DB_USER || "",
      password: Const.DB_PASS || "",
    },
  };
};

export { getAxiosConfig };
