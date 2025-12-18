const chalk = require("chalk");
const { Command } = require("commander");
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

    if (!response.ok) {
      throw new Error("Failed to request device authorization");
    }

    const data = await response.json();
    spinner.stop();
    
    console.log(chalk.gray("\n🔍 DEBUG - Device authorization response:"));
    console.log(chalk.gray(JSON.stringify(data, null, 2)));

    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      interval = 5,
      expires_in,
    } = data;
    
    console.log(chalk.gray("\n🔍 DEBUG - Extracted values:"));
    console.log(chalk.gray("  - Device Code:"), device_code?.substring(0, 10) + "...");
    console.log(chalk.gray("  - User Code:"), user_code);
    console.log(chalk.gray("  - Verification URI:"), verification_uri);
    console.log(chalk.gray("  - Interval:"), interval);
    console.log(chalk.gray("  - Expires In:"), expires_in);

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
        console.log(chalk.gray("\n🔍 DEBUG - Polling for token (attempt)"));
        const tokenResponse = await fetch(`${BASE_URL}/api/auth/device/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_code,
            client_id: "phantom-cli",
            grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          }),
        });
        
        console.log(chalk.gray("🔍 DEBUG - Token response status:"), tokenResponse.status);

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          pollSpinner.success("Authorization successful!");

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
          authorized = true;

          console.log("");
          console.log(chalk.green.bold("✓ Successfully authenticated!"));
          console.log("");
          console.log(chalk.gray("You can now use the CLI commands."));
          outro(chalk.green("Happy coding! 🚀"));
        } else {
          const errorData = await tokenResponse.json();
          console.log(chalk.gray("🔍 DEBUG - Token response error:"), errorData.error);
          if (errorData.error !== "authorization_pending") {
            console.log(chalk.red("\n❌ ERROR - Token request failed:"));
            console.log(JSON.stringify(errorData, null, 2));
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
