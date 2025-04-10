https://www.bilibili.com/video/BV1zBc2e4EaZ

# Monorepo

pnpm install @myvue/shared --workspace --filter @myvue/reactivity
安装@myvue/shared 包 从本地找
--filter @myvue/reactivity 安装到目标位置

pnpm-workspace.yaml

```
指定包位置在packages下
packages:
  - "packages/*"

那些包的下面也有packages.json
指定 "name": "@vue/shared" 就是他们的包名
```
