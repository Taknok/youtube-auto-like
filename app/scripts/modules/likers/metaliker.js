/*
 * Likes YouTube videos.
 * For the newer paper design layout
 */
class MetaLiker {
	/*
	 * @constructor
	 * @param {OptionManager} options Object that must have the option 
	 *     'like_what', indicating whether to like all videos or just 
	 *      subscribed.
	 */
	constructor(options) {
		this.options = options;
		this._isDestroyed = false;
		this._timers = new Set();
	}

	_VIDEO = null;

	destroy() {
		this._isDestroyed = true;
		for (const timer of this._timers) {
			clearTimeout(timer);
		}
		this._timers.clear();
		this.IS_STARTED = false;
		log("destroying liker 0");
	}

	scheduleTimeout(callback, delay) {
		if (this._isDestroyed) {
			log("destroying liker 1")
			return null;
		}
		const timer = setTimeout(() => {
			this._timers.delete(timer);
			if (this._isDestroyed) {
				log("destroying liker 2")
				return;
			}
			callback();
		}, delay);
		this._timers.add(timer);
		return timer;
	}

	async update_options() {
		this.options = await optionManager.get();
		log("options updated");
		return;
	}

	VIDEO_SELECTOR = null;
	ACTION_ELEMENTS_SELECTOR = null;
	LIKE_DATA_SELECTOR = null;
	LIKE_SELECTOR = null;
	DISLIKE_DATA_SELECTOR = null;
	LIVE_SELECTOR = null;

	/**
	 * Search video across all dom each time, to prevent modification (see #59)
	 * A mutation observer could be done, but may be overkill
	 * @Return: the video element
	 */
	video() {
		if (this.VIDEO_SELECTOR === null) {
			NotImplementedError();
		}
		// cache video element to prevent multiple search,
		//  prevent losing video when buffering
		if (this._VIDEO !== null) {
			return this._VIDEO;
		}
		for (let video of document.querySelectorAll(this.VIDEO_SELECTOR)) {
			if (isVisible(video)) {
				this._VIDEO = video;
				return video;
			}
		}
		return null;
	}

	getActionsElements() {
		if (this.ACTION_ELEMENTS_SELECTOR === null) {
			NotImplementedError();
		}
		return document.querySelector(this.ACTION_ELEMENTS_SELECTOR);
	}

	/**
     * @param {block} actionsElements The actionElements block containing like and dislike buttons
     * @return {array} [likeElement, dislikeElement] The two clickable buttons
	 */
	getLikeDislikeElements(actionsElements) {
		let likeElement, dislikeElement;

		if (this.LIKE_DATA_SELECTOR === null || this.DISLIKE_DATA_SELECTOR === null) {
			NotImplementedError
		}
		
		likeElement = actionsElements.querySelector(this.LIKE_DATA_SELECTOR);
		dislikeElement = actionsElements.querySelector(this.DISLIKE_DATA_SELECTOR);

		return [likeElement, dislikeElement];
	}

	isLive() {
		if (this.LIVE_SELECTOR === null) {
			NotImplementedError();
		}
		return document.querySelector(this.LIVE_SELECTOR);
	}

	/*
	 * Another tough one
	 * @return {Boolean} True if the user is subscribed to
	 *                   the current video's channel
	 */
	isUserSubscribed() {
		NotImplementedError();
	}

	async waitFor(predicate) {
		let value;

		while (!(value = predicate())) {
			await new Promise(resolve => requestAnimationFrame(resolve));
		}

		return value;
	}

	async getButtons() {
		const box = this.getActionsElements();

		const [likeElement, dislikeElement] = await this.waitFor(() => {
			const [like, dislike] = this.getLikeDislikeElements(box);

			if (!like.wrappedJSObject?.data || !dislike.wrappedJSObject?.data) {
				return null;
			}

			return [like, dislike];
		});

		log("got buttons");
		return [likeElement, dislikeElement];
	}

	isVideoRated(like, dislike) {
		return like.wrappedJSObject.data.isToggled || dislike.wrappedJSObject.data.isToggled;
	}

	/**
	 * Detects when like/dislike buttons have loaded (so we can press them)
	 * and register element in the attributes
	 * @param {function} callback The function to execute after the buttons
	 *     have loaded
	 */
	async waitForButtons() {
		while (!(this.getActionsElements())) {
			log("wait 1s for box");
			await new Promise(resolve => this.scheduleTimeout(resolve, 1000));
		}
	}

	/**
	* Detects when the video player has loaded
	* @param  {function} callback The function to execute once the video has
	*     loaded.
	*/
	async waitForVideo() {
		while (!this.video()) {
			await new Promise(resolve => this.scheduleTimeout(resolve, 1000));
		}
		
		log("Get Video:", this.video());

		if (this.isLive()) {
			log("Video is live");
			this.liveStartedAt = this.video().currentTime;
			log("Start watching live at", this.liveStartedAt);
		}
	}

