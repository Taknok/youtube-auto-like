console.log("-----------------------------------------------------------------");
//---   Import Button Functions   ---//
import {
  getButtons,
} from "./modules/buttons.js";

//---   Import State Functions   ---//
import {
  isShorts,
  getButtons,
  setInitialState,
} from "./modules/states";

// //---   Import Video & Browser Functions   ---//
// import {
//   isVideoLoaded,
// } from "./modules/utils";

// //---   Import Event Functions   ---//
// import {
//   addLikeDislikeEventListener,
// } from "./src/events";

// //---   Import Liker Functions   ---//
// import {
//   startLikerProcess,
// } from "./src/liker";

// let jsInitChecktimer = null;

// function setEventListeners(evt) {
//   function checkForJS_Finish() {
//     if (isShorts() || (getButtons()?.offsetParent && isVideoLoaded())) {
//       startLikerProcess();
//       // setInitialState();
//       // getBrowser().storage.onChanged.addListener(storageChangeHandler);
//       clearInterval(jsInitChecktimer);
//       jsInitChecktimer = null;
//     }
//   }

//   jsInitChecktimer = setInterval(checkForJS_Finish, 1000);
// }

// setEventListeners();

// document.addEventListener("yt-navigate-finish", function (event) {
//   if (jsInitChecktimer !== null) clearInterval(jsInitChecktimer);
//   window.returnLikerProcessSet = false;
//   setEventListeners();
// });


export function main() {
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
}
