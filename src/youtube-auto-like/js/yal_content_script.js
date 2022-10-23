console.log("-----------------------------------------------------------------");
//---   Import Button Functions   ---//
import {
  getButtons,
} from "./modules/buttons.js";

//---   Import State Functions   ---//
import {
  isShorts,
  isMobile,
} from "./modules/states.js";

//---   Import Video & Browser Functions   ---//
import {
  isVideoLoaded,
} from "./modules/video.js";

//---   Import Liker Functions   ---//
import {
  startLikerProcess,
} from "./modules/liker.js";

let jsInitChecktimer = null;

function setEventListeners(evt) {
  function checkForJS_Finish() {
    if (isShorts() || (getButtons()?.offsetParent && isVideoLoaded())) {
      startLikerProcess();
      // getBrowser().storage.onChanged.addListener(storageChangeHandler);
      clearInterval(jsInitChecktimer);
      jsInitChecktimer = null;
    }
  }

  jsInitChecktimer = setInterval(checkForJS_Finish, 1000);
}

setEventListeners();

document.addEventListener("yt-navigate-finish", function (event) {
  if (jsInitChecktimer !== null) clearInterval(jsInitChecktimer);
  window.returnLikerProcessSet = false;
  setEventListeners();
});


export function main() {
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
}
