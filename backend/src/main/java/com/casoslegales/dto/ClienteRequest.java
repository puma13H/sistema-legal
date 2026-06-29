package com.casoslegales.dto;

public record ClienteRequest(
        String nombre,
        String telefono,
        String email,
        String direccion
) {}
