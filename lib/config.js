import fs from 'fs';
import path from 'path';
import os from 'os';

const configDir = path.join(os.homedir(), '.gemini-cli');
const configFile = path.join(configDir, 'config.json');

export function getConfig() {
  if (!fs.existsSync(configFile)) return {};
  return JSON.parse(fs.readFileSync(configFile, 'utf8'));
}

export function setConfig(key, value) {
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir);
  let config = getConfig();
  config[key] = value;
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

export function getApiKey() {
  const config = getConfig();
  return config.API_KEY || null;
}

