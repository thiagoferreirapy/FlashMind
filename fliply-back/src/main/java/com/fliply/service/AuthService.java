package com.fliply.service;

import com.fliply.dto.AuthDto;
import com.fliply.dto.UserDto;
import com.fliply.model.User;
import com.fliply.model.UserSettings;
import com.fliply.repository.UserRepository;
import com.fliply.repository.UserSettingsRepository;
import com.fliply.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserSettingsRepository settingsRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       UserSettingsRepository settingsRepository,
                       JwtService jwtService,
                       @Lazy PasswordEncoder passwordEncoder,
                       @Lazy AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.settingsRepository = settingsRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .build();

        user = userRepository.save(user);

        UserSettings settings = UserSettings.builder().user(user).build();
        settingsRepository.save(settings);

        String token = jwtService.generateToken(user);
        return new AuthDto.AuthResponse(token, UserDto.from(user));
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = (User) loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(user);
        return new AuthDto.AuthResponse(token, UserDto.from(user));
    }

    @Transactional
    public void changePassword(User user, String currentPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
