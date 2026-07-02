/*
 * Likes YouTube videos.
 * For the newer paper design layout
 */
class ShortLiker extends MetaLiker {

	VIDEO_SELECTOR = ".video-stream";
	ACTION_ELEMENTS_SELECTOR = "reel-action-bar-view-model";
	LIKE_SELECTOR = "like-button-view-model button";
	DISLIKE_SELECTOR = this.LIKE_SELECTOR; // there is no dislike button on shorts
	LIVE_SELECTOR = ".ytp-live-badge[disabled='']"; // not sure if it works on shorts

	isVideoRated(like, dislike) {
		return like.attributes["aria-pressed"].nodeValue === "true" ||
			dislike.attributes["aria-pressed"].nodeValue === "true";
	}

	/*
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		let subscribeButton = document.querySelector("yt-subscribe-button-view-model")
		// the buttons is not generated if subscribed
		let buttonExist = subscribeButton !== null
		log("sub button exist: ", buttonExist)
		if (!buttonExist) return true

		// if user just subscribed, the button is generated but with a tonal style, if not subscribed the button is generated with a filled style
		let isFilled = subscribeButton.querySelector("button.ytSpecButtonShapeNextFilled") !== null
		let isTonal = subscribeButton.querySelector("button.ytSpecButtonShapeNextTonal") !== null
		log("sub button is filled: ", isFilled)
		log("sub button is tonal: ", isTonal)
		if ((!isFilled && !isTonal) || (isTonal && isFilled)) {
			log("isFilled and isTonal are both false or both true, this should not happen");
			throw "isFilled and isTonal have the same value";
		}
		return isTonal;
	}
}
