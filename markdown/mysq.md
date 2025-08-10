# mySql
## 增
    CREATE DATAASE student;新加数据库
    USE student;指定在哪个数据库操作
    CREATE TABLE user (
        id INT PRIMARY KEY  AUTO_INCREMENT, 表示 数据格式 数据唯一 数据递增
        name VARCHAR(10) NOT NULL,表示 数据格式 数据不能为空
        birthday DATA NULL表示 数据格式 数据可以为空
    );类似添加表头
    INSERT INTO student.user (id,name,birthday)
    VALUES (1,'张三','1999-01-01')
    INSERT INTO student.user
    VALUES (DEFAULT,'张三','1999-01-01')表示 DEFAULT 自动递增

    ALTER TABLE student.user 
    ADD age INT NOT NULL;表示 增加表格列名 列名的类型
## 改
    UPDATA student.user
    set name='李四'
    WHERE id=1; 表示 修改表格数据 WHERE 条件 在这表示位置
## 删
    DALETE FROM student.user
    WHERE id=1; 表示 删除表格一行数据 在这表示位置
    DROP DATABASE student;删除数据库
## 查
    SELECT *
    FROM student.user;表示查看表格所有数据

    SELECT name，age//表头
    FROM student.user;表示查看表格name和age所有数据
    
    SELECT * 
    FROM student.user
    ORDER BY id ASC;表示查看表格所有数据 按id升序排列

    SELECT * 
    FROM student.user
    ORDER BY id DESC;表示查看表格所有数据 按id降序排列

    SELECT * 
    FROM student.user
    WHERE id>2;表示 查看表格所有数据 WHERE 条件 在这表示id大于2的数据 
    ORDER BY id DESC;表示查看表格所有数据 按id降序排列
## 合并
    SELECT * 
    FROM student.user
    INNER JOIN student.user2
    ON student.user.age=student.user2.age;表示 合并表格

    SELECT age
    FROM student.user
    UNION 
    SELECT age
    FROM student.user2;表示 合并/并集表格

    SELETE *
    FROM student.user
    LEFT JOIN student.user2
    ON student.user.age=student.user2.age;表示 左连接表格

    SELETE *
    FROM student.user
    RIGHT JOIN student.user2
    ON student.user.age=student.user2.age;表示 右连接表格

    


