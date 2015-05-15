package org.github2013.platform.controller;

import java.util.List;
import org.github2013.platform.dao.OracleDao;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class ManagerController {

  @Autowired
  private OracleDao oracleDao;

  @RequestMapping(value = "/addMainClassify", method = RequestMethod.GET)
    public String addMainClassify(@RequestParam(value="name", required = true) String name,@RequestParam(value="info", required = false) String info ){
      System.out.println("add MainClassify");
      System.out.println("name:"+name);
      System.out.println("info:"+info);
      String ret = oracleDao.update("insert into classify(name,info) values(?,?)", new Object[] {name, info});
      System.out.println(ret);
      return ret;
    }

  @RequestMapping(value = "/deleteMainClassify", method = RequestMethod.GET)
  public String deleteMainClassify(@RequestParam(value="id", required = true) int id ){
    System.out.println("delete a record classify");
    System.out.println("id:"+id);
    String ret = oracleDao.update("delete from classify where id = ?", new Object[] {id});
    System.out.println(ret);
    return ret;
  }
 
  //修改分类的rest
  @RequestMapping(value = "/modifyMainClassify", method = RequestMethod.GET) 
  public String modifyMainClassify(@RequestParam(value="name", required = true) String name,@RequestParam(value="info", required = false) String info,@RequestParam(value="id", required = false) int id ){
    System.out.println("modify a record classify");
    System.out.println("id:"+id+",name:"+name+",info:"+info);
    String ret = oracleDao.update("update classify set name = ? ,info = ? where id = ?", new Object[] {name, info, id});
    System.out.println(ret);
    return ret;
  }

  //添加报表
  @RequestMapping(value = "/addReport", method = RequestMethod.GET)
    public String addMainClassify(@RequestParam(value="id", required = true) int id,@RequestParam(value="name", required = true) String name,@RequestParam(value="sql", required = true) String sql ){
      System.out.println("add report,id:"+id+",name:"+name+",sql:"+sql);
      String ret = oracleDao.update("insert into report(class_id,name,isql) values(?,?,?)", new Object[] {id,name,sql});
      System.out.println(ret);
      return ret;
    }


}
