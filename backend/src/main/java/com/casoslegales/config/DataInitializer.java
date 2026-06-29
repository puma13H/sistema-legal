package com.casoslegales.config;

import com.casoslegales.model.*;
import com.casoslegales.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final AbogadoRepository abogadoRepository;
    private final ClienteRepository clienteRepository;
    private final CasoRepository casoRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           AbogadoRepository abogadoRepository,
                           ClienteRepository clienteRepository,
                           CasoRepository casoRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.abogadoRepository = abogadoRepository;
        this.clienteRepository = clienteRepository;
        this.casoRepository = casoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role adminRole = ensureRole("admin", "Administrador");
        Role abogadoRole = ensureRole("abogado", "Abogado");
        Role clienteRole = ensureRole("cliente", "Cliente");

        User adminUser = ensureUser("Administrador", "admin@casoslegales.com", "admin123", adminRole);
        User abogadoUser = ensureUser("Juan Pérez", "abogado@casoslegales.com", "abogado123", abogadoRole);
        User clienteUser = ensureUser("María García", "cliente@casoslegales.com", "cliente123", clienteRole);

        ensureAbogado(abogadoUser);
        ensureCliente(clienteUser);
        ensureCasoDemo();
    }

    private Role ensureRole(String name, String displayName) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role role = new Role();
            role.setName(name);
            role.setDisplayName(displayName);
            return roleRepository.save(role);
        });
    }

    private User ensureUser(String name, String email, String password, Role role) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return userRepository.save(user);
    }

    private void ensureAbogado(User abogadoUser) {
        abogadoRepository.findByUserId(abogadoUser.getId()).orElseGet(() -> {
            Abogado abogado = new Abogado();
            abogado.setNombre("Juan Pérez");
            abogado.setEmail("abogado@casoslegales.com");
            abogado.setTelefono("999888777");
            abogado.setEspecialidad("Penal");
            abogado.setUser(abogadoUser);
            return abogadoRepository.save(abogado);
        });
    }

    private void ensureCliente(User clienteUser) {
        clienteRepository.findByUserId(clienteUser.getId()).orElseGet(() -> {
            Cliente cliente = new Cliente();
            cliente.setNombre("María García");
            cliente.setEmail("cliente@casoslegales.com");
            cliente.setTelefono("999111222");
            cliente.setUser(clienteUser);
            return clienteRepository.save(cliente);
        });
    }

    private void ensureCasoDemo() {
        if (casoRepository.count() > 0) return;

        Abogado abogado = abogadoRepository.findByUserId(
                userRepository.findByEmail("abogado@casoslegales.com").orElseThrow().getId()
        ).orElseThrow();
        Cliente cliente = clienteRepository.findByUserId(
                userRepository.findByEmail("cliente@casoslegales.com").orElseThrow().getId()
        ).orElseThrow();

        Caso caso = new Caso();
        caso.setNombreCaso("Demanda por incumplimiento contractual");
        caso.setCliente(cliente);
        caso.setAbogado(abogado);
        caso.setEstado("En trámite");
        caso.setFechaApertura(java.time.LocalDate.now());
        caso.setDescripcion("Caso de prueba");
        caso.setTarifa(new java.math.BigDecimal("1500.00"));
        casoRepository.save(caso);
    }
}
