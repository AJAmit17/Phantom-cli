const chalk = require("chalk");
const boxen = require("boxen");
const { text, isCancel, cancel, confirm } = require("@clack/prompts");
const yoctoSpinner = require("yocto-spinner").default;
const { generateApplication } = require("../config/agent.config");
const { createGoogleGenerativeAI } = require("@ai-sdk/google");
const { getServerUrl } = require("../utils/config");
const { cacheManager } = require("../utils/cache-manager");

async function startAgentChat(user, token) {
  // Warning about autonomous actions
  const warningBox = boxen(
    chalk.yellow.bold("⚠️  Agent Mode\n\n") +
    chalk.gray("The AI agent can:\n") +
    chalk.gray("• Generate complete applications\n") +
    chalk.gray("• Create files and folders\n") +
    chalk.gray("• Execute multi-step plans\n") +
    chalk.gray("• Make autonomous decisions\n\n") +
    chalk.yellow("This mode requires careful monitoring."),
    {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: "double",
      borderColor: "yellow",
      title: "⚠️  Important",
      titleAlignment: "center",
    }
  );

  console.log(warningBox);

  const shouldContinue = await confirm({
    message: chalk.yellow("Continue with Agent Mode?"),
    initialValue: true,
  });

  if (isCancel(shouldContinue) || !shouldContinue) {
    console.log(chalk.yellow("\n👋 Agent mode cancelled\n"));
    return;
  }

  const helpBox = boxen(
    chalk.cyan.bold("What can the agent do?\n\n") +
    chalk.gray("• Generate complete applications from descriptions\n") +
    chalk.gray("• Create all necessary files and folders\n") +
    chalk.gray("• Include setup instructions and commands\n") +
    chalk.gray("• Generate production-ready code\n\n") +
    chalk.yellow.bold("Examples:\n") +
    chalk.white('• "Build a todo app with React and Tailwind"\n') +
    chalk.white('• "Create a REST API with Express and MongoDB"\n') +
    chalk.white('• "Make a weather app using OpenWeatherMap API"\n\n') +
    chalk.gray('Type "exit" to end the session'),
    {
      padding: 1,
      margin: { bottom: 1 },
      borderStyle: "round",
      borderColor: "cyan",
      title: "💡 Agent Instructions",
    }
  );

  console.log(helpBox);

  while (true) {
    const userInput = await text({
      message: chalk.magenta("🤖 What would you like to build?"),
      placeholder: "Describe your application...",
      validate(value) {
        if (!value || value.trim().length === 0) {
          return "Description cannot be empty";
        }
        if (value.trim().length < 10) {
          return "Please provide more details (at least 10 characters)";
        }
      },
    });

    if (isCancel(userInput)) {
      console.log(chalk.yellow("\n👋 Agent session cancelled\n"));
      break;
    }

    if (userInput.toLowerCase() === "exit") {
      console.log(chalk.yellow("\n👋 Agent session ended\n"));
      break;
    }

    // Display user request
    const userBox = boxen(chalk.white(userInput), {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: "round",
      borderColor: "blue",
      title: "👤 Your Request",
      titleAlignment: "left",
    });
    console.log(userBox);

    // Get AI agent response - fetch API key from server and generate locally
    try {
      // Fetch user's API key from server with cache (5 min TTL)
      const BASE_URL = await getServerUrl();
      
      const apiKeysData = await cacheManager.query(
        `api-keys:${user.id}`,
        async () => {
          const response = await fetch(`${BASE_URL}/api/api-keys`, {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch API key from server.");
          }

          return response.json();
        },
        { ttl: 5 * 60 * 1000 } // Cache for 5 minutes
      );

      const apiKeys = apiKeysData.apiKeys || [];
      const activeKey = apiKeys.find(k => k.isActive && k.provider === "google");

      if (!activeKey) {
        throw new Error("No active Google API key found. Please configure your API key in the web app at /api-key-manager or use 'pnpm cli api-key set'.");
      }

      // The API doesn't return the actual key for security, so we need to use the one from local config
      const { getApiKey } = require("../utils/ai-helper");
      const apiKey = getApiKey();
      
      if (!apiKey) {
        throw new Error("API key not found locally. Please run 'pnpm cli api-key set' to configure your API key.");
      }

      // Create AI model with user's API key
      const google = createGoogleGenerativeAI({ apiKey });
      const model = google(activeKey.modelId || "gemini-2.0-flash-exp");

      const result = await generateApplication(userInput, model, process.cwd());

      if (result && result.success) {
        // Ask if user wants to continue
        const continuePrompt = await confirm({
          message: chalk.cyan("Would you like to generate another application?"),
          initialValue: false,
        });

        if (isCancel(continuePrompt) || !continuePrompt) {
          console.log(chalk.yellow("\n👋 Great! Check your new application.\n"));
          break;
        }
      } else {
        throw new Error("Generation returned no result");
      }
    } catch (error) {
      console.error(chalk.red("\n❌ Error:"), error.message);

      const retry = await confirm({
        message: chalk.cyan("Would you like to try again?"),
        initialValue: true,
      });

      if (isCancel(retry) || !retry) {
        break;
      }
    }
  }
}

module.exports = { startAgentChat };
