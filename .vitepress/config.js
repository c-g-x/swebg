// import DefaultTheme from 'vitepress/theme';
// import naive from 'naive-ui';

export default {
    // ...DefaultTheme,
    // enhanceApp(ctx) {
        // DefaultTheme.enhanceApp(ctx);
        // ctx.app.use(naive);
    // },
    title: 'WEB 框架小组',
    description: 'WEB 框架小组文档',
    lang: 'zh-CN',
    base: '/swebg/',
    markdown: {
        theme: 'material-palenight',
        lineNumbers: true
    },
    themeConfig: {
        sidebar: [
            {
                text: '规范合集',
                items: [
                    {
                        text: '代码提交规范',
                        link: '/spec/code-spec.md'
                    },
                    {
                        text: '组件发布流程',
                        link: '/spec/component-publish-spec/index.md'
                    },
                    {
                        text: '脚手架升级流程',
                        link: '/spec/cli-update/index.md'
                    }
                ]
            },
            {
                text: '学习资料',
                items: [
                    {
                        text: 'CSS',
                        link: '/study/css/index.md'
                    }
                ]
            }
        ]
    }
};
