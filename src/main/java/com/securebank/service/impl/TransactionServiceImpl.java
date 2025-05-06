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
        transaction.setCategory("Withdrawal");
        transaction.setMerchantName(request.getMerchantName());
        transaction.setAccount(account);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        // Update account balance
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToDTO(savedTransaction);
    }
    
    @Override
    @Transactional
    public TransactionDTO transfer(TransferRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        
        // Get source account
        Account sourceAccount = accountRepository.findById(request.getSourceAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Source account not found with id: " + request.getSourceAccountId()));
        
        // Security check for source account
        if (!sourceAccount.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to transfer from this account");
        }
        
        // Get destination account
        Account destinationAccount = accountRepository.findById(request.getDestinationAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination account not found with id: " + request.getDestinationAccountId()));
        
        // Validate amount
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }
        
        // Check sufficient funds
        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds for transfer");
        }
        
        // Create withdrawal transaction
        Transaction withdrawalTransaction = new Transaction();
        withdrawalTransaction.setReferenceNumber(generateReferenceNumber());
        withdrawalTransaction.setType(Transaction.TransactionType.TRANSFER_OUT);
        withdrawalTransaction.setAmount(request.getAmount().negate());
        withdrawalTransaction.setDescription(request.getDescription());
        withdrawalTransaction.setCategory("Transfer");
        withdrawalTransaction.setMerchantName("Internal Transfer");
        withdrawalTransaction.setAccount(sourceAccount);
        withdrawalTransaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        // Create deposit transaction
        Transaction depositTransaction = new Transaction();
        depositTransaction.setReferenceNumber(generateReferenceNumber());
        depositTransaction.setType(Transaction.TransactionType.TRANSFER_IN);
        depositTransaction.setAmount(request.getAmount());
        depositTransaction.setDescription(request.getDescription());
        depositTransaction.setCategory("Transfer");
        depositTransaction.setMerchantName("Internal Transfer");
        depositTransaction.setAccount(destinationAccount);
        depositTransaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        // Update account balances
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));
        
        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);
        
        transactionRepository.save(depositTransaction);
        Transaction savedTransaction = transactionRepository.save(withdrawalTransaction);
        
        return mapToDTO(savedTransaction);
    }
    
    @Override
    public TransactionDTO getTransactionById(Long transactionId) {
        User currentUser = securityUtils.getCurrentUser();
        
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));
        
        // Security check - users can only access their own transactions
        if (!transaction.getAccount().getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to access this transaction");
        }
        
        return mapToDTO(transaction);
    }
    
    private TransactionDTO mapToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setReferenceNumber(transaction.getReferenceNumber());
        dto.setType(transaction.getType().name());
        dto.setAmount(transaction.getAmount());
        dto.setDescription(transaction.getDescription());
        dto.setCategory(transaction.getCategory());
        dto.setMerchantName(transaction.getMerchantName());
        dto.setTimestamp(transaction.getTimestamp());
        dto.setStatus(transaction.getStatus().name());
        dto.setAccountId(transaction.getAccount().getId());
        return dto;
    }
    
    private String generateReferenceNumber() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}