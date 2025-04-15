import { activeEffect, trackEffect, triggerEffects } from "./effect";

const targetMap = new WeakMap(); // 用来存储依赖的map

export const createDep = (cleanup, key) => {
  const dep = new Map() as any;
  dep.celanup = cleanup;
  dep.name = key;
  return dep;
};

export function track(target, key) {
  if (activeEffect) {
    // console.log(activeEffect, target, key);
    let depsMap = targetMap.get(target); // 获取当前对象的依赖
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map())); // 如果没有则创建一个map
    }
    let dep = depsMap.get(key); // 获取当前对象的key对应的依赖
    if (!dep) {
      depsMap.set(
        key,
        (dep = createDep(() => depsMap.delete(key), key)) // 如果没有则创建一个dep
      ); // 如果没有则创建一个set
    }

    trackEffect(activeEffect, dep); // 让当前的effect和dep进行关联

    // console.log(targetMap);
  }
}

export function trigger(target, key, value, oldValue) {
  const depsMap = targetMap.get(target); // 获取当前对象的依赖
  if (!depsMap) {
    // 如果没有依赖则直接返回
    return;
  }
  const dep = depsMap.get(key); // 获取当前对象的key对应的依赖
  if (dep) {
    // 触发依赖
    triggerEffects(dep);
  }
}
