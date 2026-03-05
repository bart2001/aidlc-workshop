package com.tableorder.common.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String createToken(Long storeId, String role, Long subjectId, Long tableId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        JwtBuilder builder = Jwts.builder()
                .subject(String.valueOf(subjectId))
                .claim("storeId", storeId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key);

        if (tableId != null) {
            builder.claim("tableId", tableId);
        }

        return builder.compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired");
        } catch (JwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }

    public Long getStoreId(Claims claims) {
        return claims.get("storeId", Long.class);
    }

    public String getRole(Claims claims) {
        return claims.get("role", String.class);
    }

    public Long getSubjectId(Claims claims) {
        return Long.parseLong(claims.getSubject());
    }

    public Long getTableId(Claims claims) {
        return claims.get("tableId", Long.class);
    }
}
