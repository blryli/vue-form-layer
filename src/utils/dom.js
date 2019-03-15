import Vue from 'vue';

const isServer = Vue.prototype.$isServer;

// 用来绑定事件的方法，它是一个自执行的函数，会根据是否运行于服务器和是否支持addEventListener来返回一个function
export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, function (e) {
          handler(e)
        }, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, function (e) {
          handler(e)
        })
      }
    }
  }
})()

// 解除绑定事件
export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

export const removeBody = function (self, ref) {
  if (self.$refs[ref] && self.$refs[ref].$el && self.$refs[ref].$el.parentNode === document.body) {
    document.body.removeChild(self.$refs[ref].$el);
  } else if (self.$refs[ref] && self.$refs[ref].parentNode === document.body) {
    document.body.removeChild(self.$refs[ref]);
  }
}

export const getParentNodes = function (parent) {
  let parentNodes = [window];
  while (parent !== document.body) {
    parentNodes.push(parent);
    parent = parent.parentNode;
  }
  return parentNodes;
}

export const enableEventListener = function (parentNodes, handler) {
  parentNodes.forEach(p => {
    p.addEventListener('resize', handler, {
      passive: true
    });
    p.addEventListener('scroll', handler, {
      passive: true
    });
  })
};

export const removeEventListener = function (parentNodes, handler) {
  parentNodes.forEach(p => {
    p.removeEventListener('resize', handler);
    p.removeEventListener('scroll', handler);
  })
};
