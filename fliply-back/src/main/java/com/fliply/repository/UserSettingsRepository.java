package com.fliply.repository;

import com.fliply.model.User;
import com.fliply.model.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUser(User user);

    @Query("SELECT s FROM UserSettings s JOIN FETCH s.user WHERE s.whatsappEnabled = true AND s.whatsappTime IS NOT NULL")
    List<UserSettings> findActiveWhatsappSettings();
}
