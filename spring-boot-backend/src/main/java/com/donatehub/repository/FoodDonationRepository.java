package com.donatehub.repository;

import com.donatehub.entity.FoodDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, String> {
    Optional<FoodDonation> findByDonationId(String donationId);
}
