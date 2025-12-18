const { Command } = require("commander");
const chalk = require("chalk");
const { intro, outro, text, confirm, isCancel, cancel } = require("@clack/prompts");
const { getConfig, setConfig } = require("../utils/config");

const configCommand = new Command("config")
  .description("Manage CLI configuration");

// Get configuration
configCommand
  .command("get")
  .argument("[key]", "Configuration key to get (default: show all)")
  .description("Get configuration value(s)")
  .action(async (key) => {
    intro(chalk.bold("⚙️  Configuration"));

    const config = await getConfig();

    if (key) {
      const value = config[key];
      if (value !== undefined) {
        console.log(chalk.cyan(`${key}:`), chalk.white(value));
      } else {
        console.log(chalk.yellow(`⚠️  Key "${key}" not found`));
      }
    } else {
      console.log(chalk.cyan("\nCurrent configuration:"));
      Object.entries(config).forEach(([k, v]) => {
        console.log(chalk.gray("  •"), chalk.cyan(k + ":"), chalk.white(v));
      });
    }

    outro(chalk.green("Done"));
  });

// Set configuration value
configCommand
  .command("set")
  .argument("<key>", "Configuration key")
  .argument("<value>", "Configuration value")
  .description("Set configuration value")
  .action(async (key, value) => {
    intro(chalk.bold("⚙️  Set Configuration"));

    const success = await setConfig(key, value);

    if (success) {
      console.log(chalk.green(`✓ Set ${chalk.cyan(key)} to ${chalk.white(value)}`));
      outro(chalk.green("Configuration updated"));
    } else {
      console.log(chalk.red("❌ Failed to update configuration"));
      process.exit(1);
    }
  });

// Initialize configuration
configCommand
  .command("init")
  .description("Initialize CLI with your server URL")
  .action(async () => {
    intro(chalk.bold("⚙️  Initialize Orbital CLI"));

    console.log(chalk.gray("\nSet up your Orbital server connection\n"));

    const serverUrl = await text({
      message: "Enter your Orbital server URL",
      placeholder: "https://your-app.vercel.app",
      initialValue: "https://phantom-agent-cli.vercel.app",
      validate(value) {
        if (!value || value.trim().length === 0) {
          return "Server URL is required";
        }
        if (!value.startsWith("http://") && !value.startsWith("https://")) {
          return "Server URL must start with http:// or https://";
        }
      },
    });

    if (isCancel(serverUrl)) {
      cancel("Configuration cancelled");
      process.exit(0);
    }

    await setConfig("serverUrl", serverUrl.trim());

    console.log(chalk.green("\n✓ Configuration saved successfully!"));
    console.log(chalk.gray("\nNext steps:"));
    console.log(chalk.cyan("  1. Run:"), chalk.white("pnpm cli login"));
    console.log(chalk.cyan("  2. Authorize the device in your browser"));
    console.log(chalk.cyan("  3. Start chatting:"), chalk.white("pnpm cli chat"));
    
    outro(chalk.green("Ready to go! 🚀"));
  });

module.exports = configCommand;
