const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
};

export const generateId = function () {
  return Math.floor(Math.random() * 10000);
};

export const offset = function (target) {
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

export const scroll = function () {
  if (window.pageYOffset != null) {
    return {
      left: window.pageXOffset,
      top: window.pageYOffset
    }
  } else if (document.compatMode == 'CSS1Compat') {
    return {
      left: document.documentElement.scrollLeft,
      top: document.documentElement.scrollTop
    }
  }
  return {
    left: document.body.scrollLeft,
    top: document.body.scrollTop
  }
}

export const clone = function (obj) {
  var o = obj instanceof Array ? [] : {};
  for (var k in obj) {
    o[k] = obj[k];
  }
  return o;
}

export const debounce = function (delay, atBegin, callback) {
	return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
}

export const throttle = function ( delay, noTrailing, callback, debounceMode ) {
	var timeoutID;
	var cancelled = false;
  var lastExec = 0;
  
	function clearExistingTimeout () {
		if ( timeoutID ) {
			clearTimeout(timeoutID);
		}
	}

	// Function to cancel next exec
	function cancel () {
		clearExistingTimeout();
		cancelled = true;
	}

	// `noTrailing` defaults to falsy.
	if ( typeof noTrailing !== 'boolean' ) {
		debounceMode = callback;
		callback = noTrailing;
		noTrailing = undefined;
  }
  
	function wrapper () {

		var self = this;
		var elapsed = Date.now() - lastExec;
		var args = arguments;

		if (cancelled) {
			return;
		}

		function exec () {
			lastExec = Date.now();
			callback.apply(self, args);
		}

		function clear () {
			timeoutID = undefined;
		}

		if ( debounceMode && !timeoutID ) {
			exec();
		}

		clearExistingTimeout();

		if ( debounceMode === undefined && elapsed > delay ) {
			exec();
		} else if ( noTrailing !== true ) {
			timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
		}
	}

	wrapper.cancel = cancel;
	return wrapper;
}