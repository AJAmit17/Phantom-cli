# Phantom CLI - All Commands Reference

Complete list of all available CLI commands for testing and usage.

## Configuration Commands

### Initialize Configuration
```bash
pnpm cli config init
```
Interactive setup for server URL and preferences.

### View All Configuration
```bash
pnpm cli config get
```

### View Specific Config Value
```bash
pnpm cli config get serverUrl
```

### Set Configuration Value
```bash
# Set server to production
pnpm cli config set serverUrl https://phantom-agent-cli.vercel.app

# Set server to localhost for development
pnpm cli config set serverUrl http://localhost:3000

# Set custom server
pnpm cli config set serverUrl https://your-custom-server.com
```

---

## Authentication Commands

### Login (Device Flow)
```bash
pnpm cli login
```
Initiates device authorization flow:
1. Generates a device code and user code
2. Opens browser for authorization
3. Polls for token until approved
4. Saves session to `~/.orbital-cli/token.json`

### Logout
```bash
pnpm cli logout
```
Clears stored authentication token.

### Check Current User
```bash
pnpm cli whoami
```
Displays current authenticated user information.

---

## AI Commands

### Wake Up (Main Menu)
```bash
pnpm cli wakeup
```
Interactive menu with options:
- **Chat**: Start a new chat session with AI
- **View Conversations**: See your conversation history

### Chat Commands (When in Chat)
- Type your message and press Enter
- Type `exit` to end conversation
- Press `Ctrl+C` to quit anytime

---

## API Key Management Commands

### API Key Main Menu
```bash
pnpm cli api-key
```
Interactive menu for API key management.

### Add API Key
```bash
pnpm cli api-key add
```
Prompts for:
- Key name (e.g., "My Personal Key")
- Google AI API key (starts with AIza...)
- Model selection (6 Gemini models available)

### List API Keys
```bash
pnpm cli api-key list
```
Shows all your saved API keys with:
- Name
- Model
- Status (Active/Inactive)
- Created date

### Remove API Key
```bash
pnpm cli api-key remove
```
Interactive selection to remove a specific API key.

---

## Quick Test Sequence

### First Time Setup
```bash
# 1. Set server URL
pnpm cli config set serverUrl http://localhost:3000

# 2. View configuration
pnpm cli config get

# 3. Login
pnpm cli login
# (Complete authorization in browser)

# 4. Check user
pnpm cli whoami

# 5. Start chatting
pnpm cli wakeup
# Select "Chat"
```

### With Custom API Key
```bash
# 1. Make sure you're logged in
pnpm cli whoami

# 2. Add your Google AI API key
pnpm cli api-key add
# Enter name, API key, and select model

# 3. List keys to verify
pnpm cli api-key list

# 4. Start chatting with your key
pnpm cli wakeup
# Select "Chat"
```

### Switch Between Servers
```bash
# Use production server
pnpm cli config set serverUrl https://phantom-agent-cli.vercel.app
pnpm cli login

# Switch to local development
pnpm cli config set serverUrl http://localhost:3000
pnpm cli login

# Switch to custom server
pnpm cli config set serverUrl https://your-app.com
pnpm cli login
```

---

## Help Commands

### Main Help
```bash
pnpm cli --help
```
Shows all available commands.

### Command-Specific Help
```bash
pnpm cli config --help
pnpm cli login --help
pnpm cli api-key --help
```

---

## Testing Workflow

### Test Authentication Flow
```bash
# 1. Ensure server is running (for localhost)
pnpm dev

# 2. Configure CLI
pnpm cli config set serverUrl http://localhost:3000

# 3. Login
pnpm cli login
# Expected: Device code displayed, browser opens, successful authentication

# 4. Verify session
pnpm cli whoami
# Expected: User details displayed
```

