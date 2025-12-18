const chalk = require("chalk");
const { Command } = require("commander");
<<<<<<< Updated upstream
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
=======
const yoctoSpinner = require("yocto-spinner").default;
const { cancel, confirm, intro, isCancel, outro, text } = require("@clack/prompts");
const open = require("open");
const {
  getServerUrl,
  getStoredToken,
  storeToken,
  clearStoredToken,
  isTokenExpired,
  requireAuth,
} = require("../../utils/config");
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    // Request device code from the Next.js API
    const response = await fetch(`${BASE_URL}/api/auth/device/authorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: "orbital-cli",
      }),
    });
=======
    const BASE_URL = await getServerUrl();
    console.log(chalk.gray("\n🔍 DEBUG - Server URL:"), BASE_URL);
    console.log(chalk.gray("🔍 DEBUG - Requesting device authorization..."));
    
    // Request device code from Better Auth
    const response = await fetch(`${BASE_URL}/api/auth/device/code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: "phantom-cli",
        scope: "openid profile email",
      }),
    });
    
    console.log(chalk.gray("🔍 DEBUG - Device code response status:"), response.status);
>>>>>>> Stashed changes

    if (!response.ok) {
      throw new Error("Failed to request device authorization");
    }

    const data = await response.json();
    spinner.stop();
<<<<<<< Updated upstream
=======
    
    console.log(chalk.gray("\n🔍 DEBUG - Device authorization response:"));
    console.log(chalk.gray(JSON.stringify(data, null, 2)));
>>>>>>> Stashed changes

    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      interval = 5,
      expires_in,
    } = data;
<<<<<<< Updated upstream
=======
    
    console.log(chalk.gray("\n🔍 DEBUG - Extracted values:"));
    console.log(chalk.gray("  - Device Code:"), device_code?.substring(0, 10) + "...");
    console.log(chalk.gray("  - User Code:"), user_code);
    console.log(chalk.gray("  - Verification URI:"), verification_uri);
    console.log(chalk.gray("  - Interval:"), interval);
    console.log(chalk.gray("  - Expires In:"), expires_in);
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
        console.log(chalk.gray("\n🔍 DEBUG - Polling for token (attempt)"));
>>>>>>> Stashed changes
        const tokenResponse = await fetch(`${BASE_URL}/api/auth/device/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_code,
<<<<<<< Updated upstream
            grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          }),
        });
=======
            client_id: "phantom-cli",
            grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          }),
        });
        
        console.log(chalk.gray("🔍 DEBUG - Token response status:"), tokenResponse.status);
>>>>>>> Stashed changes

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          pollSpinner.success("Authorization successful!");

<<<<<<< Updated upstream
          await storeToken(tokenData);
=======
          console.log(chalk.cyan("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
          console.log(chalk.cyan.bold("🔍 DETAILED TOKEN DEBUG INFO"));
          console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
          console.log(chalk.gray("\n📦 RAW Token Data Received from /api/auth/device/token:"));
          console.log(JSON.stringify(tokenData, null, 2));
          console.log(chalk.gray("\n🔑 Token Properties:"));
          console.log(chalk.gray("  - Has 'access_token':"), !!tokenData.access_token);
          console.log(chalk.gray("  - Has 'token':"), !!tokenData.token);
          console.log(chalk.gray("  - Has 'token_type':"), !!tokenData.token_type);
          console.log(chalk.gray("  - Has 'expires_in':"), !!tokenData.expires_in);
          console.log(chalk.gray("  - Has 'session':"), !!tokenData.session);
          console.log(chalk.gray("  - Token Type:"), tokenData.token_type || "N/A");
          
          if (tokenData.access_token) {
            console.log(chalk.gray("  - Access Token (first 20 chars):"), tokenData.access_token.substring(0, 20) + "...");
          }
          if (tokenData.token) {
            console.log(chalk.gray("  - Token (first 20 chars):"), tokenData.token.substring(0, 20) + "...");
          }
          
          await storeToken(tokenData);
          const stored = await getStoredToken();
          console.log(chalk.gray("\n💾 Token Data Stored in token.json:"));
          console.log(JSON.stringify(stored, null, 2));
          console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
>>>>>>> Stashed changes
          authorized = true;

          console.log("");
          console.log(chalk.green.bold("✓ Successfully authenticated!"));
          console.log("");
          console.log(chalk.gray("You can now use the CLI commands."));
          outro(chalk.green("Happy coding! 🚀"));
        } else {
          const errorData = await tokenResponse.json();
<<<<<<< Updated upstream
          if (errorData.error !== "authorization_pending") {
=======
          console.log(chalk.gray("🔍 DEBUG - Token response error:"), errorData.error);
          if (errorData.error !== "authorization_pending") {
            console.log(chalk.red("\n❌ ERROR - Token request failed:"));
            console.log(JSON.stringify(errorData, null, 2));
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
async function whoamiAction(opts) {
  const token = await requireAuth();
  if (!token?.access_token) {
    console.log("No access token found. Please login.");
    process.exit(1);
  }
  
  console.log(chalk.cyan("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.cyan.bold("🔍 WHOAMI DEBUG INFO"));
  console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.gray("\n📦 Stored Token Object:"));
  console.log(JSON.stringify(token, null, 2));
  console.log(chalk.gray("\n🔑 Sending Authorization Header:"));
  console.log(chalk.gray("  Bearer"), token.access_token.substring(0, 30) + "...");
  
  // Fetch user info from server
  const BASE_URL = await getServerUrl();
  console.log(chalk.gray("\n🌐 Calling API:"), `${BASE_URL}/api/me`);
  
  const response = await fetch(`${BASE_URL}/api/me`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
  
  console.log(chalk.gray("\n📡 Response Status:"), response.status);

  if (!response.ok) {
    console.error(chalk.red("❌ Failed to fetch user information"));
    console.error(chalk.gray(`Status: ${response.status} ${response.statusText}`));
    process.exit(1);
  }

  const data = await response.json();
  
  console.log(chalk.gray("\n📦 Full API Response:"));
  console.log(JSON.stringify(data, null, 2));

  // Extract user from the nested response structure
  const user = data.user;
  const session = data.session;

  if (!user) {
    console.error(chalk.red("❌ No user data found in response"));
    console.log(chalk.gray("\nResponse structure:"), Object.keys(data));
    process.exit(1);
  }
  
  console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

  // Output user session info
  console.log(
    chalk.bold.greenBright(`👤 User: ${user.name}
📧 Email: ${user.email}
🆔 ID: ${user.id}
🔑 Session Token: ${session?.token || 'N/A'}
⏰ Expires: ${session?.expiresAt ? new Date(session.expiresAt).toLocaleString() : 'N/A'}`)
  );
>>>>>>> Stashed changes
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
