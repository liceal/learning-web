// 这里打包packages下的模块 打包成js文件


// node dev.js 目标文件夹 -f 打包的格式

import minimist from "minimist";
import { createRequire } from "module";
import { dirname, resolve } from 'path'
import { fileURLToPath } from "url";
import esbuild from "esbuild";

// node中的命令行参数  [目标文件夹 -f 打包的格式] > argv
const args = minimist(process.argv.slice(2));


// esm 使用commonjs变量
const __filename = fileURLToPath(import.meta.url); // 获取当前文件的路径 file > /usr
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url); // 兼容node的require方法

// console.log('文件路径', __filename, __dirname, require); // /usr/src/app/scripts/dev.js /usr/src/app/scripts


/*
node scripts/dev.js reactivity -f esm
转成下面这个
{ _: [ 'reactivity' ], f: 'esm' }
*/
console.log(args); //获取命令参数

const target = args._[0] || 'reactivity'; // 目标文件夹
const format = args.f || 'iife'; // 打包的格式 iife > (function(){})()

// 打包目标入口
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`); // /usr/src/app/packages/reactivity/src/index.js
const pkg = require(`../packages/${target}/package.json`); // 获取package.json文件

// 使用esbuild打包
esbuild.context({
  entryPoints: [entry], //入口文件
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`), // 打包后的文件
  bundle: true, // 打包成一个文件
  platform: "browser", // 打包成浏览器可用的文件
  sourcemap: true, // 生成源文件映射
  format, // 打包的格式
  globalName: pkg.buildOptions?.name, // 全局变量的名称
}).then((context) => {
  console.log('打包完成', context); // 打包完成
  return context.watch(); // 监听文件变化
})

