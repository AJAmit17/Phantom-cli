const chalk = require("chalk");
const boxen = require("boxen");
const { text, isCancel, cancel } = require("@clack/prompts");
const yoctoSpinner = require("yocto-spinner").default;
const { getServerUrl } = require("../utils/config");

async function startChat(user, token) {
  const BASE_URL = await getServerUrl();
  let conversationId = null;

  const helpBox = boxen(
    `• Type your message and press Enter\n• Type "exit" to end conversation\n• Press Ctrl+C to quit anytime`,
    {
      padding: 1,
      margin: { bottom: 1 },
      borderStyle: "round",
      borderColor: "gray",
      dimBorder: true,
    }
  );

  console.log(helpBox);

  while (true) {
    const userInput = await text({
      message: chalk.blue("💬 Your message"),
      placeholder: "Type your message...",
      validate(value) {
        if (!value || value.trim().length === 0) {
          return "Message cannot be empty";
        }
      },
    });

    if (isCancel(userInput)) {
      cancel("Chat ended");
      process.exit(0);
    }

    if (userInput.toLowerCase() === "exit") {
      console.log(chalk.yellow("\n👋 Goodbye!"));
      break;
    }

    // Display user message
    const userBox = boxen(chalk.white(userInput), {
      padding: 1,
      margin: { left: 2, bottom: 1 },
      borderStyle: "round",
      borderColor: "blue",
      title: "👤 You",
      titleAlignment: "left",
    });
    console.log(userBox);

    // Get AI response
    const spinner = yoctoSpinner({
      text: "AI is thinking...",
      color: "cyan",
    }).start();

    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
        body: JSON.stringify({
          message: userInput,
          conversationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(chalk.gray("\n🔍 DEBUG - Response status:"), response.status);
        console.log(chalk.gray("🔍 DEBUG - Error data:"), JSON.stringify(errorData, null, 2));
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      spinner.success("Response received");

      // Update conversation ID
      if (data.conversationId && !conversationId) {
        conversationId = data.conversationId;
      }

      // Display AI response (simple text, no markdown rendering in CLI for now)
      const assistantBox = boxen(chalk.white(data.assistantMessage.content), {
        padding: 1,
        margin: { left: 2, bottom: 1 },
        borderStyle: "round",
        borderColor: "green",
        title: "🤖 Assistant",
        titleAlignment: "left",
      });
      console.log(assistantBox);
    } catch (error) {
      spinner.error("Failed to get response");
      console.error(chalk.red("\n❌ Error:"), error.message);
      console.log(chalk.yellow("Let's try again...\n"));
    }
  }
}

module.exports = { startChat };
