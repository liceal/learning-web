https://www.bilibili.com/video/BV1zBc2e4EaZ

## Monorepo

### 安装到指定目录

```
pnpm install @myvue/shared --workspace --filter @myvue/reactivity
安装 `@myvue/shared` 包，这个包被pnpm-workspace.yaml指定了
--filter @myvue/reactivity 安装到目标位置
```

pnpm-workspace.yaml

```
指定包位置在packages下
packages:
  - "packages/*"

那些包的下面也有packages.json
指定 "name": "@vue/shared" 就是他们的包名
```

### 安装到根目录

pnpm install vue -w
使用 `-w`指定到当前目录
