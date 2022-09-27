function getVideoId(url) {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  if (pathname.startsWith("/clip")) {
    return document.querySelector("meta[itemprop='videoId']").content;
  } else {
    if (pathname.startsWith("/shorts")) {
      return pathname.slice(8);
    }
    return urlObject.searchParams.get("v");
  }
}

function isVideoLoaded() {
  const videoId = getVideoId(window.location.href);
  return (
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
    // mobile: no video-id attribute
    document.querySelector('#player[loading="false"]:not([hidden])') !== null
  );
}

/**
 * Return a random integer in a given range
 * @param {number} min An integer representing the start of the range
 * @param {number} max An integer representing the end of the range
 * @return {number} The random integer selected in the range
 */
function randomIntFromInterval(min, max) { //min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
