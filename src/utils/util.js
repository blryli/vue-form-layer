export const generateId = function () {
  return Math.floor(Math.random() * 10000);
};

export const EventListener = function(target, eventType, callback) {
  if (target.addEventListener) {
    target.addEventListener(eventType, function(e) { callback(e) }, false);
    return {
      remove() {
        target.removeEventListener(eventType, function(e) { callback(e) }, false);
      }
    };
  } else if (target.attachEvent) {
    target.attachEvent('on' + eventType, function(e) { callback(e) });
    return {
      remove() {
        target.detachEvent('on' + eventType, function(e) { callback(e) });
      }
    };
  }
}

export const offset = function(target) {
  if (!target || !target.offsetParent) return false;
  let top = 0;
  let left = 0;
  while (target.offsetParent) {
    top += target.offsetTop;
    left += target.offsetLeft;
    target = target.offsetParent;
  }
  return {
    top: top,
    left: left
  };
}