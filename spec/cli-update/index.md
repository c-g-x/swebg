# 脚手架升级流程

## 1. `build/*`

覆盖原本的 build 文件夹，若原本该组件的脚手架不包含 `build/test` 文件夹，则更新后也不能包含 `build/text` 文件夹

### 注意

::: details
This is a details block.
:::

::: details 若原本 `build/check-legal.js` 下已有 Slint 校验规则，则取以下代码
```js
const path = require('path'),
    _ = require('lodash'),
    exec = require('child_process').exec,
    execSync = require('child_process').execSync,
    format = require('util').format,
    xml2js = require('xml2js'),
    parser = new xml2js.Parser(),
    fs = require('fs');

var svnLog = function (source, callback) {
    var $cwd = process.cwd();
    source = path.relative($cwd, source);
    var command = format('svn log %s --xml --limit 1', source);
    var hasError = false;
    var execLog = exec(command, function (err, stdout) {
        if (!hasError) {
            parser.parseString(stdout, function (err, result) {
                callback(err, result);
            });
        }
    });
    execLog.stderr.on('data', function (data) {
        console.log(data);
        hasError = true;
        if (data.indexOf('Error validating') !== -1) {
            console.log('svn的用户名密码未绑定，可尝试命令行下执行 svn log package.json');
            process.exit(1);
        } else {
            console.log('无法获取svn日志， 可能原因: ');
            console.log('1. svn命令行工具尚未安装');
            console.log('2. 当前源码目录未绑定到svn');
            console.log('3. 网络未连接');
            process.exit(1);
        }
    });
};

var diff = function (source, callback) {
    exec('svn diff', function (err, result) {
        if (err) {
            console.log(err);
            var str = '该目录不是svn的源码目录,请检查svn的版本，或尝试与svn目录同步/重新checkout代码来解决此问题';
            return callback(str);
        }
        callback(err, result);
    });
};

var commit = function (source, message, callback) {
    var $cwd = process.cwd();
    source = path.relative($cwd, source);
    var command = format('svn commit %s --message %s', source, message);
    exec(command, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

//获取当前时间格式化
var getNowTime = function (timeFormat) {
    var dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1;
    var date = dateObj.getDate();
    var hour = dateObj.getHours();
    var min = dateObj.getMinutes();
    month = month >= 10 ? month : '0' + month;
    date = date >= 10 ? date : '0' + date;
    hour = hour >= 10 ? hour : '0' + hour;
    min = min >= 10 ? min : '0' + min;
    timeFormat = timeFormat || '%s-%s-%s %s:%s';
    return format(timeFormat, year, month, date, hour, min);
};

let basePath = process.cwd();
var pkgSrc = path.join(basePath, 'package.json');
var pkg;
try {
    pkg = JSON.parse(fs.readFileSync(pkgSrc).toString());
} catch (e) {
    console.log('package.json格式不正确');
    process.exit(1);
}
if (pkg.name.substring(0, 8) !== 'xyz-vue-') {
    console.log('package.json的name必须以xyz-vue-开头!');
    process.exit(1);
}
if (!pkg.description) {
    console.log('package.json的description不能为空!');
    process.exit(1);
}
if (!_.isArray(pkg.keywords) || pkg.keywords.length === 0) {
    console.log('package.json的keywords不能为空!');
    process.exit(1);
}
diff(basePath, function (err, result) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else if (result) {
        if (result.indexOf('Index: .') !== 0) {
            console.log('存在尚未签入的代码， 请签入后再执行npm publish操作');
            process.exit(1);
        }
    }

    svnLog(pkgSrc, function (err, result) {
        var htryPath = path.join(basePath, 'HISTORY.md');
        var historyContent = fs.readFileSync(htryPath).toString();
        var version = pkg.version;
        if (historyContent.indexOf('## ' + version + '\n') !== -1) {
            var delIndex = historyContent.indexOf('\n\n');
            historyContent = historyContent.substring(delIndex + 2);
        }
        var content = format('## %s\n%s, 作者 %s\n修改: %s \n\n', version, getNowTime(), pkg.author, result.logentry.msg);
        var md = content + historyContent;
        var message = format('%s版本签入', version);
        fs.writeFileSync(htryPath, md);
        commit(htryPath, message, function (err) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            runSlint(function (res) {
                if (res) {
                    var execBuild = exec('npm run build', function (err) {
                        if (err) {
                            console.log(err);
                            process.exit(1);
                        }
                        runTest();
                    });
                    execBuild.stdout.on('data', function (data) {
                        console.log(data);
                    });
                } else {
                    console.log('    代码规范有问题,请修正');
                    process.exit(1);
                }
            });
        });
    });
});

var runTest = function () {
    if (pkg.scripts && pkg.scripts.test) {
        var execTest = exec('npm run test', function (err) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            process.exit(0);
        });
        execTest.stdout.on('data', function (data) {
            console.log(data);
        });
    } else {
        process.exit(0);
    }
};

var runSlint = function (cb) {
    console.log('    开始slint代码规范审查');
    var haveData = 0;

    var examplesPath = path.join(basePath, 'examples');
    var cmdExample = 'slint -d ' + examplesPath + ' -p -c'; //examples目录可以使用console.log()方法
    var srcPath = path.join(basePath, 'src');
    var cmdSrc = 'slint -d ' + srcPath + ' -p';

    var stdoutExample = execSync(cmdExample).toString();
    var stdoutSrc = execSync(cmdSrc).toString();

    if (stdoutExample) {
        if (stdoutExample.indexOf('您的代码规范没问题') === -1) {
            console.log(stdoutExample);
            haveData = 1;
        }
    }

    if (stdoutSrc) {
        if (stdoutSrc.indexOf('您的代码规范没问题') === -1) {
            console.log(stdoutSrc);
            cb(false);
        } else {
            if (haveData === 0) {
                console.log('    您的代码规范没问题');
                cb(true);
            } else {
                cb(false);
            }
        }
    }
};
```
:::

