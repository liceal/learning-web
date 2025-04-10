import { isObject } from "@myvue/shared/src";

// 弱引用 如果重复创建同一个内存地址的对象，则不会创建新代理，直接返回同一个对象
const reactiveMap = new WeakMap();

const mutableHandlers = {
  get(target, key, recevier) {},
  set(target, key, value, recevier) {
    if (target[key] === value) {
      return true;
    }
    target[key] = value;
    return true;
  },
};

export function reactive(target) {
  return createReactiveObject(target);
}

function createReactiveObject(target) {
  if (isObject(target)) {
    return target;
  }
  // 如果重复创建则直接返回之前的代理对象
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) {
    return exitsProxy;
  }
  let proxy = new Proxy(target, mutableHandlers);
  //  根据对象缓存 代理后的结果
  reactiveMap.set(target, proxy);
  return proxy;
}
