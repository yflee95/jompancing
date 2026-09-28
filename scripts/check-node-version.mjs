const minMajor = 20;
const major = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);

if (major < minMajor) {
  console.error(
    `Node ${process.versions.node} is too old. Jompancing requires Node >= ${minMajor}.`,
  );
  console.error("Windows (nvm): nvm use 22   — see README → Node.js");
  process.exit(1);
}
