## 升级流程

1. `config/index.js`

```js{4}
module.exports = {
    dev: {
        // ...
        devtool: 'cheap-module-eval-source-map'
        // ...
    }
};
```

调整为：

```js{4}
module.exports = {
    dev: {
        // ...
        devtool: 'eval-cheap-module-source-map'
        // ...
    }
};
```

## QA

### 指定了 main 入口为 src 下，但引用这个包的地方缺少 src 文件夹？

-   问题详情
    ![img_1.png](img_1.png)

-   解决方案：排查 .gitignore 下是否包含`src/`目录，若包含，则在 npm publish 时会将 src 目录忽略，将该忽略规则删除即可
    ![img.png](img.png)
