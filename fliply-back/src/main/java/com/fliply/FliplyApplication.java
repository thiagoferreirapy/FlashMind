package com.fliply;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FliplyApplication {
    public static void main(String[] args) {
        // Try to load .env from current dir or fliply-back dir
        Dotenv dotenv = Dotenv.configure()
                .directory("./fliply-back")
                .ignoreIfMissing()
                .load();

        // If not found in fliply-back, try current dir
        if (dotenv.entries().isEmpty()) {
            dotenv = Dotenv.configure().ignoreIfMissing().load();
        }

        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(FliplyApplication.class, args);
    }
}
