package com.casoslegales.controller;

import com.casoslegales.dto.CasoRequest;
import com.casoslegales.dto.CasoResponse;
import com.casoslegales.service.CasoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/casos")
@CrossOrigin(origins = "http://localhost:4200")
public class CasoController {

    private final CasoService casoService;

    public CasoController(CasoService casoService) {
        this.casoService = casoService;
    }

    @GetMapping
    public ResponseEntity<List<CasoResponse>> list(Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        return ResponseEntity.ok(casoService.listForUser(auth.getName(), role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CasoResponse> get(@PathVariable Long id, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        return ResponseEntity.ok(casoService.getById(id, auth.getName(), role));
    }

    @PostMapping
    public ResponseEntity<CasoResponse> create(@Valid @RequestBody CasoRequest request, Authentication auth) {
        return ResponseEntity.ok(casoService.create(request, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CasoResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody CasoRequest request,
                                               Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        return ResponseEntity.ok(casoService.update(id, request, auth.getName(), role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        casoService.delete(id, auth.getName(), role);
        return ResponseEntity.noContent().build();
    }
}
