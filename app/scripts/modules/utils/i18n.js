/*
 * Allows use of i18n message placeholders in HTML
 * Looks for Chrome's __MSG_strName__ syntax by default
 */
class I18n {
	constructor(syntax) {
		// Define default placeholder syntax
		this.msg = syntax || {
			start: '__MSG_',
			end: '__'
		};
		this.attributeNames = ['value'];
	}

	replacePlaceholders(text) {
		let result = text;
		while (result.includes(this.msg.start)) {
			let keyStart = result.indexOf(this.msg.start) + this.msg.start.length,
				key = result.substring(keyStart, result.indexOf(this.msg.end, keyStart)),
				placeholder = `${this.msg.start}${key}${this.msg.end}`,
				localized = chrome.i18n.getMessage(key);

			result = result.replace(new RegExp(placeholder, 'g'), localized);
		}
		return result;
	}

	/*
	 * Finds and replaces placeholder strings with localized text
	 */
	populateText() {
		let node;
		let walker = document.createTreeWalker(
			document.body,
			// Visit text and element nodes
			NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
			// Ignore script and style tags
			(node) => 'script style'.includes(node.tagName) ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT,
			false
		);

		while ((node = walker.nextNode())) {
			if (node.nodeType === Node.TEXT_NODE) {
				let text = node.textContent;
				let localized = this.replacePlaceholders(text);
				if (localized !== text) {
					node.textContent = localized;
				}
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				for (const attributeName of this.attributeNames) {
					if (!node.hasAttribute(attributeName)) continue;

					let attributeValue = node.getAttribute(attributeName);
					let localized = this.replacePlaceholders(attributeValue);
					if (localized !== attributeValue) {
						node.setAttribute(attributeName, localized);
						if (attributeName === 'value' && 'value' in node) {
							node.value = localized;
						}
					}
				}
			}
		}
	}
}