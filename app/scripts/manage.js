'use strict'

let i18n = new I18n();
// define the new options in constants
let optionManager = new OptionManager(OPTIONS);

// Init i18n
i18n.populateText();

function setStatus(message, isError = false) {
	const status = document.getElementById('ioStatus');
	if (!status) return;
	status.textContent = message;
	status.style.color = isError ? '#d9534f' : '#4caf50';
	setTimeout(() => {
		if (status.textContent === message) {
			status.textContent = '';
		}
	}, 5000);
}

function clearCreatorTable() {
	const tbl = document.getElementById('creator_list');
	if (tbl) tbl.innerHTML = '';
}

function addCreatorRow(creator) {
	const tbl = document.getElementById('creator_list');
	if (!tbl) return;

	const tr = tbl.insertRow();

	const td_name = tr.insertCell();
	td_name.classList.add('name-box');
	td_name.textContent = creator.name;

	const td_URL = tr.insertCell();
	td_URL.classList.add('url-box');
	const a = document.createElement('a');
	a.textContent = creator.URL;
	a.href = creator.URL;
	a.target = '_blank';
	td_URL.appendChild(a);

	const td_rm = tr.insertCell();
	td_rm.classList.add('rm-box');
	const button = document.createElement('button');
	button.classList.add('box');
	button.innerHTML = "<svg class='icon-close'><use xlink:href='#icon-close'></use></svg>";
	button.name = creator.name;
	button.value = creator.URL;
	button.addEventListener('click', () => {
		removeCreator(creator).then(() => {
			tr.remove();
			setStatus('Creator removed.');
		}).catch((err) => {
			console.error(err);
			setStatus('Failed to remove creator.', true);
		});
	});
	td_rm.appendChild(button);
}

function renderCreatorList(list) {
	clearCreatorTable();
	if (!Array.isArray(list) || !list.length) {
		return;
	}
	list.forEach((creator) => {
		if (creator && creator.name && creator.URL) {
			addCreatorRow(creator);
		}
	});
}

function loadCreatorList() {
	optionManager.get().then((options) => {
		const creators = Array.isArray(options.creator_list) ? options.creator_list : [];
		renderCreatorList(creators);
	}).catch((e) => {
		console.error(e);
		setStatus('Unable to load creator list.', true);
	});
}

function downloadCreatorList() {
	optionManager.get().then((options) => {
		const creators = Array.isArray(options.creator_list) ? options.creator_list : [];
		const data = JSON.stringify(creators, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'youtube-auto-like-creators.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		setStatus('Creator list exported.');
	}).catch((e) => {
		console.error(e);
		setStatus('Export failed.', true);
	});
}

function handleImportFile(file) {
	if (!file) {
		setStatus('No file selected.', true);
		return;
	}

	const confirmed = confirm('Importing will erase the current creator list. Are you sure you want to proceed?');
	if (!confirmed) {
		setStatus('Import cancelled.');
		return;
	}

	const reader = new FileReader();
	reader.onload = (event) => {
		try {
			const parsed = JSON.parse(event.target.result);
			if (!Array.isArray(parsed)) {
				throw new Error('JSON must be an array of creators.');
			}
			parsed.forEach((item) => {
				if (!item || typeof item.name !== 'string' || typeof item.URL !== 'string') {
					throw new Error('Each creator must have name and URL string properties.');
				}
			});

			optionManager.get().then((options) => {
				options.creator_list = parsed;
				return optionManager.set(options);
			}).then(() => {
				loadCreatorList();
				setStatus('Import successful.');
			}).catch((err) => {
				console.error(err);
				setStatus('Import failed (storage error).', true);
			});
		} catch (err) {
			console.error(err);
			setStatus(`Import failed: ${err.message}`, true);
		}
	};

	reader.onerror = (err) => {
		console.error(err);
		setStatus('Import failed (file read error).', true);
	};

	reader.readAsText(file, 'UTF-8');
}

function attachImportExportEvents() {
	const exportBtn = document.getElementById('exportCreators');
	const importBtn = document.getElementById('importCreators');
	const importFile = document.getElementById('importFile');

	if (exportBtn) {
		exportBtn.addEventListener('click', downloadCreatorList);
	}

	if (importBtn && importFile) {
		importBtn.addEventListener('click', () => importFile.click());
		importFile.addEventListener('change', (event) => {
			const file = event.target.files && event.target.files[0];
			handleImportFile(file);
			event.target.value = '';
		});
	}
}

loadCreatorList();
attachImportExportEvents();
