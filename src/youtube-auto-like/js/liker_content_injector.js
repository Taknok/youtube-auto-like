function getBrowser() {
  if (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined") {
    return chrome;
  } else if (
    typeof browser !== "undefined" &&
    typeof browser.runtime !== "undefined"
  ) {
    return browser;
  } else {
    console.log("browser is not supported");
    return false;
  }
}

(async () => {
  const src = getBrowser().runtime.getURL('js/yal_content_script.js');
  const contentScript = await import(src);
  contentScript.main();
})();
