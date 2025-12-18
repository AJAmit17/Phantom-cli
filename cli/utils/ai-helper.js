const { createGoogleGenerativeAI } = require("@ai-sdk/google");
const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Get API key from local config or environment
 */
function getApiKey() {
  // Try to get from local config first
  const configPath = path.join(os.homedir(), ".phantom-cli", "config.json");
  
  try {
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(configContent);
      
      // The config stores apiKey as an object with a 'key' property
      if (config.apiKey) {
        if (typeof config.apiKey === "string") {
          return config.apiKey;
        } else if (typeof config.apiKey === "object" && config.apiKey.key) {
          return config.apiKey.key;
        }
      }
    }
  } catch (error) {
    console.error("Error reading config:", error.message);
  }
  
  // Fall back to environment variable
  if (process.env.GOOGLE_API_KEY && typeof process.env.GOOGLE_API_KEY === "string") {
    return process.env.GOOGLE_API_KEY;
  }
  
  return null;
}

/**
 * Get configured model ID
 */
function getModelId() {
  const configPath = path.join(os.homedir(), ".phantom-cli", "config.json");
  
  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      
      // The config stores apiKey as an object with a 'modelId' property
      if (config.apiKey) {
        if (typeof config.apiKey === "object" && config.apiKey.modelId) {
          return config.apiKey.modelId;
        }
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return "gemini-2.0-flash";
}

/**
 * Create a Google AI model instance for CLI use
 */
function createAIModel() {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error(
      "No API key found. Please set your API key using 'phantom api-key set' or set GOOGLE_API_KEY environment variable."
    );
  }
  
  const modelId = getModelId();
  const google = createGoogleGenerativeAI({ apiKey });
  
  return google(modelId);
}

module.exports = { createAIModel, getApiKey, getModelId };
