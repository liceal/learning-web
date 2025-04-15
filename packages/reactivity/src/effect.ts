export function effect(fn, options?) {
  // 创建响应式effect 数据变化后可以重写执行

  // 创建一个effect，只要依赖的熟悉变化了就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run(); // 重新执行fn
  });
  _effect.run();
}

export let activeEffect;

function preCleanEffect(effect) {
  effect._depsLength = 0; // 清除上一次的依赖情况
  effect._trackId++; // 让trackId自增，表示当前effect执行了几次
}

function postCleanEffect(effect) {
  //[flag,age,xxx...] > [flag]
  // 让effect和dep进行关联
  if (effect.deps.length > effect._depsLength) {
    for (let i = effect._depsLength; i < effect.deps.length; i++) {
      const dep = effect.deps[i];
      cleanDepEffect(dep, effect); // 删除当前的effect
    }
    effect.deps.length = effect._depsLength; // 更新依赖长度
  }
}

function cleanDepEffect(dep, effect) {
  // 删除当前的effect
  dep.delete(effect);
  // 如果没有依赖了，则清除deps
  if (dep.size === 0) {
    dep.cleanup(); // 如果已经清空了 会在depsMap里面删除自己
  }
}
class ReactiveEffect {
  _trackId = 0; //用于记录当前effect执行了几次
  deps = []; // 用来存储当前effect依赖的属性
  _depsLength = 0; // 用来存储当前effect依赖的属性的长度

  public active = true; //创建的effect是响应式的
  // fn用户编写的函数
  // 如果fn中依赖的数据发生变化后，需要重新调用->run()
  constructor(public fn, public scheduler) {}
  run() {
    // 让fn执行
    if (!this.active) {
      return this.fn();
    }
    let lastEffect = activeEffect; // 记录上一个effect
    try {
      activeEffect = this;
      // effect重新执行前，需要清除上一次的依赖情况
      preCleanEffect(this);

      return this.fn();
    } finally {
      postCleanEffect(this); // 清除上一次的依赖情况
      activeEffect = lastEffect; // 还原上一个effect
    }
  }
}

export function trackEffect(effect, dep) {
  dep.set(effect, effect._trackId);
  // 让effect和dep进行关联
  // effect.deps[effect._depsLength++] = dep;

  // 如果是同一个则不增加
  if (dep.get(effect) !== effect._trackId) {
    dep.set(effect, effect._trackId); // 让dep和effect进行关联
    let oldDep = effect.deps[effect._depsLength]; // 取出上一次的dep
    // 如果没有存过
    if (oldDep !== dep) {
      if (oldDep) {
        // 删掉老的
        cleanDepEffect(oldDep, effect);
      }
      // 换成新的
      effect.deps[effect._depsLength++] = dep; // 让effect和dep进行关联
    } else {
      effect._depsLength++;
    }
  }

  // console.log(effect, dep);
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler(); // 重新执行fn
    }
  }
}
