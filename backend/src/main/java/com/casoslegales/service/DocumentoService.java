package com.casoslegales.service;

import com.casoslegales.dto.*;
import com.casoslegales.model.*;
import com.casoslegales.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final CasoRepository casoRepository;
    private final UserRepository userRepository;
    private final Path uploadDir;

    public DocumentoService(DocumentoRepository documentoRepository,
                            CasoRepository casoRepository,
                            UserRepository userRepository,
                            @Value("${app.upload-dir:uploads}") String uploadDir) {
        this.documentoRepository = documentoRepository;
        this.casoRepository = casoRepository;
        this.userRepository = userRepository;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear carpeta de uploads");
        }
    }

    public List<DocumentoResponse> listByCaso(Long casoId) {
        return documentoRepository.findByCasoIdOrderByIdDesc(casoId).stream()
                .map(this::toResponse).toList();
    }

    public DocumentoResponse upload(Long casoId, String nombre, MultipartFile file, String email) {
        Caso caso = casoRepository.findById(casoId)
                .orElseThrow(() -> new RuntimeException("Caso no encontrado"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String extension = getExtension(file.getOriginalFilename());
        String storedName = UUID.randomUUID() + "." + extension;
        Path target = uploadDir.resolve("caso-" + casoId).resolve(storedName);

        try {
            Files.createDirectories(target.getParent());
            Files.copy(file.getInputStream(), target);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo");
        }

        Documento doc = new Documento();
        doc.setNombre(nombre);
        doc.setRutaArchivo(target.toString());
        doc.setTipoArchivo(extension);
        doc.setTamanoArchivo(file.getSize());
        doc.setCaso(caso);
        doc.setUser(user);

        return toResponse(documentoRepository.save(doc));
    }

    public Resource download(Long id) {
        Documento doc = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        try {
            Path path = Paths.get(doc.getRutaArchivo());
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists()) throw new RuntimeException("Archivo no encontrado");
            return resource;
        } catch (Exception e) {
            throw new RuntimeException("No se pudo descargar el archivo");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "bin";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    private DocumentoResponse toResponse(Documento d) {
        return new DocumentoResponse(d.getId(), d.getNombre(), d.getTipoArchivo(),
                d.getTamanoArchivo(), d.getCaso().getId());
    }
}
