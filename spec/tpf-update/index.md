# TPF 升级流程

以 1.0.1.10 升级 1.0.1.11 为例

## pom.xml 调整

1. `tpf/pom.xml`

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

2. `tpf-bootstrap/pom.xml`

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
