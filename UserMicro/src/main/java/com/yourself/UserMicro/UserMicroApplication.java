package com.yourself.UserMicro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"Controllers", "Models", "Repositories", "Security", "Services"})
@EnableJpaRepositories(basePackages = {"Repositories"})
@EntityScan(basePackages = {"Models"})
//enable usage of model package for user

public class UserMicroApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserMicroApplication.class, args);
	}

}
