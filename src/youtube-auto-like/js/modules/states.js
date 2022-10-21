export function isMobile() {
  return location.hostname == "m.youtube.com";
}

export function isShorts() {
  return location.pathname.startsWith("/shorts");
}

