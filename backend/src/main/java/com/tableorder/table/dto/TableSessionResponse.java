package com.tableorder.table.dto;

import com.tableorder.table.entity.TableSession;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TableSessionResponse {
    private Long id;
    private boolean active;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    public static TableSessionResponse from(TableSession s) {
        return new TableSessionResponse(s.getId(), s.isActive(), s.getStartedAt(), s.getEndedAt());
    }
}
