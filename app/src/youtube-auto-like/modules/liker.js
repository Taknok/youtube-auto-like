import {
  OptionManager,
} from "./options";

function startLikerProcess() {
  if (!window.returnLikerProcessSet) {
    getLikeButton().addEventListener("click", likeClicked);
    getDislikeButton().addEventListener("click", dislikeClicked);
    getLikeButton().addEventListener("touchstart", likeClicked);
    getLikeButton().addEventListener("touchstart", dislikeClicked);
    window.returnLikerProcessSet = true;
  }
}

function init() {
  window.yal_options = new OptionManager()
  window.yal_options.like_what === "none"
}