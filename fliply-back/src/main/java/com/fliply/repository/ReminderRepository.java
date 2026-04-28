package com.fliply.repository;

import com.fliply.model.Reminder;
import com.fliply.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByUserOrderByCreatedAtDesc(User user);
    Optional<Reminder> findByIdAndUser(Long id, User user);
    List<Reminder> findByIsActiveTrue();

    @Query("SELECT r FROM Reminder r JOIN FETCH r.user WHERE r.isActive = true AND r.channel = 'in_app'")
    List<Reminder> findActiveInAppRemindersWithUser();
}
