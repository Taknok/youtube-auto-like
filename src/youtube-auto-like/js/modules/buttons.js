import { isMobile, isShorts } from "./states.js";
import { isInViewport } from "./utils.js";

export function getButtons() {
  //---   If Watching Youtube Shorts:   ---//
  if (isShorts()) {
    let elements = document.querySelectorAll(
      isMobile()
        ? "ytm-like-button-renderer"
        : "#like-button > ytd-like-button-renderer"
    );
    for (let element of elements) {
      //Youtube Shorts can have multiple like/dislike buttons when scrolling through videos
      //However, only one of them should be visible (no matter how you zoom)
      if (isInViewport(element)) {
        return element;
      }
    }
  }
  //---   If Watching On Mobile:   ---//
  if (isMobile()) {
    return document.querySelector(".slim-video-action-bar-actions");
  }
  //---   If Menu Element Is Displayed:   ---//
  if (document.getElementById("menu-container")?.offsetParent === null) {
    return document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div");
    //---   If Menu Element Isnt Displayed:   ---//
  } else {
    return document
      .getElementById("menu-container")
      ?.querySelector("#top-level-buttons-computed");
  }
}

export function getLikeButton() {
  return getButtons().children[0].tagName ===
    "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
    ? getButtons().children[0].children[0]
    : getButtons().children[0];
}

export function getDislikeButton() {
  return getButtons().children[0].tagName ===
    "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
    ? getButtons().children[0].children[1]
    : getButtons().children[1];
}