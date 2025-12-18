# 🚀 Phantom CLI - AI-Powered Monolithic Application

A full-stack Next.js application featuring AI-powered chat, secure authentication, device flow authorization, and a powerful CLI tool - all in one monolithic architecture.

## ✨ Features

### 🤖 AI-Powered Chat
- **Gemini AI Integration**: Intelligent conversations powered by Google's Gemini AI
- **Multi-Model Support**: Choose from different AI models for your use case
- **Conversation History**: Persistent chat history with database storage
- **Tool Calling & Agent Mode**: Advanced AI capabilities with autonomous agents

### 🔐 Authentication & Authorization
- **Secure Auth**: Built with [Better Auth](https://www.better-auth.com/) for robust authentication
- **Multiple Auth Methods**: Email/password, OAuth providers support
- **Device Flow**: OAuth2 device flow for CLI authentication
- **Session Management**: Secure session handling with token-based auth

### 🔑 API Key Management
- **BYOK (Bring Your Own Key)**: Users can use their own Gemini API keys
- **Secure Storage**: Encrypted API key storage in PostgreSQL
- **Easy Management**: Web UI and CLI for key management

### 💻 Command Line Interface
- **Interactive CLI**: Beautiful terminal UI with `@clack/prompts`
- **Device Authentication**: Seamless login flow from the terminal
- **AI Chat in Terminal**: Chat with AI directly from your command line
- **Tool Management**: Manage API keys, auth, and more via CLI

### 🎨 Modern UI/UX
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Eye-friendly dark theme
- **Real-time Updates**: Instant feedback with React Query

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **React Query** - Server state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Robust relational database
- **Better Auth** - Authentication & session management

### AI & Tools
- **Vercel AI SDK** - AI/LLM integration framework
- **Google Gemini** - Advanced AI models
- **Tool Calling** - Function calling capabilities

### CLI
- **Commander.js** - CLI framework
- **@clack/prompts** - Beautiful CLI prompts
- **Chalk & Boxen** - Terminal styling

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

### 1. Clone the repository
```bash
git clone https://github.com/AJAmit17/Phantom-cli.git
cd Phantom-cli
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/Phantom"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# AI (Optional - users can provide their own)
GEMINI_API_KEY="your-gemini-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set up the database
```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Open Prisma Studio to view data
pnpm prisma studio
```

### 5. Run the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🖥️ CLI Usage

### Installation
The CLI is included in the monorepo. Use it directly:

```bash
# Show all commands
pnpm cli --help

# Or install globally (from cli directory)
cd cli
npm link
phantom --help
```

### Authentication
```bash
# Login with device flow
pnpm cli login

# Check current user
pnpm cli whoami

# Logout
pnpm cli logout
```

### API Key Management
```bash
# Set your Gemini API key
pnpm cli api-key set

# View your API key
pnpm cli api-key get

# Remove your API key
pnpm cli api-key remove
```

### AI Chat
```bash
# Start an AI chat session
pnpm cli ai chat

# Chat with tool calling enabled
pnpm cli ai chat --tools

# Use autonomous agent mode
pnpm cli ai agent
```

For detailed CLI documentation, see [CLI_USAGE.md](./CLI_USAGE.md).

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/                 # API routes
│   │   ├── auth/           # Auth endpoints
│   │   ├── chat/           # AI chat endpoints
│   │   ├── conversations/  # Conversation management
│   │   └── api-keys/       # API key management
│   ├── chat/               # Chat interface
│   ├── dashboard/          # User dashboard
│   └── device/             # Device authorization flow
├── cli/                     # CLI application
│   ├── commands/           # CLI commands
│   ├── chat/              # CLI chat implementations
│   └── utils/             # CLI utilities
├── components/             # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Shared libraries
│   ├── auth.ts           # Auth configuration
│   ├── prisma.ts         # Prisma client
│   ├── ai-service.ts     # AI service integration
│   └── chat-service.ts   # Chat management
├── prisma/               # Database schema & migrations
└── hooks/                # Custom React hooks
```

## 🚀 Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm prisma generate  # Generate Prisma Client
pnpm prisma migrate dev # Run migrations
pnpm prisma studio    # Open Prisma Studio

# CLI
pnpm cli              # Run CLI commands
```

## 🔒 Security Features

- **Encrypted API Keys**: User API keys are securely stored with encryption
- **Session Management**: Secure token-based sessions with expiration
- **CORS Protection**: Proper CORS configuration for API routes
- **Input Validation**: Request validation and sanitization
- **Rate Limiting**: Built-in rate limiting for API endpoints

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI/LLM integration
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Better Auth](https://www.better-auth.com/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI models

## 📧 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🔗 Links

- **Documentation**: [CLI_USAGE.md](./CLI_USAGE.md)
- **Report Bug**: [GitHub Issues](https://github.com/AJAmit17/Phantom-cli/issues)
- **Request Feature**: [GitHub Issues](https://github.com/AJAmit17/Phantom-cli/issues)

---

Made with ❤️ by Amit
