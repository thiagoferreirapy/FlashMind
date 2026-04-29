package com.flashmind;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FlashMindApplication {
    public static void main(String[] args) {
        // Try to load .env from current dir or flashmind-back dir
        Dotenv dotenv = Dotenv.configure()
                .directory("./flashmind-back")
                .ignoreIfMissing()
                .load();

        // If not found in flashmind-back, try current dir
        if (dotenv.entries().isEmpty()) {
            dotenv = Dotenv.configure().ignoreIfMissing().load();
        }

        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(FlashMindApplication.class, args);
    }
}
