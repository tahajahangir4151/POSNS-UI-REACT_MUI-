const config = {};

export const loadConfig = async () => {
  try {
    const response = await fetch('/config.json');
    const data = await response.json();
    Object.assign(config, data); // Merge fetched data into the config object
  } catch (error) {
    console.error("Failed to load config.json:", error);
  }
};

export default config;