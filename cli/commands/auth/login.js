const chalk = require("chalk");
const { Command } = require("commander");
const yoctoSpinner = require("yocto-spinner");
const { cancel, confirm, intro, isCancel, outro, text } = require("@clack/prompts");
const open = require("open");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const CONFIG_DIR = path.join(os.homedir(), ".orbital-cli");
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

// ============================================
// TOKEN MANAGEMENT
// ============================================

async function getStoredToken() {
  try {
    const data = await fs.readFile(TOKEN_FILE, "utf-8");
    const token = JSON.parse(data);
    return token;
  } catch (error) {
    return null;
  }
}

async function storeToken(token) {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });

    const tokenData = {
      access_token: token.access_token,
      token_type: token.token_type || "Bearer",
      expires_at: token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000).toISOString()
        : null,
      created_at: new Date().toISOString(),
    };

    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokenData, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(chalk.red("Failed to store token:"), error.message);
    return false;
  }
}

async function clearStoredToken() {
  try {
    await fs.unlink(TOKEN_FILE);
    return true;
  } catch (error) {
    return false;
  }
}

async function isTokenExpired() {
  const token = await getStoredToken();
  if (!token || !token.expires_at) {
    return true;
  }

  const expiresAt = new Date(token.expires_at);
  const now = new Date();

  return expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;
}

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

// ============================================
// LOGIN COMMAND
// ============================================

async function loginAction() {
  intro(chalk.bold("🔐 Orbital CLI Login"));

  const existingToken = await getStoredToken();
  const expired = await isTokenExpired();

  if (existingToken && !expired) {
    const shouldReauth = await confirm({
      message: "You're already logged in. Do you want to log in again?",
      initialValue: false,
    });

    if (isCancel(shouldReauth) || !shouldReauth) {
      cancel("Login cancelled");
      process.exit(0);
    }
  }

  const spinner = yoctoSpinner({ text: "Requesting device authorization..." });
  spinner.start();

  try {
    // Request device code from the Next.js API
    const response = await fetch(`${BASE_URL}/api/auth/device/authorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: "orbital-cli",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to request device authorization");
    }

    const data = await response.json();
    spinner.stop();

    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      interval = 5,
      expires_in,
    } = data;

    console.log("");
    console.log(chalk.cyan("📱 Device Authorization Required"));
    console.log("");
    console.log(
      `Please visit: ${chalk.underline.blue(
        verification_uri_complete || verification_uri
      )}`
    );
    console.log("");
    console.log(`Your code is: ${chalk.bold.yellow(user_code)}`);
    console.log("");

    const shouldOpenBrowser = await confirm({
      message: "Would you like to open this URL in your browser?",
      initialValue: true,
    });

    if (!isCancel(shouldOpenBrowser) && shouldOpenBrowser) {
      await open(verification_uri_complete || verification_uri);
    }

    console.log("");
    console.log(chalk.gray("⏳ Waiting for authorization..."));
    console.log(chalk.gray(`   This code expires in ${expires_in} seconds\n`));

    const pollSpinner = yoctoSpinner({ text: "Checking authorization status..." });
    pollSpinner.start();

    const expiresAt = Date.now() + expires_in * 1000;
    let authorized = false;

    while (Date.now() < expiresAt && !authorized) {
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));

      try {
        const tokenResponse = await fetch(`${BASE_URL}/api/auth/device/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_code,
            grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          }),
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          pollSpinner.success("Authorization successful!");

          await storeToken(tokenData);
          authorized = true;

          console.log("");
          console.log(chalk.green.bold("✓ Successfully authenticated!"));
          console.log("");
          console.log(chalk.gray("You can now use the CLI commands."));
          outro(chalk.green("Happy coding! 🚀"));
        } else {
          const errorData = await tokenResponse.json();
          if (errorData.error !== "authorization_pending") {
            throw new Error(errorData.error_description || "Authorization failed");
          }
        }
      } catch (error) {
        if (error.message.includes("authorization_pending")) {
          continue;
        }
        throw error;
      }
    }

    if (!authorized) {
      pollSpinner.error("Authorization expired");
      console.log(chalk.red("\n❌ Device code expired. Please try again."));
      process.exit(1);
    }
  } catch (error) {
    spinner.stop();
    console.error(chalk.red("\n❌ Login failed:"), error.message);
    process.exit(1);
  }
}

// ============================================
// LOGOUT COMMAND
// ============================================

async function logoutAction() {
  intro(chalk.bold("👋 Logout"));

  const token = await getStoredToken();

  if (!token) {
    console.log(chalk.yellow("⚠️  Not currently logged in"));
    process.exit(0);
  }

  const shouldLogout = await confirm({
    message: "Are you sure you want to logout?",
    initialValue: true,
  });

  if (isCancel(shouldLogout) || !shouldLogout) {
    cancel("Logout cancelled");
    process.exit(0);
  }

  await clearStoredToken();
  console.log(chalk.green("\n✓ Successfully logged out"));
  outro(chalk.gray("See you later! 👋"));
}

// ============================================
// WHOAMI COMMAND
// ============================================

async function whoamiAction() {
  const token = await requireAuth();

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
    spinner.success("User information retrieved");

    console.log("");
    console.log(chalk.cyan.bold("👤 User Information"));
    console.log("");
    console.log(`${chalk.gray("Name:")}     ${session.user.name || "N/A"}`);
    console.log(`${chalk.gray("Email:")}    ${session.user.email}`);
    console.log(`${chalk.gray("User ID:")}  ${session.user.id}`);
    console.log("");
  } catch (error) {
    spinner.error("Failed to fetch user information");
    console.error(chalk.red("\n❌ Error:"), error.message);
    process.exit(1);
  }
}

// ============================================
// COMMAND EXPORTS
// ============================================

const login = new Command("login")
  .description("Authenticate with device flow")
  .action(loginAction);

const logout = new Command("logout")
  .description("Logout and clear stored credentials")
  .action(logoutAction);

const whoami = new Command("whoami")
  .description("Display current user information")
  .action(whoamiAction);

module.exports = { 
  login, 
  logout, 
  whoami, 
  getStoredToken, 
  requireAuth 
};
