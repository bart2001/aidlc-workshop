package com.tableorder.auth.controller;

import com.tableorder.auth.dto.*;
import com.tableorder.auth.service.AuthService;
import com.tableorder.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/table/login")
    public ResponseEntity<ApiResponse<TableLoginResponse>> loginTable(
            @Valid @RequestBody TableLoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.loginTable(request)));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AdminLoginResponse>> loginAdmin(
            @Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.loginAdmin(request)));
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refreshToken(
            @RequestHeader("Authorization") String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        return ResponseEntity.ok(ApiResponse.ok(authService.refreshToken(token)));
    }
}
