import { spawn } from "child_process";
import semver from "semver";
import process from "process"; // Explicitly import process

const nodeVersion = process.version;

// Check if Node.js version is 17 or higher
const shouldUseLegacyProvider = semver.gte(nodeVersion, "17.0.0");

// Command to run the server
const nodeCommand = "node";
const nodeArgs = shouldUseLegacyProvider 
  ? ["--openssl-legacy-provider", "server.js"]
  : ["server.js"];

// Execute the command with spawn to properly handle interactive prompts
const child = spawn(nodeCommand, nodeArgs, {
  stdio: 'inherit' // This will properly handle interactive prompts
});

child.on("exit", (code) => {
  console.log(`Child process exited with code ${code}`);
});
