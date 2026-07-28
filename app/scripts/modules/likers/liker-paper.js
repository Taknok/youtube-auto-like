/*
 * Likes YouTube videos.
 * For the newer paper design layout
 */
class PaperLiker extends MetaLiker {

	VIDEO_SELECTOR = ".video-stream";
	ACTION_ELEMENTS_SELECTOR = "ytd-menu-renderer.ytd-watch-metadata segmented-like-dislike-button-view-model";
	LIKE_DATA_SELECTOR = "like-button-view-model toggle-button-view-model";
	LIKE_SELECTOR = this.LIKE_DATA_SELECTOR + " button";
	DISLIKE_DATA_SELECTOR = this.LIKE_DATA_SELECTOR;
	LIVE_SELECTOR = ".ytp-live-badge[disabled='']";

	/*
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		let subscribeButtons = document.querySelectorAll("ytd-subscribe-button-renderer")
		let buttonExist = subscribeButtons.length > 0
		log("sub button exist: ", buttonExist, subscribeButtons)
		if (!buttonExist) return false

		let subscribeButton = subscribeButtons[0]
		return subscribeButton.wrappedJSObject.data.subscribed
	}
}
