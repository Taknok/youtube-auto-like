const { execFileSync } = require("child_process");
const fs = require("fs");

const previousRelease = process.argv[2];
const updateInfoPath = "app/update_info.html";
const startMarker = "<!-- semantic-release-notes:start -->";
const endMarker = "<!-- semantic-release-notes:end -->";

if (!previousRelease) {
  console.error("Usage: node scripts/update-info.js <previous-release-git-hash>");
  process.exit(1);
}

const commitTitles = execFileSync(
  "git",
  ["log", "--format=%s", "--no-merges", `${previousRelease}..HEAD`],
  { encoding: "utf8" }
)
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .reverse();

const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const listItems = commitTitles
  .map((title) => `\t\t<li>${escapeHtml(title)}</li>`)
  .join("\n");
const replacement = `${startMarker}\n\t<ul>\n${listItems}\n\t</ul>\n\t${endMarker}`;

const updateInfo = fs.readFileSync(updateInfoPath, "utf8");
const sectionPattern = new RegExp(
  `${startMarker}[\\s\\S]*?${endMarker}`
);

if (!sectionPattern.test(updateInfo)) {
  throw new Error(`Could not find the release notes section in ${updateInfoPath}`);
}

fs.writeFileSync(updateInfoPath, updateInfo.replace(sectionPattern, replacement));
console.log(`Updated ${updateInfoPath} with ${commitTitles.length} commit titles.`);