	/**
	 * Return a random integer in a given range
	 * @param {number} min An integer representing the start of the range
	 * @param {number} max An integer representing the end of the range
	 * @return {number} The random integer selected in the range
	 */
	randomIntFromInterval(min, max) { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	/**
	 * Wait the number of minutes or % specified by user in the plugin option
	 */
	async waitTimer() {
		while (true) {
			// Instant like
			if (this.options.like_timer === "instant") {
				log("waitTimer: instant");
				return;
			}

			// Wait until ads are over
			if (this.video().closest(".ad-showing,.ad-interrupting") !== null) {
				log("waitTimer: ad");
				await new Promise(resolve => this.scheduleTimeout(resolve, 1000));
				continue;
			}

			let percentAtLike = Infinity;
			let timeAtLikePercent = Infinity;
			let timeAtLikeMinute = Infinity;
			
			if (this.options.like_timer === "random") {
				log("waitTimer: random");
				percentAtLike = this.randomTimerPercent;
			}
			if (this.options.like_timer === "percentage" && !this.isLive()) {
				log("waitTimer: percent");
				percentAtLike = this.options.percentage_value;
			}
			if (this.options.minute_timer) {
				log("waitTimer: minute");
				timeAtLikeMinute = this.options.minute_value * 60;
			}

			const duration = this.video().duration;
			const currentT = this.isLive()
				? this.video().currentTime - this.liveStartedAt
				: this.video().currentTime;

			timeAtLikePercent = duration * percentAtLike / 100;

			let timeAtLike = Math.min(timeAtLikePercent, timeAtLikeMinute);

			// If the video is shorter than the configured delay,
			// like it 2 seconds before the end.
			if (duration <= timeAtLike) {
				timeAtLike = duration - 2;
			}

			log(currentT, duration, timeAtLike);

			if (currentT >= timeAtLike) {
				return;
			}

			await new Promise(resolve => this.scheduleTimeout(resolve, 1000));
		}
}

	/**
	 * Take a wild guess
	 * @return {Boolean} True if the like or dislike button is active
	 */
	async isVideoRatedMeta() {
		log("checking if video is rated");
		let [like, dislike] = await this.getButtons();
		log([like, dislike]);
		let isRated = this.isVideoRated(like, dislike);
		log("is rated: ", isRated);
		return isRated;
	}

	async shouldLike() {
		let rated = await this.isVideoRatedMeta();
		if (rated) {
			log("Not like: already liked video");
			return false;
		}

		let mode_should_like = false;
		if (this.options.like_what === "subscribed") {
			log("Sub mode");
			mode_should_like = this.isUserSubscribed();	
		} else { // it all mode
			log("All mode");
			mode_should_like = true;
		}
		
		log("Use list:", this.options.use_list);
		if (this.options.use_list) {
			let list_should_like = "";
			let creator = getCreatorFromVideo();
			let creator_list = this.options.creator_list;
			let in_list = false;
			for (var i = 0; i < creator_list.length; i++) {
				if ( creator_list[i].URL === creator.URL ) {
					log("Creator is in list");
					in_list = true;
					break;
				}
			}

			if (this.options.type_list === "white") {
				log("List is in white mode")
				list_should_like = in_list;
				// in white list only the list matter
				let should_like = list_should_like;
				log(`Should like: ${should_like}`);
				return should_like;
			} else if (this.options.type_list === "black") {
				log("List is in black mode")
				list_should_like = !in_list;

				let should_like = list_should_like && mode_should_like;
				log(`Should like: ${should_like}`);
				return should_like;
			} else {
				console.error("Unknow list type for liker")
			}
		} else {
			log(`Should like: ${mode_should_like}`)
			return mode_should_like;
		}
	}

	/*
	 * Clickity click the button
	 */
	attemptLike() {
		if (this.LIKE_SELECTOR === null) {
			NotImplementedError();
		}
		let box = this.getActionsElements();
		let btn = box.querySelector(this.LIKE_SELECTOR);
		btn.click();
	}

	/**
	 * Prevent multiple run if the listen event is triggered multiples times
	 */
	blockMultipleRun() {
		//if not defined this is the 1st run
		if (!this.hasOwnProperty("IS_STARTED")) { 
			this.IS_STARTED = true;
			log("blockMultipleRun: allow")
			return false;
		} else {
			if (this.IS_STARTED) {
				log("blockMultipleRun: blocked");
				return true
			} else { //could be a new video in playlist
				this.IS_STARTED = true;
				log("blockMultipleRun: allow, next video in playlist")
				return false;
			}
		}
	}

	/**
	 * Free the block to reset the multipleRun
	 */
	finish() {
		this.IS_STARTED = false;
	}

	/**
	 * Starts the liking.
	 * The liker won't do anything unless this method is called.
	 */
	async init() {
		if (this.options.like_what === "none") {
			log("yt-autolike disabled")
			return;
		}

		// function isVideo() {
		// 	return window.location.href.indexOf("watch") > -1
		// }
		// if (!isVideo()) {
		// 	log("not a video");
		// 	return;
		// }

		if (this.blockMultipleRun()) {
			return;
		}
		log('yt-autolike start')

		await this.update_options();

		await this.waitForVideo();
		await this.waitForButtons();
		

		/*
		If the video is already liked/disliked
		or the user isn't subscribed to this channel,
		then we don't need to do anything.
			*/
		if ( !await this.shouldLike() ) {
			log("not liked check 1");
			this.finish();
			return;
		}
		/*
		Else do the stuff
		*/
		// Define a random timer if selected
		if (this.options.like_timer == "random") {
			this.randomTimerPercent = this.randomIntFromInterval(0, 99);
		}
				
		await this.waitTimer();

		/*
		Maybe the use did an action while we was waiting, so check again
		*/
		if ( !await this.shouldLike() ) {
			log("not liked check 2");
			this.finish();
			return;
		}
		this.attemptLike();
		log('liked');
		this.options.counter += 1;
		optionManager.set(this.options).then(() => {
			this.finish();							
		});
	}
}
