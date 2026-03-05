package com.tableorder.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 개발 환경에서 시드 데이터의 비밀번호 해시를 출력합니다.
 * V10 시드 SQL의 해시값을 갱신할 때 사용하세요.
 */
@Slf4j
@Configuration
@Profile("dev")
public class SeedDataInitializer {

    @Bean
    public CommandLineRunner printSeedPasswordHashes(PasswordEncoder passwordEncoder) {
        return args -> {
            log.info("=== Seed Password Hashes (for V10 migration) ===");
            log.info("admin1234 -> {}", passwordEncoder.encode("admin1234"));
            log.info("1234 -> {}", passwordEncoder.encode("1234"));
            log.info("================================================");
        };
    }
}
