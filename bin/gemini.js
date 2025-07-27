#!/usr/bin/env node

import { startChat } from '../lib/chat.js';
import { handleConfigCommand } from '../lib/config-command.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const args = process.argv.slice(2);
const command = args[0];

if (command === 'config') {
  handleConfigCommand(args.slice(1));
} else if (command === 'help' || command === '--help') {
  console.log(`
  Usage:
    gemini                       Start chat
    gemini <question>            Ask a question directly
    gemini config <set/show/reset> Manage API key
    gemini --version, -v         Show version number
    gemini --help, help          Show this help message

  To uninstall, run: npm uninstall -g gemini-cli-chat
  `);
  process.exit(0);
} else if (command === '--version' || command === '-v') {
  console.log(pkg.version);
  process.exit(0);
} else if (!command) {
  startChat();
} else {
  startChat(args.join(' '));
}
