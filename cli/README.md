<<<<<<< Updated upstream
# Phantom CLI

AI-powered CLI with device flow authentication and bring-your-own-key support.

## Installation

Install globally using npm:

```bash
npm install -g @phantom/cli
```

Or using yarn:

```bash
yarn global add @phantom/cli
```

Or using pnpm:

```bash
pnpm add -g @phantom/cli
=======
# Phantom AI CLI

AI-powered CLI with device flow authentication, tool calling, and autonomous agent mode powered by Google Gemini.

## Features

- 🔐 **Device Flow Authentication** - Secure OAuth 2.0 device authorization
- 💬 **AI Chat** - Interactive chat with Google Gemini AI
- 🛠️ **Tool Calling Mode** - AI with access to Google Search and Code Execution
- 🤖 **Agent Mode** - Autonomous AI agent that generates complete applications
- 🔑 **BYOK** - Bring Your Own (API) Key support
- 💾 **Conversation History** - Persistent chat sessions

## Installation

### Global Installation (Recommended)

```bash
npm install -g @phantom-ai/cli
```

### Using npx (No Installation Required)

```bash
npx @phantom-ai/cli
```

### From Source

```bash
git clone https://github.com/yourusername/phantom-ai-cli.git
cd phantom-ai-cli/cli
npm install
npm link
>>>>>>> Stashed changes
```

## Quick Start

<<<<<<< Updated upstream
### 1. Set Your API Key (BYOK)

Before using the CLI, set your AI provider API key:

```bash
phantom api-key set
```

You'll be prompted to:
- Select your provider (Google/OpenAI/Anthropic)
- Enter your API key
- Name your key (optional)

Your API key is stored locally in `~/.orbital-cli/config.json` and synced to the server when you log in.

### 2. Login

Authenticate using device flow:

=======
1. **Login to your account:**
>>>>>>> Stashed changes
```bash
phantom login
```

<<<<<<< Updated upstream
This will:
1. Display a device code
2. Open your browser for authorization
3. Store your session token

### 3. Start Chatting

Wake up the AI and start chatting:

=======
2. **Set your Google AI API key:**
```bash
phantom api-key set
```
Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Start chatting:**
>>>>>>> Stashed changes
```bash
phantom wakeup
```

<<<<<<< Updated upstream
## Available Commands

### Authentication

- `phantom login` - Authenticate using device flow
- `phantom logout` - Sign out and clear session
- `phantom whoami` - Show current user information

### API Key Management

- `phantom api-key set` - Add your API key
- `phantom api-key get` - View configured API keys (masked)
- `phantom api-key remove` - Remove an API key

### AI Chat

- `phantom wakeup` - Start AI chat session

## Configuration

The CLI stores configuration in `~/.orbital-cli/`:
- `token.json` - Authentication token
- `config.json` - API keys and preferences

## Bring Your Own Key (BYOK)

Phantom CLI supports BYOK, allowing you to use your own API keys instead of relying on shared credentials:

### Supported Providers

- **Google Gemini** - Get your API key at https://makersuite.google.com/app/apikey
- **OpenAI GPT** - Get your API key at https://platform.openai.com/api-keys
- **Anthropic Claude** - Get your API key at https://console.anthropic.com/

### Why BYOK?

- **Cost Control**: Use your own API quotas
- **Privacy**: Your API calls go directly to the provider
- **Flexibility**: Switch providers anytime
- **No Limits**: No rate limiting from shared keys

## Server Configuration

By default, the CLI connects to `http://localhost:3000`. To change this:

```bash
export NEXT_PUBLIC_APP_URL=https://your-server.com
```

Or set it in your shell profile (`.bashrc`, `.zshrc`, etc.).

## Development

To use the CLI from source:

```bash
# Clone the repository
git clone https://github.com/your-username/phantom-cli.git
cd phantom-cli
=======
## Commands

### Authentication

```bash
phantom login              # Login with device flow
phantom logout             # Logout from current session
phantom whoami             # Show current user info
```

### API Key Management

```bash
phantom api-key set        # Set your Google AI API key
phantom api-key get        # View current API key info
phantom api-key list       # List all configured keys
```

### AI Interaction

```bash
phantom wakeup            # Start AI interaction (choose mode)
```

**Available Modes:**
- **Chat** - Simple conversational AI
- **Tool Calling** - AI with Google Search & Code Execution
- **Agent Mode** - Autonomous app generation
- **View Conversations** - Browse chat history

### Configuration

```bash
phantom config get         # View current configuration
phantom config set         # Update configuration
phantom config reset       # Reset to defaults
```

## Usage Examples

### Basic Chat
```bash
phantom wakeup
# Select: Chat
# Ask anything!
```

### Tool Calling with Web Search
```bash
phantom wakeup
# Select: Tool Calling
# Choose tools: Google Search, Code Execution
# Ask: "What's the weather in Tokyo?"
```

### Generate a Complete App
```bash
phantom wakeup
# Select: Agent Mode
# Describe: "Build a todo app with React and Tailwind"
# The AI will create all files and folders!
```

## Configuration

The CLI stores configuration in `~/.phantom-cli/`:
- `config.json` - Settings and API keys
- `token.json` - Authentication tokens
- `cache/` - Cached responses

## Requirements

- Node.js >= 18.0.0
- Google AI API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Environment Variables

```bash
GOOGLE_API_KEY          # Fallback API key (optional)
PHANTOM_SERVER_URL      # Custom server URL (optional)
```

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/phantom-ai-cli.git
cd phantom-ai-cli/cli
>>>>>>> Stashed changes

# Install dependencies
npm install

<<<<<<< Updated upstream
# Run locally
npm start
=======
# Link for local development
npm link

# Run the CLI
phantom wakeup
>>>>>>> Stashed changes
```

## Troubleshooting

<<<<<<< Updated upstream
### "Not authenticated" Error

Run `phantom login` to authenticate.

### "No API key available" Error

Set your API key with `phantom api-key set`.

### Session Expired

Your session expires after a certain period. Run `phantom login` again.
=======
### "Not authenticated" error
```bash
phantom logout
phantom login
```

### "No API key found" error
```bash
phantom api-key set
```

### Clear cache
```bash
rm -rf ~/.phantom-cli/cache
```
>>>>>>> Stashed changes

## License

MIT

## Support

<<<<<<< Updated upstream
For issues and questions:
- GitHub Issues: https://github.com/your-username/phantom-cli/issues
- Email: support@phantom-cli.com
=======
- 🐛 [Report a bug](https://github.com/yourusername/phantom-ai-cli/issues)
- 💡 [Request a feature](https://github.com/yourusername/phantom-ai-cli/issues)
- 📧 Email: support@phantom-ai.dev

## Changelog

### v1.0.0 (2025-01-XX)
- Initial release
- Device flow authentication
- AI chat with Gemini
- Tool calling mode (Google Search, Code Execution)
- Agent mode for app generation
- BYOK support
>>>>>>> Stashed changes
