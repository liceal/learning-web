// packages/reactivity/src/effect.ts
function effect() {
}

// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}

// packages/reactivity/src/baseHandler.ts
var mutableHandlers = {
  get(target, key, recevier) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    return Reflect.get(target, key, recevier);
  },
  set(target, key, value, recevier) {
    return Reflect.set(target, key, value, recevier);
  }
};

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function createReactiveObject(target) {
  if (isObject(target)) {
    return target;
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    return target;
  }
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) {
    return exitsProxy;
  }
  let proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}
function reactive(target) {
  return createReactiveObject(target);
}
export {
  effect,
  reactive
};
//# sourceMappingURL=reactivity.esm.js.map
