package com.tableorder.common.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JwtAuthentication {

    private Long subjectId;
    private Long storeId;
    private Long tableId;
    private String role;
}
