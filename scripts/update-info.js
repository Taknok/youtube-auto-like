const fs = require("fs");

const updateInfoPath = "app/update_info.html";
const startMarker = "<!-- semantic-release-notes:start -->";
const endMarker = "<!-- semantic-release-notes:end -->";

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

const stripMarkdown = (text) =>
  text
    .replace(/\s+\(\[[^\]]+\]\([^)]*\)\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();

module.exports = {
  prepare: async (pluginConfig, { nextRelease }) => {
    const commitTitles = nextRelease.notes
      .split(/\r?\n/)
      .filter((line) => /^\* /.test(line))
      .map((line) => stripMarkdown(line.slice(2)))
      .filter(Boolean);

    const listItems = commitTitles
      .map((title) => `\t\t<li>${escapeHtml(title)}</li>`)
      .join("\n");
    const replacement = `${startMarker}\n\t<ul>\n${listItems}\n\t</ul>\n\t${endMarker}`;
    const updateInfo = fs.readFileSync(updateInfoPath, "utf8");
    const sectionPattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);

    if (!sectionPattern.test(updateInfo)) {
      throw new Error(`Could not find the release notes section in ${updateInfoPath}`);
    }

    fs.writeFileSync(updateInfoPath, updateInfo.replace(sectionPattern, replacement));
    console.log(`Updated ${updateInfoPath} with ${commitTitles.length} release notes.`);
  },
};
