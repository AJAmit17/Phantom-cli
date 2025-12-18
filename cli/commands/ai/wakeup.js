const chalk = require("chalk");
const { Command } = require("commander");
<<<<<<< Updated upstream
const yoctoSpinner = require("yocto-spinner");
const { select, intro, outro } = require("@clack/prompts");
const { requireAuth } = require("../auth/login");
const { startChat } = require("../../chat/chat-with-ai");

async function wakeUpAction() {
  const token = await requireAuth();

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
=======
const yoctoSpinner = require("yocto-spinner").default;
const { select, intro, outro } = require("@clack/prompts");
const { startChat } = require("../../chat/chat-with-ai");
const { startToolChat } = require("../../chat/chat-with-ai-tool");
const { startAgentChat } = require("../../chat/chat-with-ai-agent");
const { getServerUrl, requireAuth } = require("../../utils/config");
const boxen = require("boxen");

async function wakeUpAction() {
  intro(
    boxen(chalk.bold.cyan("🚀 Phantom AI"), {
      padding: 1,
      borderStyle: "double",
      borderColor: "cyan",
    })
  );

  const token = await requireAuth();
  const BASE_URL = await getServerUrl();
>>>>>>> Stashed changes

  const spinner = yoctoSpinner({ text: "Fetching user information..." });
  spinner.start();

  try {
<<<<<<< Updated upstream
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
=======
    const response = await fetch(`${BASE_URL}/api/me`, {
>>>>>>> Stashed changes
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user information");
    }

    const session = await response.json();
    spinner.stop();

    console.log(chalk.green(`\nWelcome back, ${session.user.name || "User"}!\n`));

    const choice = await select({
      message: "Select an option:",
      options: [
        {
          value: "chat",
          label: "Chat",
          hint: "Simple chat with Gemini AI",
        },
        {
<<<<<<< Updated upstream
=======
          value: "tool",
          label: "Tool Calling",
          hint: "Chat with AI that can use tools",
        },
        {
          value: "agent",
          label: "Agent Mode",
          hint: "Autonomous AI agent (advanced)",
        },
        {
>>>>>>> Stashed changes
          value: "conversations",
          label: "View Conversations",
          hint: "See your conversation history",
        },
      ],
    });

    switch (choice) {
      case "chat":
        await startChat(session.user, token);
        break;
<<<<<<< Updated upstream
=======
      case "tool":
        await startToolChat(session.user, token);
        break;
      case "agent":
        await startAgentChat(session.user, token);
        break;
>>>>>>> Stashed changes
      case "conversations":
        await viewConversations(session.user, token);
        break;
    }
<<<<<<< Updated upstream
=======

    outro(chalk.green("✨ Thanks for using Phantom AI!"));
>>>>>>> Stashed changes
  } catch (error) {
    spinner.error("Failed to fetch user information");
    console.error(chalk.red("\n❌ Error:"), error.message);
    process.exit(1);
  }
}

async function viewConversations(user, token) {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const spinner = yoctoSpinner({ text: "Loading conversations..." });
  spinner.start();

  try {
    const response = await fetch(`${BASE_URL}/api/conversations`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const { conversations } = await response.json();
    spinner.success("Conversations loaded");

    if (conversations.length === 0) {
      console.log(chalk.yellow("\n📭 No conversations yet. Start chatting!"));
      return;
    }

    console.log(chalk.cyan.bold("\n💬 Your Conversations:\n"));

    conversations.forEach((conv, index) => {
      console.log(`${chalk.gray(`${index + 1}.`)} ${conv.title || "Untitled"}`);
      console.log(`   ${chalk.gray("ID:")} ${conv.id}`);
      console.log(`   ${chalk.gray("Updated:")} ${new Date(conv.updatedAt).toLocaleString()}`);
      console.log("");
    });
  } catch (error) {
    spinner.error("Failed to fetch conversations");
    console.error(chalk.red("\n❌ Error:"), error.message);
  }
}

const wakeUp = new Command("wakeup")
  .description("Wake up the AI and start chatting")
  .action(wakeUpAction);

module.exports = { wakeUp };
