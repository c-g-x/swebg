# IBT 升级流程

以 1.0.1.9 升级 1.0.1.10 为例

## pom.xml 调整

1. `ibt/pom.xml`, `ibt-bootstrap`, `ibt-dfa-controller`, `ibt-dfa-facade`, `ibt-dfa-impl`, `ibt-dfa-service`

::: details 调整父级版本号

```xml{4}
<parent>
    <groupId>com.shine.dfa.ibt</groupId>
    <artifactId>ibt-project</artifactId>
    <version>1.0.1.10</version>
    <relativePath>../pom.xml</relativePath>
</parent>
```

:::

2. `pom.xml`

::: details 调整主 pom 文件以下部分

```xml{6,13}
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- ... -->
    <groupId>com.shine.dfa.ibt</groupId>
    <artifactId>ibt-project</artifactId>
    <version>1.0.1.10</version>
    <packaging>pom</packaging>

    <profiles>
        <profile>
            <id>release</id>
            <properties>
                <ibt.version>1.0.1.10</ibt.version>
                <!-- ... -->
            </properties>
        </profile>
    </profiles>
</project>
```

:::

## Oracle 脚本调整

### 1. `Oracle/update_main.bat`

搜索 **IBT_INSTALL_VERSION**，调整为当前需升级的版本号（1.0.1.10）

```bash
    @REM 本升级包版本号
    SET IBT_INSTALL_VERSION="E-IBT 1.0.1.10"
    @REM 获取已安装的小于升级包版本的最新版本号
```

增加当前小版本升级脚本（10110）

```bash{10-13}
:1018
@if %ver% geq 1018 goto 1019
@ECHO "开始1018小版本升级脚本"
CD %IBT_PATH%\1018
CALL update_main.bat %1 %2 %3
@if %ver% geq 1019 goto 10110
@ECHO "开始1019小版本升级脚本"
CD %IBT_PATH%\1019
CALL update_main.bat %1 %2 %3
:10110
@ECHO "开始10110小版本升级脚本"
CD %IBT_PATH%\10110
CALL update_main.bat %1 %2 %3
```

### 2. `Oracle/10110/EA_IBT/Update/Init/Update_Log.sql`

路径中 10110 为当前版本号去除 `.`，例如当前为 E-IBT 1.0.1.10，则对应路径为 `Oracle/10110/xxx`

以下内容修改为当前版本号

```sql{9-10}
--以下语句固定放在升级脚本的最后
--增加升级日志说明
INSERT INTO TPF_UPDATE_LOG
    (ID, APP_ID, UP_DATE, UP_TIME, UP_VERSION, UP_DESC, NOTE, UP_TYPE)
    SELECT S_TPF_UPDATE_LOG.NEXTVAL,
        '56',
        TO_CHAR(SYSDATE, 'YYYYMMDD'),
        TO_CHAR(SYSDATE, 'HH24:MI:SS'),
        'E-IBT 1.0.1.10',
        'E-IBT 1.0.1.10 升级',
        '',
        '1'
    FROM DUAL;
COMMIT;
```

### 3. `Oracle/10110/update_main.bat`

调整对应 E-PBOS-TPF 的版本依赖，例如 E-IBT 1.0.1.10 版本时，对应的 E-PBOS-TPF 版本为 **1.0.1.11**

```bash{12-15}
REM
REM  %1:数据库实例名
REM  %2:IBT用户
REM  %3:IBT用户密码
REM  调用举例:update_main.bat 10.168.0.93:1521/orcl EA_IBT EA_IBT
REM
@ECHO OFF
SET NLS_LANG=AMERICAN_AMERICA.AL32UTF8
SET IBT_SAVE_PATH="%CD%"

@REM ==========================================================
CD %IBT_SAVE_PATH%\COMP_SCRIPT\E-PBOS-TPF 1.0.1.11
@ECHO ########升级E-PBOS-TPF 1.0.1.11 >>%IBT_PATH%\TPF_UPDATE_MAIN.LOG
CALL update_main.bat %1 %2 %3 >>%IBT_PATH%\TPF_UPDATE_MAIN.LOG
@ECHO ########执行组件升级脚本结束 >>%IBT_PATH%\TPF_UPDATE_MAIN.LOG
@REM ==========================================================

@REM ==========================================================
@ECHO ########开始执行小版本升级脚本
CD %IBT_SAVE_PATH%

CALL update_main_table.bat %1 %2 %3

CALL update_main_init.bat %1 %2 %3

@ECHO ########执行小版本升级脚本结束
@REM ==========================================================
```

