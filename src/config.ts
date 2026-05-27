import os from "os";
import path from "path";
import fs from "fs";

export type Config = {
  dbUrl: string
  currentUserName: string
}

const configFilename = ".gatorconfig.json";

export function setUser(user: string): void {
  try {
    const cfgPath = getConfigFilePath();
    const file = fs.readFileSync(cfgPath, { encoding: "utf-8" });
    const rawData = JSON.parse(file);
    const cfg = validateConfig(rawData);
    cfg.currentUserName = user;
    writeConfig(cfg);
  } catch (e) {
    console.error("Error setting user:", e);
  }
}

export function readConfig() {
  const fullPath = getConfigFilePath();

  const data = fs.readFileSync(fullPath, "utf-8");
  const rawConfig = JSON.parse(data);

  return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, configFilename);
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig == null) {
    throw new Error("Config must be an object");
  }
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("DB_URL must be a string");
  }
  if (!rawConfig.current_user_name || typeof rawConfig.current_user_name !== "string") {
    throw new Error("CURRENT_USER_NAME must be a string");
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name
  }
}

function writeConfig(cfg: Config): void {
  const cfgPath = getConfigFilePath();
  const conf = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName
  }
  const data = JSON.stringify(conf, null, 2);
  fs.writeFileSync(cfgPath, data, { encoding: "utf-8" });
}
