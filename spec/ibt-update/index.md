# IBT 升级流程

以 1.0.1.9 升级 1.0.1.10 为例

## pom.xml 调整

1. `ibt/pom.xml`, `ibt-bootstrap`, `ibt-dfa-controller`, `ibt-dfa-facade`, `ibt-dfa-impl`, `ibt-dfa-service`

::: detail 调整父级版本号

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

::: detail 调整主 pom 文件以下部分

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

4. `tpf-bootstrap/pom.xml`

```xml{9,18}
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- ... -->

    <profiles>
        <profile>
            <id>release</id>
            <properties>
                <tpf.version>1.0.1.11</tpf.version>
            </properties>
        </profile>
    </profiles>

    <!-- ... -->

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <tpf.version>1.0.1.11-SNAPSHOT</tpf.version>
    </properties>

    <!-- ... -->
</project>
```

3. `tpf-dfa-controller/pom.xml` 同上
4. `tpf-dfa-facade/pom.xml` 同上
5. `tpf-dfa-impl/pom.xml` 同上
6. `tpf-service/pom.xml` 同上
7. `pom.xml` 同上

## Oracle 脚本调整

### 1. `Oracle/update_main.bat`

调整为升级`当前版本（1.0.1.11）`依赖的 TPF 版本号，通常为`上个版本（1.0.1.10）`

```bat{7}
@REM ...

@REM 每个版本发布时需要修改依赖的版本号，版本号必须用双引号""括起,因为如果版本号有空格的话BAT无法执行
   @REM ==========================================================
   @REM BEGIN OF 升级脚本
   @REM 检测自身版本依赖
   @CALL VERSIONCHECK.BAT %2 %3 %1 "E-PBOS-TPF 1.0.1.10"
   @IF "%4" == "0" GOTO INSTALL

@REM ...
```

本升级包版本号修改为当前版本号

```text{2}
   @REM 本升级包版本号
   SET INSTALL_VERSION="E-PBOS-TPF 1.0.1.11"
   @REM 获取已安装的小于升级包版本的最新版本号
```

### 2. `Oracle/ES_TPF/Update/Init/Update_Log.sql`

修改为当前版本号

```sql{9-10}
--以下语句固定放在升级脚本的最后
--增加升级日志说明
INSERT INTO TPF_UPDATE_LOG
    (ID, APP_ID, UP_DATE, UP_TIME, UP_VERSION, UP_DESC, NOTE, UP_TYPE)
SELECT S_TPF_UPDATE_LOG.NEXTVAL,
       '56',
       TO_CHAR(SYSDATE, 'YYYYMMDD'),
       TO_CHAR(SYSDATE, 'HH24:MI:SS'),
       'E-PBOS-TPF 1.0.1.11',
       'E-PBOS-TPF 1.0.1.11 升级',
       '',
       '1'
  FROM DUAL;
COMMIT;
```

## Gauss 脚本调整

### 1. `Gauss/ES_TPF/Update/Init/Update_Log.sql`

```sql{9-10}
--以下语句固定放在升级脚本的最后
--增加升级日志说明
INSERT INTO ES_TPF.TPF_UPDATE_LOG
    (ID, APP_ID, UP_DATE, UP_TIME, UP_VERSION, UP_DESC, NOTE, UP_TYPE)
SELECT ES_TPF.S_TPF_UPDATE_LOG.NEXTVAL,
       '56',
       TO_CHAR(SYSDATE, 'YYYYMMDD'),
       TO_CHAR(SYSDATE, 'HH24:MI:SS'),
       'E-PBOS-TPF 1.0.1.11',
       'E-PBOS-TPF 1.0.1.11 升级',
       '',
       '1'
  FROM ES_TPF.DUAL;
COMMIT;
```
