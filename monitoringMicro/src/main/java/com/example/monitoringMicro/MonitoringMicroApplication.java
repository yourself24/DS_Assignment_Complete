package com.example.monitoringMicro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Component;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.monitoringMicro", "Models", "Service", "Repos", "Configuration"})
@EntityScan(basePackages = {"Models"})
@EnableJpaRepositories(basePackages = {"Repos"})
public class MonitoringMicroApplication {

	public static void main(String[] args) {
		SpringApplication.run(MonitoringMicroApplication.class, args);
	}

}
