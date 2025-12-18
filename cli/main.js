#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
const { Command } = require("commander");
const { login, logout, whoami } = require("./commands/auth/login");
const { wakeUp } = require("./commands/ai/wakeup");
const { apiKeyCommand } = require("./commands/api-key/manage");
<<<<<<< Updated upstream
=======
const configCommand = require("./commands/config");
>>>>>>> Stashed changes

async function main() {
  // Display banner
  console.log(
    chalk.cyan(
      figlet.textSync("Phantom CLI", {
        font: "Standard",
        horizontalLayout: "default",
      })
    )
  );
  console.log(chalk.gray("AI-powered CLI with device flow authentication\n"));

  const program = new Command("phantom");

  program
    .version("1.0.0")
    .description("Phantom CLI - AI Chat and Device Flow Authentication");

  // Add commands
<<<<<<< Updated upstream
=======
  program.addCommand(configCommand);
>>>>>>> Stashed changes
  program.addCommand(wakeUp);
  program.addCommand(login);
  program.addCommand(logout);
  program.addCommand(whoami);
  program.addCommand(apiKeyCommand);

  // Default action shows help
  program.action(() => {
    program.help();
  });

  program.parse();
}

main().catch((error) => {
  console.error(chalk.red("Error running Orbital CLI:"), error);
  process.exit(1);
});
