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
```

## Quick Start

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

```bash
phantom login
```

This will:
1. Display a device code
2. Open your browser for authorization
3. Store your session token

### 3. Start Chatting

Wake up the AI and start chatting:

```bash
phantom wakeup
```

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

# Install dependencies
npm install

# Run locally
npm start
```

## Troubleshooting

### "Not authenticated" Error

Run `phantom login` to authenticate.

### "No API key available" Error

Set your API key with `phantom api-key set`.

### Session Expired

Your session expires after a certain period. Run `phantom login` again.

## License

MIT

## Support

For issues and questions:
- GitHub Issues: https://github.com/your-username/phantom-cli/issues
- Email: support@phantom-cli.com
