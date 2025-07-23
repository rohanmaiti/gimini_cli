import chalk from 'chalk';
import { setConfig, getApiKey } from './config.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

const configDir = path.join(os.homedir(), '.gemini-cli');
const configFile = path.join(configDir, 'config.json');

export function handleConfigCommand(args) {
  const subCmd = args[0];

  if (subCmd === 'set') {
    const key = args[1];
    if (!key) {
      console.log(chalk.red('Usage: gemini config set <API_KEY>'));
      return;
    }
    setConfig('API_KEY', key);
    console.log(chalk.green('API key saved successfully!'));
  }

  else if (subCmd === 'show') {
    const key = getApiKey();
    if (key) {
      console.log(chalk.cyan(`Current API key: ${key}`));
    } else {
      console.log(chalk.yellow('No API key set.'));
    }
  }

  else if (subCmd === 'reset') {
    if (fs.existsSync(configFile)) {
      fs.unlinkSync(configFile);
      console.log(chalk.green('API key reset successfully.'));
    } else {
      console.log(chalk.yellow('No API key found to reset.'));
    }
  }

  else {
    console.log(chalk.red('Usage: gemini config <set/show/reset>'));
  }
}