## Gauss 脚本调整

### 1. `Gauss/exec_main/bash/main.sh`

```shell{11-14}
  #开始安装组件1019
  echo "开始安装组件TPF"
  #exec "$BASE_PATH/../../COMP_SCRIPT/E-PBOS-TPF 1.0.1.9/exec_main/bash/main.sh" $*
  echo exit | gsql -d "$ARG_DBNAME" -U "$ARG_USERNAME" -W "$ARG_PASSWD" -h "$ARG_HOST" -p "$ARG_PORT" -f "$BASE_PATH/../../COMP_SCRIPT/E-PBOS-TPF 1.0.1.9/exec_update/update_main.sql" 1>"$SH_DIR/main_tpf.log" 2>"$SH_DIR/main_tpf_error.log"

  #开始安装组件10110
  echo "开始安装组件TPF"
  #exec "$BASE_PATH/../../COMP_SCRIPT/E-PBOS-TPF 1.0.1.10/exec_main/bash/main.sh" $*
  echo exit | gsql -d "$ARG_DBNAME" -U "$ARG_USERNAME" -W "$ARG_PASSWD" -h "$ARG_HOST" -p "$ARG_PORT" -f "$BASE_PATH/../../COMP_SCRIPT/E-PBOS-TPF 1.0.1.10/exec_update/update_main.sql" 1>"$SH_DIR/main_tpf.log" 2>"$SH_DIR/main_tpf_error.log"

  #开始安装组件10111
  echo "开始安装组件TPF"
  #exec "$BASE_PATH/../../COMP_SCRIPT/E-PBOS-TPF 1.0.1.11/exec_main/bash/main.sh" $*
  echo exit | gsql -d "$ARG_DBNAME" -U "$ARG_USERNAME" -W "$ARG_PASSWD" -h "$ARG_HOST" -p "$ARG_PORT" -f "$BASE_PATH/../../COMP_SCRIPT/E-PBOS-TPF 1.0.1.11/exec_update/update_main.sql" 1>"$SH_DIR/main_tpf.log" 2>"$SH_DIR/main_tpf_error.log"
```

### 2. `Gauss/EA_IBT/Update/Init/Update_Log.sql`

```sql{9-10}
--以下语句固定放在升级脚本的最后
--增加升级日志说明
INSERT INTO ES_TPF.TPF_UPDATE_LOG
   (ID, APP_ID, UP_DATE, UP_TIME, UP_VERSION, UP_DESC, NOTE, UP_TYPE)
   SELECT ES_TPF.S_TPF_UPDATE_LOG.NEXTVAL,
       '56',
       TO_CHAR(SYSDATE, 'YYYYMMDD'),
       TO_CHAR(SYSDATE, 'HH24:MI:SS'),
       'E-IBT 1.0.1.10',
       'E-IBT 1.0.1.10 升级',
       '',
       '1'
   FROM DUAL;
COMMIT;
```

### 3. `Gauss/EA_IBT/Init/init_TPF_UPDATE_LOG.sql`

```sql{7-8}
INSERT INTO ES_TPF.TPF_UPDATE_LOG
    (ID, APP_ID, UP_DATE, UP_TIME, UP_VERSION, UP_DESC, NOTE, UP_TYPE)
SELECT ES_TPF.S_TPF_UPDATE_LOG.NEXTVAL,
       '56',
       TO_CHAR(SYSDATE, 'YYYYMMDD'),
       TO_CHAR(SYSDATE, 'HH24:MI:SS'),
       'E-IBT 1.0.1.10',
       'E-IBT 1.0.1.10 标准版',
       '',
       '0'
  FROM ES_TPF.DUAL;
```