::: details 否则，取以下不包含 `Slint` 校验逻辑的 `check-legal.js`
```js
const path = require('path'),
    _ = require('lodash'),
    exec = require('child_process').exec,
    format = require('util').format,
    xml2js = require('xml2js'),
    parser = new xml2js.Parser(),
    fs = require('fs');

var svnLog = function (source, callback) {
    var $cwd = process.cwd();
    source = path.relative($cwd, source);
    var command = format('svn log %s --xml --limit 1', source);
    var hasError = false;
    var execLog = exec(command, function (err, stdout) {
        if (!hasError) {
            parser.parseString(stdout, function (err, result) {
                callback(err, result);
            });
        }
    });
    execLog.stderr.on('data', function (data) {
        console.log(data);
        hasError = true;
        if (data.indexOf('Error validating') !== -1) {
            console.log('svn的用户名密码未绑定，可尝试命令行下执行 svn log package.json');
            process.exit(1);
        } else {
            console.log('无法获取svn日志， 可能原因: ');
            console.log('1. svn命令行工具尚未安装');
            console.log('2. 当前源码目录未绑定到svn');
            console.log('3. 网络未连接');
            process.exit(1);
        }
    });
};

var diff = function (source, callback) {
    exec('svn diff', function (err, result) {
        if (err) {
            console.log(err);
            var str = '该目录不是svn的源码目录,请检查svn的版本，或尝试与svn目录同步/重新checkout代码来解决此问题';
            return callback(str);
        }
        callback(err, result);
    });
};

var commit = function (source, message, callback) {
    var $cwd = process.cwd();
    source = path.relative($cwd, source);
    var command = format('svn commit %s --message %s', source, message);
    exec(command, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

//获取当前时间格式化
var getNowTime = function (timeFormat) {
    var dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1;
    var date = dateObj.getDate();
    var hour = dateObj.getHours();
    var min = dateObj.getMinutes();
    month = month >= 10 ? month : '0' + month;
    date = date >= 10 ? date : '0' + date;
    hour = hour >= 10 ? hour : '0' + hour;
    min = min >= 10 ? min : '0' + min;
    timeFormat = timeFormat || '%s-%s-%s %s:%s';
    return format(timeFormat, year, month, date, hour, min);
};

let basePath = process.cwd();
var pkgSrc = path.join(basePath, 'package.json');
var pkg;
try {
    pkg = JSON.parse(fs.readFileSync(pkgSrc).toString());
} catch (e) {
    console.log('package.json格式不正确');
    process.exit(1);
}
if (pkg.name.substring(0, 8) !== 'xyz-vue-') {
    console.log('package.json的name必须以xyz-vue-开头!');
    process.exit(1);
}
if (!pkg.description) {
    console.log('package.json的description不能为空!');
    process.exit(1);
}
if (!_.isArray(pkg.keywords) || pkg.keywords.length === 0) {
    console.log('package.json的keywords不能为空!');
    process.exit(1);
}
diff(basePath, function (err, result) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else if (result) {
        console.log('存在尚未签入的代码， 请签入后再执行npm publish操作');
        process.exit(1);
    }

    svnLog(pkgSrc, function (err, result) {
        var htryPath = path.join(basePath, 'HISTORY.md');
        var historyContent = fs.readFileSync(htryPath).toString();
        var version = pkg.version;
        if (historyContent.indexOf('## ' + version + '\n') !== -1) {
            var delIndex = historyContent.indexOf('\n\n');
            historyContent = historyContent.substring(delIndex + 2);
        }
        var content = format('## %s\n%s, 作者 %s\n修改: %s \n\n', version, getNowTime(), pkg.author, result.logentry.msg);
        var md = content + historyContent;
        var message = format('%s版本签入', version);
        fs.writeFileSync(htryPath, md);
        commit(htryPath, message, function (err) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            var execBuild = exec('npm run build', function (err) {
                if (err) {
                    console.log(err);
                    process.exit(1);
                }
                runTest();
            });
            execBuild.stdout.on('data', function (data) {
                console.log(data);
            });
        });
    });
});

var runTest = function () {
    if (pkg.scripts && pkg.scripts.test) {
        var execTest = exec('npm run test', function (err) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            process.exit(0);
        });
        execTest.stdout.on('data', function (data) {
            console.log(data);
        });
    } else {
        process.exit(0);
    }
};
```
:::

