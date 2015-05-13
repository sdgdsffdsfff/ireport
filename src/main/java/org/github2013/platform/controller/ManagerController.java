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
      System.out.println("add params");
      System.out.println("name:"+name);
      System.out.println("info:"+info);
      String ret = oracleDao.update("insert into classify(name,info) values(?,?)", new Object[] {name, info});
      System.out.println(ret);
      return ret;
    }

}
