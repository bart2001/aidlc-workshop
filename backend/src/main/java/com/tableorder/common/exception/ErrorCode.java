package com.tableorder.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Auth
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "AUTH_001", "잘못된 인증 정보입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH_001", "잘못된 인증 정보입니다."),
    ACCOUNT_LOCKED(HttpStatus.FORBIDDEN, "AUTH_002", "계정이 잠겼습니다. 잠시 후 다시 시도해주세요."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH_003", "유효하지 않은 토큰입니다."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH_004", "토큰이 만료되었습니다."),

    // Store
    STORE_NOT_FOUND(HttpStatus.NOT_FOUND, "STORE_001", "매장을 찾을 수 없습니다."),

    // Table
    TABLE_NOT_FOUND(HttpStatus.NOT_FOUND, "TABLE_001", "테이블을 찾을 수 없습니다."),
    TABLE_NUMBER_DUPLICATE(HttpStatus.CONFLICT, "TABLE_002", "이미 존재하는 테이블 번호입니다."),
    SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "TABLE_003", "활성 세션을 찾을 수 없습니다."),

    // Menu
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "MENU_001", "카테고리를 찾을 수 없습니다."),
    MENU_NOT_FOUND(HttpStatus.NOT_FOUND, "MENU_002", "메뉴를 찾을 수 없습니다."),
    CATEGORY_HAS_MENUS(HttpStatus.CONFLICT, "MENU_003", "메뉴가 있는 카테고리는 삭제할 수 없습니다."),
    CATEGORY_HAS_MENU(HttpStatus.CONFLICT, "MENU_003", "메뉴가 있는 카테고리는 삭제할 수 없습니다."),

    // Order
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "ORDER_001", "주문을 찾을 수 없습니다."),
    INVALID_ORDER_STATUS_TRANSITION(HttpStatus.BAD_REQUEST, "ORDER_002", "허용되지 않는 상태 변경입니다."),
    INVALID_ORDER_STATUS(HttpStatus.BAD_REQUEST, "ORDER_002", "허용되지 않는 상태 변경입니다."),
    ORDER_NUMBER_CONFLICT(HttpStatus.CONFLICT, "ORDER_003", "주문번호 생성에 실패했습니다. 다시 시도해주세요."),
    ORDER_NUMBER_GENERATION_FAILED(HttpStatus.CONFLICT, "ORDER_003", "주문번호 생성에 실패했습니다. 다시 시도해주세요."),

    // Common
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "COMMON_001", "잘못된 입력값입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "COMMON_002", "접근 권한이 없습니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON_002", "접근 권한이 없습니다."),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_003", "서버 내부 오류가 발생했습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
