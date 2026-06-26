/*
 * Likes YouTube videos.
 * For the newer paper design layout
 */
class GridLiker extends MetaLiker {

	VIDEO_SELECTOR = ".video-stream";
	ACTION_ELEMENTS_SELECTOR = "#secondary-inner ytd-watch-metadata ytd-menu-renderer segmented-like-dislike-button-view-model";
	LIKE_SELECTOR = "like-button-view-model button";
	DISLIKE_SELECTOR = "dislike-button-view-model button";
	LIVE_SELECTOR = ".ytp-live-badge[disabled='']";

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
		let subscribeButtons = document.querySelectorAll("ytd-subscribe-button-renderer :not(*[hidden]) button.yt-spec-button-shape-next--tonal")
		let buttonExist = subscribeButtons.length > 0
		log("sub button exist: ", buttonExist)
		if (!buttonExist) return false

		let subscribeButton = Array.from(subscribeButtons).find(isVisible)
		log("sub button not hidden: ", subscribeButton)
		return subscribeButton !== undefined;
	}
}
