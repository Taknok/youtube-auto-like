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
