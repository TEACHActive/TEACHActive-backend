const BASE_URL_HTTPS = "https://teachactive.engineering.iastate.edu";
const EDUSENSE_STORAGE_URL = BASE_URL_HTTPS + ":5000";

const BASE_URL_HTTP = "http://teachactive.engineering.iastate.edu";

const getAxiosConfig = (
  method: "post" | "get" | "put",
  endpoint: string,
  data?: any
) => {
  const URL = EDUSENSE_STORAGE_URL;

  return {
    method: method,
    url: `${URL}${endpoint}`,
    data: data,
    auth: {
      username: "edusense",
      password: "5i6iJ%rrudSQS36LKs6U",
    },
  };
};

export { getAxiosConfig };
