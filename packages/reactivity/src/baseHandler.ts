export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, recevier) {
    // 如果是原型上的属性，则直接返回
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }

    // 依赖收集

    // 使用Reflect 第三个参数重写指向this位置 避免重复触发当前的get
    return Reflect.get(target, key, recevier);
  },
  set(target, key, value, recevier) {
    // 如果内容没有改变则直接返回
    // if (target[key] === value) {
    //   return value;
    // }

    // 触发视图更新

    return Reflect.set(target, key, value, recevier);
  },
};
