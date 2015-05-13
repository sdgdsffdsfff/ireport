package org.github2013.platform.dao;

import org.slf4j.Logger; 
import org.slf4j.LoggerFactory; 
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.beans.factory.annotation.Qualifier; 
import org.springframework.jdbc.core.JdbcTemplate; 
import org.springframework.jdbc.core.RowMapper; 
import org.springframework.stereotype.Repository; 
import java.util.List;
import java.sql.ResultSet; 
import java.sql.SQLException; 
import com.alibaba.fastjson.JSON;

@Repository("mysqlDao")
public class MysqlDao // extends JdbcDaoSupport
{
  protected final Logger log = LoggerFactory.getLogger(getClass());

  @Autowired
  @Qualifier("jdbcMysql")
  protected JdbcTemplate jdbcMysql;

  public String query(String sql) {
    System.out.println("OK....");
    List rows = jdbcMysql.queryForList(sql);
    System.out.println(rows);
    return JSON.toJSONString(rows);
  }
}
