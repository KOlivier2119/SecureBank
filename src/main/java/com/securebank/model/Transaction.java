package com.securebank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String referenceNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column
    private String category;
    
    @Column
    private String merchantName;
    
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
    
    @ManyToOne
    @JoinColumn(name = "destination_account_id")
    private Account destinationAccount;
    
    @Column(nullable = false)
    private TransactionStatus status = TransactionStatus.COMPLETED;
    
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
    
    public enum TransactionType {
        DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT
    }
    
    public enum TransactionStatus {
        PENDING, COMPLETED, FAILED, REVERSED
    }
}