### Test Chat Functionality
```bash
# 1. Start chat
pnpm cli wakeup

# 2. Select "Chat"

# 3. Send a message
# "Hello, who are you?"

# 4. Verify AI response
# Expected: Response from Gemini AI

# 5. Continue conversation
# "What can you help me with?"

# 6. Exit
# Type: exit
```

### Test API Key Management
```bash
# 1. Add a key
pnpm cli api-key add
# Name: Test Key
# Key: AIzaSy... (your actual key)
# Model: gemini-1.5-flash

# 2. List keys
pnpm cli api-key list
# Expected: Shows "Test Key" with details

# 3. Chat with your key
pnpm cli wakeup
# Select "Chat" and verify it uses your key

# 4. Remove key
pnpm cli api-key remove
# Select "Test Key"

# 5. Verify removal
pnpm cli api-key list
# Expected: Key no longer shown
```

### Test Error Handling
```bash
# 1. Try command without auth
pnpm cli logout
pnpm cli whoami
# Expected: Error message prompting to login

# 2. Try with wrong server
pnpm cli config set serverUrl http://invalid-server:9999
pnpm cli login
# Expected: Fetch failed error

# 3. Reset to working server
pnpm cli config set serverUrl http://localhost:3000
```

---

## Available Gemini Models

When adding an API key, you can choose from:

1. **gemini-1.5-flash** (Default) - Fast and efficient, good for most use cases
2. **gemini-1.5-flash-8b** - Smallest and fastest, lower cost
3. **gemini-1.5-pro** - Most capable, best quality responses
4. **gemini-2.0-flash** - Latest flash model with improvements
5. **gemini-2.5-flash** - Future flash model (when available)
6. **gemini-2.5-pro** - Future pro model (when available)

---

## Configuration Storage

All CLI data is stored in `~/.orbital-cli/`:

```
~/.orbital-cli/
├── config.json      # Server URL and preferences
└── token.json       # Authentication session token
```

### View Config Files
```bash
# Windows
cat ~\.orbital-cli\config.json
cat ~\.orbital-cli\token.json

# Linux/Mac
cat ~/.orbital-cli/config.json
cat ~/.orbital-cli/token.json
```

### Reset CLI (Clear All Data)
```bash
# Windows
rm -r ~\.orbital-cli

# Linux/Mac
rm -rf ~/.orbital-cli

# Then reconfigure
pnpm cli config init
pnpm cli login
```

---

## Troubleshooting Commands

### Check Configuration
```bash
pnpm cli config get
```

### Verify Authentication
```bash
pnpm cli whoami
```

### Test Server Connection
```bash
# Set server
pnpm cli config set serverUrl http://localhost:3000

# Try login
pnpm cli login
```

### Re-authenticate
```bash
pnpm cli logout
pnpm cli login
```

### Check Server Status (Manual)
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test device flow endpoint
curl -X POST http://localhost:3000/api/auth/device/code \
  -H "Content-Type: application/json" \
  -d '{"client_id": "orbital-cli", "scope": "openid profile email"}'
```

---

## Development Commands

### Run CLI Directly
```bash
cd cli
node main.js <command>

# Examples:
node main.js config get
node main.js login
node main.js wakeup
```

### Debug Mode
```bash
# Add console.logs in the code, then:
pnpm cli <command>
```

---

## Example Complete Session

```bash
# Setup
pnpm cli config init
# Enter: http://localhost:3000

# Login
pnpm cli login
# Complete browser authorization

# Verify
pnpm cli whoami

# Add API key (optional)
pnpm cli api-key add
# Name: My Key
# Key: AIza...
# Model: gemini-1.5-flash

# Start chatting
pnpm cli wakeup
# Select: Chat
# Send messages...
# Type: exit

# Cleanup
pnpm cli logout
```

---

## Notes

- All commands require `pnpm cli` prefix when running from the project root
- Authentication is required for most commands (except config and login)
- Session tokens expire after inactivity (default: ~30 minutes)
- API keys are stored on the server and synced across devices
- The CLI works independently - you can point it to any compatible Phantom server
