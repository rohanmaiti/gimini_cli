#!/usr/bin/env node

import { startChat } from '../lib/chat.js';
import { handleConfigCommand } from '../lib/config-command.js';

const args = process.argv.slice(2);
const command = args[0];

if (command === 'config') {
  handleConfigCommand(args.slice(1));
} else if (command === 'help' || command === '--help') {
  console.log(`
  Usage:
    gemini           Start chat
    gemini config    Manage API key (set/show/reset)
    gemini help      Show this help message

  To uninstall, run: npm uninstall -g gemini-cli-chat
  `);
  process.exit(0);
} else if (!command) {
  startChat();
} else {
  startChat(args.join(' '));
}
