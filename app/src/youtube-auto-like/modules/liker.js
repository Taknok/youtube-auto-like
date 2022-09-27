import {
  OptionManager,
} from "./options";

import {
  Logger
} from "./log";

import {
  getLikeButton,
  getDislikeButton,
} from "./buttons";

import {
  randomIntFromInterval,
} from "./utils";

import {
  video,
} from "./video";

function startLikerProcess() {
  if (!window.returnLikerProcessSet) {
    optionManager = new OptionManager()
    window.yal_options = await optionManager.get();
    var log = Logger(window.yal_options.debug);

    log.debug("yt-autolike starting");
    start();

    getLikeButton().addEventListener("click", likeClicked);
    getDislikeButton().addEventListener("click", dislikeClicked);
    getLikeButton().addEventListener("touchstart", likeClicked);
    getLikeButton().addEventListener("touchstart", dislikeClicked);


    window.returnLikerProcessSet = true;
  }
}

function start() {
  // exit if not activated
  if (window.yal_options.like_what === "none") {
    log.debug("yt-autolike disabled");
    return;
  }

  let likeBtn = getLikeButton();
  let dLikeBtn = getDislikeButton();

  if (!shouldLike()) {
    log.debug("not liked check 1");
    return;
  }

  waitTimer()

  // check if while waiting user rate the video
  if (!shouldLike()) {
    log.debug("not liked check 2");
    return;
  }

  attemptLike();
  log.debug("liked");
  window.yal_options.counter += 1;
  optionManager.set(window.yal_options)

}

function waitTimer(callback) {
  await waitAd();

  if (window.yal_options.like_timer === "instant") {
    log.debug("waitTimer: instant");
    callback();
    return;

  } else if (window.yal_options.like_timer === "random") {
    window.yal_random_timer = randomIntFromInterval(0, 99);
    await waitRandomTimer(callback);

  } else if (window.yal_options.like_timer === "custom") {
    if (window.yal_options.percentage_timer) {
      await waitPercentTimer(callback);

    } else if (window.yal_options.minute_timer) {
      await waitMinuteTimer(callback);

    } else {
      log.error("Should not reach this point 1");
    }
  } else {
    log.error("Should not reach this point 2");
  }
}

async function waitMinuteTimer(callback) {
  log.debug("waitTimer: minute");
  let timeAtLike = window.yal_options.minute_value;

  // change timeAtLike if vid shorter than time set by user
  log.debug(video().currentTime, video().duration, timeAtLike)
  if (video().duration < timeAtLike) {
    timeAtLike = video().duration;
  } else {
    // convert in second
    timeAtLike *= 60;
  }

  if (video().currentTime >= timeAtLike) {
    callback();
    return;
  }
}

async function waitPercentTimer(callback) {
  log.debug("waitTimer: percent")
  let percentageAtLike = window.yal_options.percentage_value;
  let nowInPercent = video().currentTime / duration * 100;

  if (nowInPercent >= percentageAtLike) {
    callback();
  } else {
    setTimeout(() => waitPercentTimer(callback), 1000);
  }
}

async function waitRandomTimer(callback) {
  log.debug("waitTimer: random")
  let duration = video().duration;
  let nowInPercent = video().currentTime / duration * 100;

  if (nowInPercent >= window.yal_random_timer) {
    callback();
  } else {
    setTimeout(() => waitRandomTimer(callback), 1000);
  }
}

async function waitAd() {
  let adRunning = video().closest(".ad-showing,.ad-interrupting") !== null
  if (adRunning) {
    log.debug("wait ad");
    return await setTimeout(() => waitAd(), 1000);
  }
}

function shouldLike() {
  let rated = isVideoRated();
  if (rated) {
    log.debug("already liked/disliked video");
    return false;
  }

  let mode_should_like = shouldModeLike();

  log.debug("Use list:", window.yal_options.use_list);
  if (this.options.use_list) {
    return shouldListLike(mode_should_like);
  } else {
    log.debug(`Should like: ${mode_should_like}`);
    return mode_should_like;
  }
}

function shouldModeLike() {
  if (window.yal_options.like_what === "subscribed") {
    log.debug("Sub mode");
    return isUserSubscribed(); 
  } else { // it all mode
    log.debug("All mode");
    return true;
  }
}

function shouldListLike(mode_should_like) {
    let list_should_like = "";
    let creator = getCreatorFromVideo();
    let creator_list = window.yal_options.creator_list;
    let in_list = false;
    for (var i = 0; i < creator_list.length; i++) {
      if (creator_list[i].URL === creator.URL ) {
        log.debug("Creator is in list");
        in_list = true;
        break;
      }
    }

    if (window.yal_options.type_list === "white") {
      log.debug("List is in white mode");
      return shouldWhiteListLike(in_list, mode_should_like);
    } else if (this.options.type_list === "black") {
      log.debug("List is in black mode");
      return shouldBlackListLike(in_list, mode_should_like);
    } else {
      log.error("Unknow list type for liker")
    }
}

function shouldWhiteListLike(in_list, mode_should_like) {
  // in whitelist mode if creator is in list it should like
  list_should_like = in_list;
  log.debug(`Whitelist should like: ${list_should_like}`);
  return list_should_like || mode_should_like;
}

function shouldBlackListLike(in_list, mode_should_like) {
  // in blacklist mode if create if is in list it should NOT like
  list_should_like = !in_list;
  log.debug(`Blacklist should like: ${list_should_like}`);
  return list_should_like;
}