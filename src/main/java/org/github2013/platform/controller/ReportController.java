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
public class ReportController {

  @Autowired
  private OracleDao oracleDao;

  @RequestMapping(value = "/query", method = RequestMethod.GET)
    public String query(@RequestParam(value="sql", defaultValue="select 'sql is null' from dual") String sql) {
      System.out.println("OK....");
      return oracleDao.query(sql);
      //return "dddd";
    }

}
