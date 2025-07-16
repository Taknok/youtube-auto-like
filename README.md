# YouTube Auto Like

## Presentation
A plugin that likes videos from channels you subscribe to, so you never forget to support your favorite content creators. No login required.

Available in the [Firefox Add-ons store](https://addons.mozilla.org/en/firefox/addon/youtube_auto_like/) 
The chrome extension is currently banned from the store ([old link](https://chrome.google.com/webstore/detail/youtube-auto-like/loodalcnddclgnfekfomcoiipiohcdim)).

## List functionality
You can restrict the addon actions to the creators of a custom list. To add a creator to your list, you need to be on a video page or the home page of a YouTube channel. Once there, the add button will appear, as shown below:

<img height="80em" alt="Image" src="https://github.com/user-attachments/assets/e6144c08-0d9c-45d1-b3d8-4ccf54e75bb3" />

Using the manage list feature, you can remove the creator from the list if necessary:

<img height="50em" alt="Image" src="https://github.com/user-attachments/assets/ce3f46d5-c367-427f-8c2e-b347803c171f" />

## Issues
You can report an issue [here](https://github.com/Taknok/youtube-auto-like/issues/new) and check the current [issues](https://github.com/Taknok/youtube-auto-like/issues).

## Internationalization

Do you know another language? _I sure don't._ Feel free to contribute with a [pull request](https://github.com/Taknok/youtube-auto-like/pulls), or grab [the JSON file](https://raw.githubusercontent.com/Taknok/youtube-auto-like/master/app/_locales/en/messages.json), translate it and [send it back to me](mailto:pg.developper.fr@gmail.com).

## Developers
The debug mode option can be displayed in the addon popup by entering the konami code while the addon popup is opened.<br>
:warning: `browser.storage.sync` can cause issues when loaded temporarily, change it by `browser.storage.local` in **scripts/option-manager.js**.<br>
[PR](https://github.com/Taknok/youtube-auto-like/pulls) are welcomed :)

## Credits
- [Austencm](https://github.com/austencm/youtube-auto-like)
- [DeadSix27](https://github.com/DeadSix27) ~ DE translation
- [JKetelaar](https://github.com/JKetelaar) ~ NL translation
- [Szmyk](https://github.com/Szmyk) ~ PL translation
- [Hultan](https://github.com/Hultan) ~ SV translation
- [C4H7Cl2O4P](https://github.com/C4H7Cl2O4P) ~ UK translation
- [Alexandre Pennetier](https://github.com/alexandre-pennetier) ~ FR translation
- [msmafra](https://github.com/msmafra) ~ PT translation
- [Plunts](https://github.com/Plunts) ~ DE translation + bug fix
- [GitMoleo](https://github.com/GitMoleo) ~ DE translation
- [Babico](https://github.com/babico) ~ TR translation
