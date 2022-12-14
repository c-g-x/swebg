# pnpm

> [官方文档](https://pnpm.io/zh/npmrc)

## tip1: 清除本地仓库未被引用的包

定期清理本地仓库未被引用的包，可以减少本地仓库的体积，提高安装速度。

```bash
pnpm store prune
```

```text
Removed all cached metadata files
Removed 25375 files
Removed 1038 packages
```

## tip2: 检查过期依赖

每隔一段时间关注一下当前使用的依赖是否过期，过期的依赖可能会带来安全隐患。

同时关注当前依赖是否有新版本发布，及时了解新版本的变化对项目的性能和稳定性是否有影响。

```bash
pnpm outdated --long
```

```text
┌───────────────────────────────────┬──────────────┬────────────┬─────────────────────────────────────────────────────────────────────────────┐
│ Package                           │ Current      │ Latest     │ Details                                                                     │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ babel-preset-es2015 (dev)         │ 6.24.1       │ Deprecated │ 🙌  Thanks for using Babel: we recommend                                    │
│                                   │              │            │ using babel-preset-env now: please read                                     │
│                                   │              │            │ https://babeljs.io/env to update!                                           │
│                                   │              │            │ https://babeljs.io/                                                         │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ autoprefixer (dev)                │ 10.4.12      │ 10.4.13    │ https://github.com/postcss/autoprefixer#readme                              │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ @babel/runtime (dev)              │ 7.19.4       │ 7.20.1     │ https://babel.dev/docs/en/next/babel-runtime                                │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ sass (dev)                        │ 1.55.0       │ 1.56.0     │ https://github.com/sass/dart-sass                                           │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ vue-template-compiler (dev)       │ 2.6.14       │ 2.7.13     │ https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#readme │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ webpack-bundle-analyzer (dev)     │ 4.6.1        │ 4.7.0      │ https://github.com/webpack-contrib/webpack-bundle-analyzer                  │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ xyz-vue-epbos-web-component       │ 1.20.15      │ 1.21.1     │                                                                             │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ babel-loader (dev)                │ 8.2.5        │ 9.1.0      │ https://github.com/babel/babel-loader                                       │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ chalk (dev)                       │ 4.1.2        │ 5.1.2      │ https://github.com/chalk/chalk#readme                                       │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ copy-webpack-plugin (dev)         │ 4.6.0        │ 11.0.0     │ https://github.com/webpack-contrib/copy-webpack-plugin                      │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ lodash (dev)                      │ 3.10.1       │ 4.17.21    │ https://lodash.com/                                                         │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ node-notifier (dev)               │ 5.1.2        │ 10.0.1     │ https://github.com/mikaelbr/node-notifier#readme                            │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ ora (dev)                         │ 1.2.0        │ 6.1.2      │ https://github.com/sindresorhus/ora#readme                                  │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ vue                               │ 2.6.14       │ 3.2.41     │ https://github.com/vuejs/core/tree/main/packages/vue#readme                 │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ vue-loader (dev)                  │ 15.10.0      │ 17.0.1     │ https://github.com/vuejs/vue-loader#readme                                  │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ vue-router                        │ 3.4.9        │ 4.1.6      │ https://github.com/vuejs/router#readme                                      │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ vuex                              │ 3.6.0        │ 4.1.0      │ https://github.com/vuejs/vuex#readme                                        │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ webpack-merge (dev)               │ 4.1.0        │ 5.8.0      │ https://github.com/survivejs/webpack-merge                                  │
├───────────────────────────────────┼──────────────┼────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ extract-text-webpack-plugin (dev) │ 4.0.0-beta.0 │ 3.0.2      │ Deprecated. Please use                                                      │
│                                   │              │            │ https://github.com/webpack-contrib/mini-css-extract-plugin                  │
│                                   │              │            │ http://github.com/webpack-contrib/extract-text-webpack-plugin               │
└───────────────────────────────────┴──────────────┴────────────┴─────────────────────────────────────────────────────────────────────────────┘
```

## tip3: 查看依赖包的版本

```bash
pnpm view [包名] version # 查看包的最新版本

pnpm view [包名] versions # 查看包的所有版本
```

eg:

```bash
pnpm view puppeteer version # 查看 puppeteer 最新版本

pnpm view puppeteer versions # 查看 puppeteer 所有版本
```

## tip4: 检查 pnpm 已知的常见配置问题 <Badge type="warning" text="beta" />

```bash
pnpm doctor
```

## 相关阅读

> - [都2022年了，pnpm快到碗里来！](https://zhuanlan.zhihu.com/p/457698236)
> - [关于现代包管理器的深度思考——为什么现在我更推荐 pnpm 而不是 npm/yarn?](https://zhuanlan.zhihu.com/p/377593512)
> - [pnpm 中无法使用 patch-package 打补丁](https://lwebapp.com/zh/post/pnpm-patch-package)
