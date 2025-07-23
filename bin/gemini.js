#!/usr/bin/env node

import { startChat } from '../lib/chat.js';
import { handleConfigCommand } from '../lib/config-command.js';

const args = process.argv.slice(2);

if (args[0] === 'config') {
  handleConfigCommand(args.slice(1));
} else {
  startChat();
}

if (args[0] === 'help') {
  console.log(`
  Usage:
    gemini           Start chat
    gemini config    Manage API key (set/show/reset)
    gemini help      Show this help message
  `);
  process.exit(0);
}
