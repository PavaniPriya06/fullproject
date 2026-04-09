package com.donatehub.repository;

import com.donatehub.entity.ApparelDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApparelDonationRepository extends JpaRepository<ApparelDonation, String> {
    Optional<ApparelDonation> findByDonationId(String donationId);
}
