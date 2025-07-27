#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';

const configDir = path.join(os.homedir(), '.gemini-cli');

try {
  if (fs.existsSync(configDir)) {
    fs.rmSync(configDir, { recursive: true, force: true });
    console.log('Gemini CLI configuration directory removed.');
  }
} catch (err) {
  console.error('Error removing Gemini CLI configuration:', err);
}
