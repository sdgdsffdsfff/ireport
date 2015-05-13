package org.github2013.platform.conf; 

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties; 
import org.springframework.context.annotation.Bean; 
import org.springframework.context.annotation.Configuration; 
import org.springframework.jdbc.core.JdbcTemplate; 
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Primary;
import javax.sql.DataSource; 

@Configuration 
public class DataSourceConfig { 

  @Bean(name = "dataSourceMysql")
  //@Primary
  @Qualifier("dataSourceMysql")
  @ConfigurationProperties("datasource.mysql") 
  public DataSource dataSourceMysql() { 
    return DataSourceBuilder.create().build(); 
  }

  @Bean(name = "jdbcMysql")
  @Qualifier("dataSourceMysql")
  public JdbcTemplate jedcMysql(DataSource dataSourceMysql) { 
    return new JdbcTemplate(dataSourceMysql);
  }

  @Bean(name = "dataSourceOracle") 
  @Qualifier("dataSourceOracle")
  @Primary
  @ConfigurationProperties("datasource.oracle") 
  public DataSource dataSourceOracle() { 
    return DataSourceBuilder.create().build(); 
  }

  @Bean(name = "jdbcOracle")
  @Qualifier("dataSourceOracle")
  public JdbcTemplate jdbcOracle(DataSource dataSourceOracle) { 
    return new JdbcTemplate(dataSourceOracle);
  }

}
