package com.securebank.service.impl;

import com.securebank.dto.*;
import com.securebank.exception.InsufficientFundsException;
import com.securebank.exception.ResourceNotFoundException;
import com.securebank.model.Account;
import com.securebank.model.Transaction;
import com.securebank.model.User;
import com.securebank.repository.AccountRepository;
import com.securebank.repository.TransactionRepository;
import com.securebank.service.TransactionService;
import com.securebank.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final SecurityUtils securityUtils;
    
    @Override
    public List<TransactionDTO> getTransactionsByAccountId(Long accountId, Integer page, Integer size) {
        User currentUser = securityUtils.getCurrentUser();
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));
        
        // Security check - users can only access their own accounts' transactions
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to access transactions for this account");
        }
        
        Pageable pageable = PageRequest.of(
                page != null ? page : 0,
                size != null ? size : 20,
                Sort.by("timestamp").descending()
        );
        
        return transactionRepository.findByAccountId(accountId, pageable).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public TransactionDTO deposit(DepositRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));
        
        // Security check
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to deposit to this account");
        }
        
        // Validate amount
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        
        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setType(Transaction.TransactionType.DEPOSIT);
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setCategory("Deposit");
        transaction.setMerchantName(request.getMerchantName());
        transaction.setAccount(account);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        // Update account balance
        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public TransactionDTO withdraw(WithdrawRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));
        
        // Security check
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to withdraw from this account");
        }
        
        // Validate amount
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        
        // Check sufficient funds
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds for withdrawal");
        }
        
        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setReferenceNumber(generateReferenceNumber());
        transaction.setType(Transaction.TransactionType.WITHDRAWAL);
        transaction.setAmount(request.getAmount().negate());
        transaction.setDescription(request.getDescription());
