package com.yourself.chatMicro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@ComponentScan(basePackages = {"Controllers", "Models", "Repositories", "Services", "Configuration"})
@EnableJpaRepositories(basePackages = {"Repositories"})
@EntityScan(basePackages = {"Models"})
public class ChatMicroApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatMicroApplication.class, args);
	}

}
