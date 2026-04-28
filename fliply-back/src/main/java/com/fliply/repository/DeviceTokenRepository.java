package com.fliply.repository;

import com.fliply.model.DeviceToken;
import com.fliply.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {

    List<DeviceToken> findByUserAndActiveTrue(User user);

    Optional<DeviceToken> findByToken(String token);

    Optional<DeviceToken> findByUserAndToken(User user, String token);

    @Query("SELECT dt FROM DeviceToken dt WHERE dt.user = :user AND dt.active = true")
    List<DeviceToken> findActiveByUser(User user);

    @Modifying
    @Query("UPDATE DeviceToken dt SET dt.active = false WHERE dt.token = :token")
    void deactivateByToken(String token);

    @Modifying
    @Query("UPDATE DeviceToken dt SET dt.active = false WHERE dt.user = :user")
    void deactivateAllByUser(User user);
}
