const chalk = require("chalk");
const { Command } = require("commander");
const yoctoSpinner = require("yocto-spinner");
const { select, intro, outro } = require("@clack/prompts");
const { requireAuth } = require("../auth/login");
const { startChat } = require("../../chat/chat-with-ai");

async function wakeUpAction() {
  const token = await requireAuth();

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const spinner = yoctoSpinner({ text: "Fetching user information..." });
  spinner.start();

  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
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
      case "conversations":
        await viewConversations(session.user, token);
        break;
    }
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
