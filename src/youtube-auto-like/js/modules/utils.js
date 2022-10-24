/**
 * Return a random integer in a given range
 * @param {number} min An integer representing the start of the range
 * @param {number} max An integer representing the end of the range
 * @return {number} The random integer selected in the range
 */
export function randomIntFromInterval(min, max) { //min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isInViewport(element) {
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

export function isVisible(elem) {
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
  let creatorBlock = document.querySelector("#container.ytd-video-secondary-info-renderer");
  let name = creatorBlock.querySelector("yt-formatted-string.ytd-channel-name>a").textContent;
  let URL = creatorBlock.querySelector("yt-formatted-string.ytd-channel-name>a").href;
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
