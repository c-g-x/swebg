# 代码提交规范

Commit Message 标准格式包括三个部分：Header, Body, Footer

## 提交格式

```text{1}
<type>(<scope>):<subject>
// 空一行
<body>
// 空一行
<footer>
```

其中 **\<type\>** 和 **<\subject\>** 必填，若有关联 QC / 禅道的测试单号，则 **\<footer\>** 也必填

1. \<type\>: 说明提交的类型，详情见 [提交类型列表](./code-spec#提交类型列表)
2. \<scope\>: 说明影响的范围，如消息模块、收藏分组等
3. \<subject\>: 本次提交的主题，一行的简短描述
4. \<body\>: 对 **\<subject\>** 的补充，可以多行
5. \<footer\>: 关联的 QC 单号、禅道单号

## 提交类型列表

| type        | description                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| feat        | 新功能 (A new feature)                                                                                            |
| fix         | 修复 bug (A bug fix)                                                                                              |
| improvement | 对当前功能的改进 (An improvement)                                                                                 |
| docs        | 仅包含文档的修改                                                                                                  |
| style       | 格式化变动                                                                                                        |
| refactor    | 重构，既不是新增功能，也不是修改 bug 的变动                                                                       |
| perf        | 提高性能的修改 (A code change that improves performance                                                           |
| test        | 添加或修改测试代码                                                                                                |
| build       | 构建工具或外部依赖包的修改，比如更新依赖包的版本等 (Changes that affect the build system or external dependencies |
| ci          | 持续集成的配置文件或脚本的修改 (Changes to our CI configuration files and scripts                                 |
| chore       | 杂项，其它不修改源代码与测试代码的修改 (Other changes that don't modify src or test files                         |
| revert      | 撤销某次提交 (Reverts a previous commit)                                                                          |

## 参考文章

> [使用 commitizen 规范 Git 提交说明](https://zhuanlan.zhihu.com/p/132348944)
>
> [SVN 提交备注规范](https://blog.csdn.net/yunfeather/article/details/126505266)
>
> [How to Write a Git Commit Message](https://cbea.ms/git-commit/)
