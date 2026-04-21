/*
 * Likes YouTube videos.
 * For the newer paper design layout
 */
class PaperLiker extends MetaLiker {

	VIDEO_SELECTOR = ".video-stream";
	ACTION_ELEMENTS_SELECTOR = "ytd-menu-renderer.ytd-watch-metadata segmented-like-dislike-button-view-model";
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
		let subscribeButtons = document.querySelectorAll("ytd-subscribe-button-renderer :not(*[hidden]) button.ytSpecButtonShapeNextTonal")
		// the ':not(*[hidden]) ytd-subscribe-button-renderer :not(*[hidden]) button.ytSpecButtonShapeNextTonal'
		// does not work, thus use isHidden
		let buttonExist = subscribeButtons.length > 0
		log("sub button exist: ", buttonExist)
		if (!buttonExist) return false

		let subscribeButton = Array.from(subscribeButtons).find(isNotHidden)
		log("sub button not hidden: ", subscribeButton)
		return subscribeButton !== undefined;
	}
}
