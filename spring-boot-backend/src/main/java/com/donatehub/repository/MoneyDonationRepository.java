package com.donatehub.repository;

import com.donatehub.entity.MoneyDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MoneyDonationRepository extends JpaRepository<MoneyDonation, String> {
    Optional<MoneyDonation> findByDonationId(String donationId);
    Optional<MoneyDonation> findByTransactionId(String transactionId);
}
