import { activeEffect } from "./effect";
import { track, trigger } from "./reactiveEffect";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, recevier) {
    // 如果是原型上的属性，则直接返回
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }

    // 依赖收集 取值的时候，让响应式属性和effect映射起来
    track(target, key);
    // console.log(activeEffect, key);

    // 使用Reflect 第三个参数重写指向this位置 避免重复触发当前的get
    return Reflect.get(target, key, recevier);
  },
  set(target, key, value, recevier) {
    // 找到属性 让对应的effect去执行
    let oldValue = target[key];

    let result = Reflect.set(target, key, value, recevier); // 设置值
    if (oldValue !== value) {
      // 触发页面更新
      trigger(target, key, value, oldValue);
    }

    return result;
  },
};
