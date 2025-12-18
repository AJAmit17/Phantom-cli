const chalk = require("chalk");
const boxen = require("boxen");
const { text, isCancel, cancel, multiselect } = require("@clack/prompts");
const yoctoSpinner = require("yocto-spinner").default;
const { getServerUrl } = require("../utils/config");

// Available tools configuration
const availableTools = [
    {
        id: "web_search",
        name: "Web Search",
        description: "Search the internet for information",
    },
    {
        id: "calculator",
        name: "Calculator",
        description: "Perform mathematical calculations",
    },
    {
        id: "weather",
        name: "Weather",
        description: "Get current weather information",
    },
];

let enabledToolIds = [];

async function selectTools() {
    const toolOptions = availableTools.map(tool => ({
        value: tool.id,
        label: tool.name,
        hint: tool.description,
    }));

    const selectedTools = await multiselect({
        message: chalk.cyan("Select tools to enable (Space to select, Enter to confirm):"),
        options: toolOptions,
        required: false,
    });

    if (isCancel(selectedTools)) {
        cancel(chalk.yellow("Tool selection cancelled"));
        process.exit(0);
    }

    enabledToolIds = selectedTools;

    if (selectedTools.length === 0) {
        console.log(chalk.yellow("\n⚠️  No tools selected. AI will work without tools.\n"));
    } else {
        const toolsBox = boxen(
            chalk.green(`✅ Enabled tools:\n${selectedTools.map(id => {
                const tool = availableTools.find(t => t.id === id);
                return `  • ${tool.name}`;
            }).join('\n')}`),
            {
                padding: 1,
                margin: { top: 1, bottom: 1 },
                borderStyle: "round",
                borderColor: "green",
                title: "🛠️  Active Tools",
                titleAlignment: "center",
            }
        );
        console.log(toolsBox);
    }

    return selectedTools.length > 0;
}

async function startToolChat(user, token) {
    const BASE_URL = await getServerUrl();
    let conversationId = null;

    // Select tools first
    await selectTools();

    const enabledToolNames = enabledToolIds.map(id => {
        const tool = availableTools.find(t => t.id === id);
        return tool.name;
    });

    const helpBox = boxen(
        `• Type your message and press Enter\n` +
        `• AI has access to: ${enabledToolNames.length > 0 ? enabledToolNames.join(", ") : "No tools"}\n` +
        `• Type "exit" to end conversation\n` +
        `• Press Ctrl+C to quit anytime`,
        {
            padding: 1,
            margin: { bottom: 1 },
            borderStyle: "round",
            borderColor: "gray",
            dimBorder: true,
        }
    );

    console.log(helpBox);

    while (true) {
        const userInput = await text({
            message: chalk.blue("💬 Your message"),
            placeholder: "Type your message...",
            validate(value) {
                if (!value || value.trim().length === 0) {
                    return "Message cannot be empty";
                }
            },
        });

        if (isCancel(userInput)) {
            cancel("Chat ended");
            process.exit(0);
        }

        if (userInput.toLowerCase() === "exit") {
            console.log(chalk.yellow("\n👋 Goodbye!"));
            break;
        }

        // Display user message
        const userBox = boxen(chalk.white(userInput), {
            padding: 1,
            margin: { left: 2, bottom: 1 },
            borderStyle: "round",
            borderColor: "blue",
            title: "👤 You",
            titleAlignment: "left",
        });
        console.log(userBox);

        // Get AI response
        const spinner = yoctoSpinner({
            text: "AI is thinking with tools...",
            color: "cyan",
        }).start();

        try {
            const response = await fetch(`${BASE_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.access_token}`,
                },
                body: JSON.stringify({
                    message: userInput,
                    conversationId,
                    mode: "tool",
                    enabledTools: enabledToolIds,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log(chalk.gray("\n🔍 DEBUG - Response status:"), response.status);
                console.log(chalk.gray("🔍 DEBUG - Error data:"), JSON.stringify(errorData, null, 2));
                throw new Error(errorData.error || "Failed to get response");
            }

            const data = await response.json();
            spinner.success("Response received");

            // Update conversation ID
            if (data.conversationId && !conversationId) {
                conversationId = data.conversationId;
            }

            // Display tool calls if any
            if (data.toolCalls && data.toolCalls.length > 0) {
                const toolCallBox = boxen(
                    data.toolCalls.map(tc => {
                        const argsStr = tc.args ? JSON.stringify(tc.args, null, 2) : "No args";
                        return `${chalk.cyan("🔧 Tool:")} ${tc.toolName}\n${chalk.gray("Args:")} ${argsStr}`;
                    }).join("\n\n"),
                    {
                        padding: 1,
                        margin: { left: 2, bottom: 1 },
                        borderStyle: "round",
                        borderColor: "cyan",
                        title: "🛠️  Tool Calls",
                    }
                );
                console.log(toolCallBox);
            }

            // Display tool results if any
            if (data.toolResults && data.toolResults.length > 0) {
                const toolResultBox = boxen(
                    data.toolResults.map(tr => {
                        const resultStr = tr.result ? JSON.stringify(tr.result) : "No result";
                        const truncated = resultStr.length > 200 ? resultStr.slice(0, 200) + "..." : resultStr;
                        return `${chalk.green("✅ Tool:")} ${tr.toolName}\n${chalk.gray("Result:")} ${truncated}`;
                    }).join("\n\n"),
                    {
                        padding: 1,
                        margin: { left: 2, bottom: 1 },
                        borderStyle: "round",
                        borderColor: "green",
                        title: "📊 Tool Results",
                    }
                );
                console.log(toolResultBox);
            }

            // Display AI response
            const assistantBox = boxen(chalk.white(data.assistantMessage.content), {
                padding: 1,
                margin: { left: 2, bottom: 1 },
                borderStyle: "round",
                borderColor: "green",
                title: "🤖 Assistant (with tools)",
                titleAlignment: "left",
            });
            console.log(assistantBox);
        } catch (error) {
            spinner.error("Failed to get response");
            console.error(chalk.red("\n❌ Error:"), error.message);
            console.log(chalk.yellow("Let's try again...\n"));
        }
    }
}

module.exports = { startToolChat };
