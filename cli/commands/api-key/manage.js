const chalk = require("chalk");
const { Command } = require("commander");
const { intro, outro, text, confirm, isCancel, cancel, select } = require("@clack/prompts");
const { getServerUrl, requireAuth } = require("../../utils/config");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");

const CONFIG_DIR = path.join(os.homedir(), ".phantom-cli");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

// Load token for authenticated requests
async function getStoredToken() {
  const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");
  try {
    const data = await fs.readFile(TOKEN_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Config management
async function getConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function saveConfig(config) {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(chalk.red("Failed to save config:"), error.message);
    return false;
  }
}

// API Key commands
const apiKeyCommand = new Command("api-key")
  .description("Manage your API keys (bring your own key)");

// Set API key
apiKeyCommand
  .command("set")
  .description("Set your API key")
  .action(async () => {
    intro(chalk.bold("🔑 Set API Key"));

    const modelId = await select({
      message: "Select your Gemini model:",
      options: [
        { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash (Stable, Recommended)" },
        { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Latest)" },
        { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Best Quality)" },
        { value: "gemini-exp-1206", label: "Gemini Experimental 1206" },
        { value: "gemini-flash-latest", label: "Gemini Flash Latest (Auto-updated)" },
      ],
    });

    if (isCancel(modelId)) {
      cancel("Operation cancelled");
      process.exit(0);
    }

    const apiKey = await text({
      message: "Enter your Google AI API key:",
      placeholder: "AIza...",
      validate: (value) => {
        if (!value) return "API key is required";
        if (value.length < 10) return "API key seems too short";
      },
    });

    if (isCancel(apiKey)) {
      cancel("Operation cancelled");
      process.exit(0);
    }

    const name = await text({
      message: "Name for this key (optional):",
      placeholder: "My API Key",
      defaultValue: `Gemini ${modelId.split('-').slice(1).join(' ')} Key`,
    });

    if (isCancel(name)) {
      cancel("Operation cancelled");
      process.exit(0);
    }

    // Save locally
    const config = await getConfig();
    config.apiKey = {
      key: apiKey,
      name: name || "My API Key",
      modelId: modelId,
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    if (await saveConfig(config)) {
      outro(chalk.green(`✅ API key saved successfully for ${modelId}`));
      console.log(chalk.gray(`\n  Get your API key at: https://makersuite.google.com/app/apikey`));

      // Also sync to server if logged in
      const token = await getStoredToken();
      if (token) {
        try {
          const BASE_URL = await getServerUrl();
          const response = await fetch(`${BASE_URL}/api/api-keys`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.access_token}`,
            },
            body: JSON.stringify({
              name: name || "My API Key",
              key: apiKey,
              provider: "google",
              modelId: modelId,
            }),
          });

          if (response.ok) {
            console.log(chalk.gray("  ℹ️  Also synced to server"));
          }
        } catch (error) {
          console.log(chalk.yellow("  ⚠️  Saved locally but couldn't sync to server"));
        }
      }
    } else {
      outro(chalk.red("❌ Failed to save API key"));
    }
  });

// Get API key
apiKeyCommand
  .command("get")
  .description("Show your configured API key")
  .action(async () => {
    const config = await getConfig();

    if (!config.apiKey) {
      console.log(chalk.yellow("No API key configured."));
      console.log(chalk.gray("Run 'pnpm cli api-key set' to add one."));
      return;
    }

    console.log(chalk.bold("\n🔑 Configured API Key:\n"));

    const maskedKey = config.apiKey.key.slice(0, 10) + "..." + config.apiKey.key.slice(-4);
    console.log(chalk.cyan(`  Name: ${config.apiKey.name}`));
    console.log(chalk.gray(`  Key: ${maskedKey}`));
    console.log(chalk.gray(`  Model: ${config.apiKey.modelId}`));
    console.log(chalk.gray(`  Provider: ${config.apiKey.provider}`));
    console.log(chalk.gray(`  Created: ${new Date(config.apiKey.createdAt).toLocaleString()}`));
    console.log("");
  });

// Remove API key
apiKeyCommand
  .command("remove")
  .description("Remove your API key")
  .action(async () => {
    const config = await getConfig();

    if (!config.apiKey) {
      console.log(chalk.yellow("No API key configured."));
      return;
    }

    intro(chalk.bold("🗑️  Remove API Key"));

    const shouldRemove = await confirm({
      message: `Remove API key "${config.apiKey.name}"?`,
      initialValue: false,
    });

    if (isCancel(shouldRemove) || !shouldRemove) {
      cancel("Operation cancelled");
      process.exit(0);
    }

    delete config.apiKey;

    if (await saveConfig(config)) {
      outro(chalk.green("✅ API key removed"));
    } else {
      outro(chalk.red("❌ Failed to remove API key"));
    }
  });

module.exports = { apiKeyCommand, getConfig };
