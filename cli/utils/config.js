const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const chalk = require("chalk");

const CONFIG_DIR = path.join(os.homedir(), ".phantom-cli");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

const DEFAULT_CONFIG = {
  // serverUrl: "https://phantom-agent-cli.vercel.app",  // Production
  serverUrl: "http://localhost:3000",  // Development (Local)
};

/**
 * Ensure config directory exists
 */
async function ensureConfigDir() {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  } catch (error) {
    console.error(chalk.red("Failed to create config directory:"), error.message);
  }
}

/**
 * Get configuration
 */
async function getConfig() {
  try {
    await ensureConfigDir();
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch (error) {
    // Return default config if file doesn't exist
    return DEFAULT_CONFIG;
  }
}

/**
 * Get server URL from config
 */
async function getServerUrl() {
  const config = await getConfig();
  return config.serverUrl;
}

/**
 * Set configuration value
 */
async function setConfig(key, value) {
  try {
    await ensureConfigDir();
    const config = await getConfig();
    config[key] = value;
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(chalk.red("Failed to save config:"), error.message);
    return false;
  }
}

/**
 * Get stored token
 */
async function getStoredToken() {
  try {
    const data = await fs.readFile(TOKEN_FILE, "utf-8");
    const token = JSON.parse(data);
    return token;
  } catch (error) {
    return null;
  }
}

/**
 * Store token
 */
async function storeToken(token) {
  try {
    await ensureConfigDir();
    
    console.log(chalk.gray("\n🔍 DEBUG - storeToken() called with:"));
    console.log(JSON.stringify(token, null, 2));

    const tokenData = {
      access_token: token.access_token || token.token,
      token_type: token.token_type || "Bearer",
      expires_at: token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000).toISOString()
        : null,
      created_at: new Date().toISOString(),
      // Store original response for debugging
      _raw: token,
    };
    
    console.log(chalk.gray("\n🔍 DEBUG - Transformed token data to store:"));
    console.log(JSON.stringify(tokenData, null, 2));
    console.log(chalk.gray("\n🔍 DEBUG - Writing to file:"), TOKEN_FILE);

    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokenData, null, 2), "utf-8");
    console.log(chalk.green("✓ Token successfully written to disk"));
    return true;
  } catch (error) {
    console.error(chalk.red("Failed to store token:"), error.message);
    return false;
  }
}

/**
 * Clear stored token
 */
async function clearStoredToken() {
  try {
    await fs.unlink(TOKEN_FILE);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if token is expired
 */
async function isTokenExpired() {
  const token = await getStoredToken();
  if (!token || !token.expires_at) {
    return true;
  }

  const expiresAt = new Date(token.expires_at);
  const now = new Date();

  return expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;
}

/**
 * Require authentication
 */
async function requireAuth() {
  const token = await getStoredToken();

  if (!token) {
    console.log(
      chalk.red("❌ Not authenticated. Please run 'pnpm cli login' first.")
    );
    process.exit(1);
  }

  if (await isTokenExpired()) {
    console.log(
      chalk.yellow("⚠️  Your session has expired. Please login again.")
    );
    console.log(chalk.gray("   Run: pnpm cli login\n"));
    process.exit(1);
  }

  return token;
}

module.exports = {
  CONFIG_DIR,
  getConfig,
  getServerUrl,
  setConfig,
  getStoredToken,
  storeToken,
  clearStoredToken,
  isTokenExpired,
  requireAuth,
};
