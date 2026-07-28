// We need to know which version of YouTube we're dealing with
// The material version has no ID on the body, hence this dumb check
//cannot use hostname, using regex to force starting with
const IS_TV = window.location.pathname === '/tv';
const IS_CLASSIC = (window.location.hostname === 'www.youtube.com') && !IS_TV;

// Create an OptionManager
let optionManager = new OptionManager(OPTIONS);

// init de log function
var log = () => {}

// page's variables that will be retreived (10s fail)
var ytInitialPlayerResponse = undefined;
var ytInitialData = undefined;
window.currentLiker = null;

// Add a listener to get the creator
browser.runtime.onMessage.addListener( function(msg, sender, sendResponse) {
	log("New message received");
	// If the received message has the expected format...
	if (msg === "get_creator_from_video") {
		let creator = getCreatorFromVideo();
		log("Sending response", creator);
		sendResponse(creator);
	} else if (msg == "get_creator_from_home") {
		let creator = getCreatorFromHome();
		log("Sending response", creator);
		sendResponse(creator);
	}
});

getVariableFromPage("ytInitialPlayerResponse")
	.then((value) => {
		log("Got variable:", value);
		ytInitialPlayerResponse = value;
	})
	.catch((err) => {
		console.warn(err);
	});

getVariableFromPage("ytInitialData")
	.then((value) => {
		log("Got variable:", value);
		ytInitialData = value;
	})
	.catch((err) => {
		console.warn(err);
	});

function isVideoPage() {
	var IS_SHORT = location.pathname.startsWith("/shorts");
	var IS_WATCH = location.pathname.startsWith("/watch");
	return (IS_SHORT || IS_WATCH);
}

function isInViewport(element) {
	const rect = element.getBoundingClientRect();
	const height = innerHeight || document.documentElement.clientHeight;
	const width = innerWidth || document.documentElement.clientWidth;
	return (
		// When short (channel) is ignored, the element (like/dislike AND short itself) is
		// hidden with a 0 DOMRect. In this case, consider it outside of Viewport
		!(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) &&
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= height &&
		rect.right <= width
	);
}

function isVisible(elem) {
	if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');

	if (!isInViewport) return false;

	const style = getComputedStyle(elem);
	if (style.display === 'none') return false;
	if (style.visibility !== 'visible') return false;
	if (style.opacity < 0.1) return false;
	if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
		elem.getBoundingClientRect().width === 0) {
		return false;
	}
	const elemCenter   = {
		x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
		y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
	};
	if (elemCenter.x < 0) return false;
	if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
	if (elemCenter.y < 0) return false;
	if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
	let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
	do {
		if (pointContainer === elem) return true;
	} while (pointContainer = pointContainer.parentNode);
	return false;
}

function startLikerProcess(options) {
	log("Starting liker process");
	var IS_PAPER = document.querySelector("ytd-subscribe-button-renderer") !== null;
	var IS_SHORT = location.pathname.startsWith("/shorts");
	window.IS_PAPER = IS_PAPER;
	window.IS_SHORT = IS_SHORT;

	let liker = null;
	if (IS_SHORT) {
		log("short liker init");
		liker = new ShortLiker(options);
	} else {
		if (IS_PAPER) {
			log("paper liker init");
			liker = new PaperLiker(options);
		}
	}

	if (IS_CLASSIC) {
		log("Classic youtube detected");
		liker.init();
	} else {
		log("YAL: Other youtube are not supported");
	}

	window.currentLiker = liker;
}

function getVideoId(url) {
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

function isVideoLoaded() {
	const videoId = getVideoId(window.location.href);
	if (
		document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) ||
		document.querySelector('#player[loading="false"]:not([hidden])') ||
		document.querySelector(`ytd-watch-grid[video-id='${videoId}']`)
	) {
		return true;
	}

	let shortVideo = document.querySelector("#shorts-player video");
	return shortVideo instanceof Element && isVisible(shortVideo);
}

// Fetch our options then fire things up
optionManager.get().then((options) => {
	// set the real log function once options are loaded
	log = options.debug ? console.log.bind(console, "yal :") : () => {};
	log(`youtube auto like ${options.plugin_version} injected`);
	let jsInitChecktimer = null;

	function setEventListeners(evt) {
		function checkForJS_Finish() {
			log("Checking if video is loaded");
			if ( isVideoLoaded() ) {
				log("Video is loaded, starting liker process");
				startLikerProcess(options);
				// getBrowser().storage.onChanged.addListener(storageChangeHandler);
				clearInterval(jsInitChecktimer);
				jsInitChecktimer = null;
			} else {
				log("Video is not loaded yet");
			}
		}

		jsInitChecktimer = setInterval(checkForJS_Finish, 1000);
	}

	document.addEventListener("yt-navigate-finish", function (event) {
		log("yt-navigate-finish event detected");
		if (jsInitChecktimer !== null) clearInterval(jsInitChecktimer);
		if (window.currentLiker) {
			window.currentLiker.destroy();
			window.currentLiker = null;
		}
		if (isVideoPage()) {
			setEventListeners();
		} else {
			log("Not a video page");
		}
	});
});
