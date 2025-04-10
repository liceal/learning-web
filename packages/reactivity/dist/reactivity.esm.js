// packages/reactivity/src/effect.ts
function effect() {
}

// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
var mutableHandlers = {
  get(target, key, recevier) {
  },
  set(target, key, value, recevier) {
    if (target[key] === value) {
      return true;
    }
    target[key] = value;
    return true;
  }
};
function reactive(target) {
  return createReactiveObject(target);
}
function createReactiveObject(target) {
  if (isObject(target)) {
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
export {
  effect,
  reactive
};
//# sourceMappingURL=reactivity.esm.js.map
