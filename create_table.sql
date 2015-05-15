create table classify(
id number(4) primary key not null,
name varchar(254) default '未填',
info varchar(254) default '未填',
UNIQUE (name)
);
select id,name,info from classify;
insert into classify(name,info) values('设备类资源统计报表','设备类资源统计报表')
Comment On Table classify Is '一级分类信息';
Comment On Column classify.id Is '分类ID';
Comment On Column classify.name Is '分类名称';
Comment On Column classify.info Is '环境信息及简介';
--创建自增长的字段
create sequence classify_seq start with 1 increment by 1 nocache;
CREATE OR REPLACE TRIGGER classify_trig_autoinc
  BEFORE INSERT ON classify
    FOR EACH ROW
      BEGIN
	    IF (:new.id IS NULL) THEN
	            SELECT classify_seq.nextval INTO :new.id FROM DUAL;
		      END IF;
      END;
      
      --/*报表名称表*/
      create table report(
  id number(4) primary key not null,
  class_id int not null,
  name varchar(254) default '未填',
  isql varchar(1000) default '未填',
  info varchar(254) default '未填',
  FOREIGN KEY (class_id) REFERENCES classify(id),
  UNIQUE (class_id,name)
  );
  Comment On Table Report Is '报表信息表';
  Comment On Column report.id Is '分类ID';
  Comment On Column report.class_id Is '分类ID';
  Comment On Column report.name Is '报表名称';
  Comment On Column report.isql Is '报表SQL';
  Comment On Column report.info Is '报表简介';
  --创建自增长的字段
  create sequence report_seq start with 1 increment by 1 nocache;
  CREATE OR REPLACE TRIGGER report_trig_autoinc
    BEFORE INSERT ON report
      FOR EACH ROW
        BEGIN
	      IF (:new.id IS NULL) THEN
		      SELECT report_seq.nextval INTO :new.id FROM DUAL;
		        END IF;
	END;
