package com.casoslegales.controller;

import com.casoslegales.dto.DashboardResponse;
import com.casoslegales.service.AgendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final AgendaService agendaService;

    public DashboardController(AgendaService agendaService) {
        this.agendaService = agendaService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('admin','abogado','cliente')")
    public ResponseEntity<DashboardResponse> stats() {
        return ResponseEntity.ok(agendaService.dashboard());
    }
}
