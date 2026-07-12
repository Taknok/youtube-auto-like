const fs = require("fs");

const manifestPath = "app/manifest.json";
const packageJsonPath = "package.json";
const version = process.argv[2];

if (!version) {
  console.error("Usage: node scripts/update-manifest.js <version>");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.version = version;

fs.writeFileSync(
  manifestPath,
  JSON.stringify(manifest, null, 2) + "\n"
);

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
packageJson.version = version;

fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2) + "\n"
);

console.log(`Updated manifest.json and package.json to ${version}`);
