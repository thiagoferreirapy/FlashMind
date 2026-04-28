package com.fliply.repository;

import com.fliply.model.User;
import com.fliply.model.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUser(User user);
}
