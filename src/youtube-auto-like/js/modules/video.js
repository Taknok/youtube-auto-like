import {
  Logger
} from "./log.js";

import {
  getLikeButton,
  getDislikeButton
} from "./buttons.js";

var log = new Logger(true);

export function video() {
  return document.querySelectorAll(".video-stream")[0];
}

export function getVideoId(url) {
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

export function isVideoLoaded() {
  const videoId = getVideoId(window.location.href);
  return (
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
    // mobile: no video-id attribute
    document.querySelector('#player[loading="false"]:not([hidden])') !== null
  );
}

/**
 * Take a wild guess
 * @return {Boolean} True if the like or dislike button is active
 */
export function isVideoRated() {
  log.debug("checking if video is rated");
    return getLikeButton().classList.contains("style-default-active") ||
      getDislikeButton().classList.contains("style-default-active");
}
