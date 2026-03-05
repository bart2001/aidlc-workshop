package com.tableorder.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Common
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다"),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다"),

    // Auth
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증이 필요합니다"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "권한이 없습니다"),
    ACCOUNT_LOCKED(HttpStatus.UNAUTHORIZED, "계정이 잠겨 있습니다"),

    // Store
    STORE_NOT_FOUND(HttpStatus.NOT_FOUND, "매장을 찾을 수 없습니다"),

    // Menu
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "카테고리를 찾을 수 없습니다"),
    MENU_NOT_FOUND(HttpStatus.NOT_FOUND, "메뉴를 찾을 수 없습니다"),
    CATEGORY_HAS_MENU(HttpStatus.CONFLICT, "메뉴가 있는 카테고리는 삭제할 수 없습니다"),

    // Table
    TABLE_NOT_FOUND(HttpStatus.NOT_FOUND, "테이블을 찾을 수 없습니다"),
    SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "활성 세션을 찾을 수 없습니다"),

    // Order
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다"),
    INVALID_ORDER_STATUS(HttpStatus.CONFLICT, "허용되지 않는 상태 변경입니다"),
    ORDER_NUMBER_GENERATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "주문번호 생성에 실패했습니다");

    private final HttpStatus status;
    private final String message;
}
