import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey, setConfig } from "./config.js";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";

// MARKDOWN RENDERING SETUP
marked.setOptions({
  renderer: new TerminalRenderer({
    reflowText: true,
    strong: chalk.yellow.bold,
    listItem: chalk.green,
    heading: chalk.cyan.bold,
    codespan: chalk.magenta,
    code: chalk.magenta,
    link: chalk.blue.underline,
  }),
});

function colorizeDiagrams(text) {
  return text
    .split("\n")
    .map((line) => (line.match(/[+|>-]/) ? chalk.cyan(line) : line))
    .join("\n");
}
function enhanceBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, chalk.yellow.bold("$1"));
}

function renderMarkdownResponse(response) {
  const markdownOutput = marked(response);
  const diagramColored = colorizeDiagrams(markdownOutput);
  return enhanceBold(diagramColored);
}

// API KEY SETUP
async function ensureApiKey() {
  let apiKey = getApiKey();
  if (!apiKey) {
    console.log(chalk.yellow.bold("\nNo API key found!"));
    console.log(chalk.cyan("Follow these steps to get your Gemini API key:\n"));

    console.log(
      chalk.green("1.") +
        " Go to " +
        chalk.blue.underline("https://aistudio.google.com/app/apikey")
    );
    console.log(chalk.green("2.") + " Sign in with your Google account.");
    console.log(
      chalk.green("3.") +
        " Click " +
        chalk.bold('"Create API key"') +
        " and copy the generated key."
    );
    console.log(
      chalk.green("4.") +
        " The key will look like " +
        chalk.magenta("AIzaSy...")
    );
    console.log(chalk.green("5.") + " Paste it below when prompted.\n");

    try {
      const { key } = await inquirer.prompt([
        {
          type: "input",
          name: "key",
          message: "Enter your Gemini API Key:",
          validate: (input) => {
            if (!input || input.trim() === "")
              return "API key cannot be empty!";
            return true;
          },
        },
      ]);
      setConfig("API_KEY", key);
      apiKey = key;
    } catch (err) {
      if (err.name === "ExitPromptError") {
        console.log(chalk.yellow("\nGoodbye! (Ctrl+C)"));
        process.exit(0);
      }
      throw err;
    }
  }
  return apiKey;
}


// VALIDATE API KEY
async function validateApiKey(key) {
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    await model.generateContent("ping");
    return true;
  } catch (err) {
    return false;
  }
}

// MAIN CHAT LOOP
export async function startChat() {
  console.clear();
  console.log(
    chalk.cyanBright.bold("Welcome to Gemini CLI!") +
      " " +
      chalk.green("Ask me anything...\n")
  );

  const apiKey = await ensureApiKey();

  if (!(await validateApiKey(apiKey))) {
    console.log(chalk.red("Invalid API Key! Please check and try again."));
    process.exit(1);
  }

  // Initialize Gemini model (FIX for undefined model)
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  console.log(chalk.green('Type "exit" or ctrl+c to quit\n'));

  while (true) {
    try {
      const { userInput } = await inquirer.prompt([
        { type: "input", name: "userInput", message: chalk.blue("You:") },
      ]);

      if (userInput.toLowerCase() === "exit") {
        console.log(chalk.yellow("Goodbye!"));
        break;
      }

      const spinner = ora("Thinking...").start();
      const result = await model.generateContent(userInput);
      spinner.stop();

      console.log(renderMarkdownResponse(result.response.text()));
    } catch (err) {
      if (err.name === "ExitPromptError") {
        console.log(chalk.yellow("\nGoodbye! (Ctrl+C)"));
        process.exit(0);
      }
      console.log(chalk.red("Error:"), err.message);
    }
  }
}
