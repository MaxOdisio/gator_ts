import { readConfig, setUser } from "./config.js";

function main() {
  setUser("Lane");
  const cfg = readConfig();
  console.log(cfg);
}

main();
