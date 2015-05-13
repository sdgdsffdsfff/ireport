package org.github2013;

import org.springframework.boot.SpringApplication; 
import org.springframework.boot.autoconfigure.EnableAutoConfiguration; 
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration; 
import org.springframework.context.annotation.ComponentScan; 
import org.springframework.context.annotation.Configuration; 
 
@EnableAutoConfiguration(exclude = DataSourceAutoConfiguration.class)
@Configuration 
@ComponentScan(basePackages = "org.github2013")
public class App 
{

   public static void main( String[] args )
   {
     SpringApplication.run(App.class, args);

   }
}
