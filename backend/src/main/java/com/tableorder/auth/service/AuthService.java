package com.tableorder.auth.service;

import com.tableorder.auth.dto.*;
import com.tableorder.auth.entity.Admin;
import com.tableorder.auth.repository.AdminRepository;
import com.tableorder.common.exception.BusinessException;
import com.tableorder.common.exception.ErrorCode;
import com.tableorder.common.security.JwtTokenProvider;
import com.tableorder.table.entity.StoreTable;
import com.tableorder.table.repository.TableRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final TableRepository tableRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public TableLoginResponse loginTable(TableLoginRequest request) {
        StoreTable table = tableRepository
                .findByStoreIdAndTableNumber(request.getStoreId(), request.getTableNumber())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), table.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = jwtTokenProvider.createToken(
                request.getStoreId(), "TABLE", table.getId(), table.getId());

        return new TableLoginResponse(token, request.getStoreId(), table.getId(), table.getTableNumber());
    }

    @Transactional(noRollbackFor = BusinessException.class)
    public AdminLoginResponse loginAdmin(AdminLoginRequest request) {
        Admin admin = adminRepository
                .findByStoreIdAndUsername(request.getStoreId(), request.getUsername())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (admin.isLocked()) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            admin.incrementLoginAttempts();
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        admin.resetLoginAttempts();

        String token = jwtTokenProvider.createToken(
                request.getStoreId(), "ADMIN", admin.getId(), null);

        return new AdminLoginResponse(token, request.getStoreId(), admin.getUsername());
    }

    public TokenResponse refreshToken(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }

        Claims claims = jwtTokenProvider.parseToken(token);
        String newToken = jwtTokenProvider.createToken(
                jwtTokenProvider.getStoreId(claims),
                jwtTokenProvider.getRole(claims),
                jwtTokenProvider.getSubjectId(claims),
                jwtTokenProvider.getTableId(claims)
        );

        return new TokenResponse(newToken);
    }
}