## 2. `config/index.js`

若包含以下高亮行代码

```js{4}
module.exports = {
    dev: {
        // ...
        devtool: 'cheap-module-eval-source-map'
        // ...
    }
};
```

则需调整为：

```js{4}
module.exports = {
    dev: {
        // ...
        devtool: 'eval-cheap-module-source-map'
        // ...
    }
};
```

## 3. `.npmrc`

```text
node-linker=hoisted
strict-peer-dependencies=false
shamefully-hoist=true
child-concurrency=8
lockfile=false
```

## 4. `.babelrc`

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false,
                "targets": {
                    "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
                }
            }
        ]
    ]
}
```

## 5. `package.json`

1. 若原本 main 入口为 `./lib/index.js`，则调整为 `src/index.js`
2. 更新 scripts 中 `dev` 为 `webpack serve --config build/webpack.dev.conf.js`
3. 更新 scripts 中 `build` 命令为 `node build/build.js`
4. 若原本 scripts 中无 `test` 命令，则无需新增该命令
5. 调整 `devDependencies` 为以下内容

```json{2,4,7,9-13,16-86}
{
    "name": "xyz-vue-loading-modal",
    "version": "0.1.24",
    "description": "基于bootstrap modal封装的loading组件",
    "author": "chenguixin<chenguixin@shinetechnology.com>",
    "homepage": "",
    "keywords": ["等待", "加载中", "业务界面模块"],
    "main": "src/index.js",
    "scripts": {
        "dev": "webpack serve --config build/webpack.dev.conf.js",
        "start": "npm run dev",
        "build": "node build/build.js",
        "test": "node build/test/test.js",
        "prepublishOnly": "node build/check-legal.js"
    },
    "devDependencies": {
        "@babel/cli": "7.17.6",
        "@babel/core": "7.18.13",
        "@babel/plugin-syntax-dynamic-import": "7.8.3",
        "@babel/plugin-syntax-jsx": "7.16.7",
        "@babel/preset-env": "7.18.10",
        "@babel/preset-stage-2": "7.8.3",
        "@soda/friendly-errors-webpack-plugin": "1.8.1",
        "@vue/compiler-sfc": "3.2.31",
        "async": "2.4.1",
        "autoprefixer": "10.4.8",
        "babel-helper-vue-jsx-merge-props": "2.0.3",
        "babel-loader": "8.2.2",
        "babel-plugin-import": "1.13.3",
        "babel-plugin-syntax-dynamic-import": "6.18.0",
        "babel-plugin-syntax-jsx": "6.18.0",
        "babel-plugin-transform-vue-jsx": "3.5.0",
        "chalk": "4.1.2",
        "clean-webpack-plugin": "4.0.0",
        "colorful": "2.0.3",
        "copy-webpack-plugin": "4.6.0",
        "cross-env": "7.0.3",
        "css-loader": "6.7.1",
        "css-minimizer-webpack-plugin": "4.0.0",
        "happypack": "5.0.1",
        "html-loader": "4.2.0",
        "html-webpack-plugin": "5.5.0",
        "lodash": "3.10.1",
        "mini-css-extract-plugin": "2.6.1",
        "node-notifier": "5.1.2",
        "ora": "1.2.0",
        "portfinder": "1.0.28",
        "postcss": "8.4.16",
        "postcss-import": "14.1.0",
        "postcss-loader": "7.0.1",
        "postcss-pxtorem": "6.0.0",
        "postcss-url": "10.1.3",
        "puppeteer": "18.2.1",
        "request": "2.88.2",
        "sass": "1.54.5",
        "sass-loader": "13.0.2",
        "semver": "7.3.7",
        "shelljs": "0.8.5",
        "speed-measure-webpack-plugin": "1.5.0",
        "style-loader": "1.3.0",
        "terser": "5.12.1",
        "terser-webpack-plugin": "5.3.1",
        "tmp": "0.2.1",
        "to-string-loader": "1.1.6",
        "vue": "2.6.14",
        "vue-loader": "15.10.0",
        "vue-style-loader": "4.1.0",
        "vue-template-compiler": "2.6.14",
        "webpack": "5.38.1",
        "webpack-bundle-analyzer": "4.5.0",
        "webpack-cli": "4.10.0",
        "webpack-dev-server": "4.10.0",
        "webpack-merge": "4.1.0",
        "webpack-parallel-uglify-plugin": "2.0.0",
        "webpackbar": "5.0.2",
        "xml-loader": "1.2.1",
        "xml2js": "0.1.14"
    },
    "engines": {
        "node": ">= 6.0.0",
        "npm": ">= 3.0.0"
    },
    "browserslist": ["> 1%", "last 2 versions", "not ie <= 8"],
    "assets": false
}
```

## 6. `.gitignore`

```text
.DS_Store
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln

# Ignore for publish
.babelrc
```

## QA

### 指定了 main 入口为 src 下，但引用这个包的地方缺少 src 文件夹？

-   问题详情
    ![img_1.png](img_1.png)

-   解决方案：排查 .gitignore 下是否包含`src/`目录，若包含，则在 npm publish 时会将 src 目录忽略，将该忽略规则删除即可
    ![img.png](img.png)
