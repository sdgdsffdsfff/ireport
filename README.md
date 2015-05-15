# ireport  
数据报表分析平台,目标：   
1、可以连接oracle、mysql、hive、spark等数据源(hive 和spark 还未整合进来，oracle和mysql多数据源同时使用，还有问题。)；   
2、可以通过界面进行点击选择，生产报表SQL语句。界面十分友好，易用；  
3、可以通过点击某一个报表项，进行load数据，数据是表格模式，表格具有搜索，排序，过滤字段等；  
4、可以折现图展现数据；  
   
架构模式：  
前端：bootstrap+select2+ichart+jquery+html5;  
后台：spring4 boot+spring jdbc

开发说明：  
1、首先配置连接oracle数据库；    
配置文件在：ireport/src/main/resources/application.properties下，进行数据库连接并把create_table.sql在数据库中执行，以便存储数据；   

2、编译打包：   
[root@drunk ireport]# mvn clean package   
启动服务：java -jar target/ireport-1.0-SNAPSHOT.jar --server.port=9000    
（JAVA 做好使用1.7，本代码使用的1.7编译）


