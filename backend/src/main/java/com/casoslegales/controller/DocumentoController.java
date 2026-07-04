package com.casoslegales.controller;

import com.casoslegales.dto.*;
import com.casoslegales.service.DocumentoService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    private final DocumentoService documentoService;

    public DocumentoController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @GetMapping("/caso/{casoId}")
    public ResponseEntity<List<DocumentoResponse>> listByCaso(@PathVariable Long casoId) {
        return ResponseEntity.ok(documentoService.listByCaso(casoId));
    }

    @PostMapping(value = "/caso/{casoId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentoResponse> upload(@PathVariable Long casoId,
                                                      @RequestParam String nombre,
                                                      @RequestParam MultipartFile archivo,
                                                      Authentication auth) {
        return ResponseEntity.ok(documentoService.upload(casoId, nombre, archivo, auth.getName()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Resource resource = documentoService.download(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
