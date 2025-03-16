import Axios from "axios";

export const getDataFromJson = async () => {
  const JsonFilePath = "/config.json";
  let configData = {};
// console.log(configData)
  try {
    const response = await Axios.get(JsonFilePath, {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    configData=data
  } catch (error) {
    console.error("Error fetching JSON file:", error);
  }

//   console.log(configData)
  return configData;
};
