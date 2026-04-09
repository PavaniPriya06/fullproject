package com.donatehub.repository;

import com.donatehub.entity.Donation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, String> {
    Page<Donation> findByUserId(String userId, Pageable pageable);
    Page<Donation> findByStatus(Donation.DonationStatus status, Pageable pageable);
    List<Donation> findByUserId(String userId);
    Long countByUserId(String userId);
}
