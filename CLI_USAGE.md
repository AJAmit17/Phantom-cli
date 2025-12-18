# CLI Development & Testing Guide

## Environment Variables

The CLI only needs one environment variable:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

This is already configured in `cli/.env` and defaults to `http://localhost:3000` if not set.

## Running the CLI Locally

### 1. Start the Next.js Server

First, make sure your Next.js app is running:

```bash
# In the frontend directory
pnpm dev
```

This starts the server at http://localhost:3000

### 2. Run CLI Commands

From the frontend directory, use the `pnpm cli` command:

```bash
# Show all commands
pnpm cli --help

# Set your API key (BYOK)
pnpm cli api-key set

# View your API key
pnpm cli api-key get

# Remove your API key
pnpm cli api-key remove

# Login with device flow
pnpm cli login

# Check who's logged in
pnpm cli whoami

# Logout
pnpm cli logout

# Start AI chat
pnpm cli wakeup
```

### 3. Alternative: Run Directly with Node

You can also run the CLI directly:

```bash
# From the frontend directory
node cli/main.js --help
node cli/main.js api-key set
node cli/main.js login
node cli/main.js wakeup
```

## Configuration Storage

The CLI stores its configuration locally:

- **Location**: `~/.orbital-cli/`
- **Token**: `~/.orbital-cli/token.json` (auth session)
- **Config**: `~/.orbital-cli/config.json` (API key and preferences)

On Windows: `C:\Users\<username>\.orbital-cli\`
On Mac/Linux: `/Users/<username>/.orbital-cli/`

## Testing Workflow

### Complete Testing Flow:

1. **Set API Key**
   ```bash
   pnpm cli api-key set
   ```
   - Choose a Gemini model
   - Enter your Google AI API key from https://makersuite.google.com/app/apikey
   - Give it a name

2. **Login with Device Flow**
   ```bash
   pnpm cli login
   ```
   - A browser window will open
   - Authorize with your GitHub account
   - CLI will receive the session token

3. **Test Chat**
   ```bash
   pnpm cli wakeup
   ```
   - Select "Chat"
   - Start chatting with AI using your API key
   - Type "exit" to end the conversation

4. **View Configuration**
   ```bash
   pnpm cli api-key get
   pnpm cli whoami
   ```

## Troubleshooting

### "Not authenticated" Error
Run `pnpm cli login` to authenticate.

### "No API key available" Error
Run `pnpm cli api-key set` to configure your API key.

### Connection Refused
Make sure your Next.js server is running on http://localhost:3000

### Session Expired
Sessions expire after a period. Run `pnpm cli login` again.

## Development Tips

### Testing Without API Key
If you want to test with the system API key (without BYOK), ensure `GOOGLE_API_KEY` is set in your root `.env` file.

### Testing Different Models
You can change the model anytime:
```bash
pnpm cli api-key remove
pnpm cli api-key set  # Choose a different model
```

### Debugging
The CLI shows detailed error messages. If you need more info, check:
- Server logs in the terminal running `pnpm dev`
- Network requests in DevTools (for device flow authorization)

## Publishing the CLI

When ready to publish as a standalone package, see `/orbital-cli-package/` for the standalone version that users can install globally with `npm install -g @phantom/cli`.
