/*
 * Likes YouTube videos.
 * For the newer paper design layout
 */
class ShortLiker extends MetaLiker {

	VIDEO_SELECTOR = ".video-stream";
	ACTION_ELEMENTS_SELECTOR = "reel-action-bar-view-model";
	LIKE_DATA_SELECTOR = "ytd-reel-player-overlay-renderer toggle-button-view-model";
	LIKE_SELECTOR = this.LIKE_DATA_SELECTOR + " button";
	DISLIKE_DATA_SELECTOR = this.LIKE_DATA_SELECTOR; // there is no dislike button on shorts
	LIVE_SELECTOR = ".ytp-live-badge[disabled='']"; // not sure if it works on shorts

	/*
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		let renderer = document.querySelector("ytd-reel-player-overlay-renderer")
		let subscribeButton = document.querySelector("yt-subscribe-button-view-model")

		// if not button is generated, the user is subscribed
		if (subscribeButton === null) {
			log("sub button does not exist, user is subscribed");
			return true;
		}

		// if user just subscribed, the button is generated but with a tonal style, if not subscribed the button is generated with a filled style
		let isTonal = subscribeButton.querySelector("button.ytSpecButtonShapeNextTonal") !== null
		log("sub button is tonal: ", isTonal)
		return isTonal;
	}
}
