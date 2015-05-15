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

@Repository("oracleDao")
public class OracleDao // extends JdbcDaoSupport
{
  protected final Logger log = LoggerFactory.getLogger(getClass());

  @Autowired 
  @Qualifier("jdbcOracle")
  protected JdbcTemplate jdbcOracle;

  public String query(String sql) {
    System.out.println("select sql:"+sql);
    List rows = jdbcOracle.queryForList(sql);
    System.out.println(rows);
    return JSON.toJSONString(rows);
    //return "dddd";
  }

  public String update(String sql,Object[]  args) {
    System.out.println("update sql:" + sql);
    int ret=-1;
    try{
       ret = jdbcOracle.update(sql,args);
    }catch(Exception e){
      e.printStackTrace();
      ret = -1;
      System.out.println("此条数据已在数据库中存在！");
    }
    System.out.println(ret);
    return JSON.toJSONString(ret);
    //return "dddd";
  }


}
