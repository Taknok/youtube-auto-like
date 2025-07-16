function getVariableFromPage(varName, timeout = 10000) {
	return new Promise((resolve, reject) => {
		const id = `getVar_${varName}_${Date.now()}`;

		// Listen for the response
		function handleMessage(event) {
			if (event.source !== window) return;
			if (event.data?.type === 'VAR_RESPONSE' && event.data.id === id) {
				window.removeEventListener('message', handleMessage);
				resolve(event.data.value);
			}
		}

		window.addEventListener('message', handleMessage);

		// Inject a script to retrieve the variable
		const script = document.createElement('script');
		script.textContent = `
			(function() {
				try {
					const value = window["${varName}"];
					window.postMessage({ type: 'VAR_RESPONSE', id: "${id}", value }, '*');
				} catch (e) {
					window.postMessage({ type: 'VAR_RESPONSE', id: "${id}", value: null }, '*');
				}
			})();
		`;
		(document.head || document.documentElement).appendChild(script);
		script.remove();

		// Timeout
		setTimeout(() => {
			window.removeEventListener('message', handleMessage);
			reject(new Error(`Variable "\${varName}" not found within timeout`));
		}, timeout);
	});
}

async function saveCreator(creator) {
	console.log("Saving this creator")
	console.log("Retrieving saved creators")
	return new Promise((resolve, reject) => {
		optionManager.get().then((options) => {
			let array = options["creator_list"];
			console.log("Actual creator list", array)
			if (!array.find(o => o.URL === creator.URL )) {  //compare only with URL, creator may change their name
				array.push(creator)
				console.log("Saving the updated creator list", array)
				optionManager.set( options ).then( () => resolve() )
			} else {
				console.log("Creator already exist")
			}
		});
	});
}

function removeCreator(creator) {
	console.log("removeCreator called")
	console.log(creator)
	return new Promise((resolve, reject) => {
		optionManager.get().then((options) => {
			let array = options["creator_list"];
			for (var i = 0; i < array.length; i++) {
				console.log(array[i])
				if (areCreatorsEquals(array[i], creator)) {
					console.log("Creator found")
					array.splice(i, 1)
					console.log(array)
					optionManager.set( options ).then( () => resolve() )
					return
				} else {
					console.log("Creator are not equals")
				}
			}
		});
	});
}

function areCreatorsEquals(x, y) {
	console.log("Starting comparaison for ", x, y)
	// If the property are not present, return false
	if (!x.hasOwnProperty("name") || !y.hasOwnProperty("name")) {
		console.log("No prop 'name'")
		return false;
	}
	if (!x.hasOwnProperty("URL") || !y.hasOwnProperty("URL")) {
		console.log("No prop 'URL'")
		return false;
	}

	// If properties are not equal, return false
	if (x.name !== y.name) {
		console.log("name is different");
		return false;
	}
	if (x.URL !== y.URL) {
		console.log("URL is different");
		return false;
	}

	console.log("Creator are equals")
	return true; 
}

function getCreatorFromVideo() {
	let videoDetails = ytInitialPlayerResponse?.videoDetails;
	let name = videoDetails?.author;
	let URL = `https://www.youtube.com/channel/${videoDetails?.channelId}`;
	return {name, URL};
}

function getCreatorFromHome() {
	let channelDetails = ytInitialData?.metadata?.channelMetadataRenderer;
	let name = channelDetails?.title;
	let URL = channelDetails?.channelUrl;
	return {name, URL};
}

async function isInList(creator) {
	console.log("Checking if creator is in list", creator)
	let options = await optionManager.get();
	let in_list = false;
	let creator_list = options.creator_list;
	for (var i = 0; i < creator_list.length; i++) {
		if (areCreatorsEquals(creator_list[i], creator)) {
			in_list = true;
			break;
		}
	}
	console.log("isInList return", in_list)
	return in_list;
}

function isHidden(node) {
	// if reach root html
	if (node === document) return false;

	if (node.hasAttribute("hidden") || node.hasAttribute("invisible")) {
		return true;
	} else {
		return isHidden(node.parentNode);
	}
}

function isNotHidden(node) {
	return !isHidden(node);
}

/**
 * @summary A error thrown when a method is defined but not implemented (yet).
 * @param {any} message An additional message for the error.
 */
function NotImplementedError(message) {
	/// <summary>The error thrown when the given function isn't implemented.</summary>
	const sender = (new Error())
		.stack
		.split('\n')[2]
		.replace(' at ', '');
	this.message = `The method ${sender} isn't implemented.`;

	// Append the message if given.
	if (message) { this.message += ` Message: "${message}".`; }

	let str = this.message;

	while (str.indexOf('  ') > -1) {
		str = str.replace('  ', ' ');
	}

	this.message = str;
}
