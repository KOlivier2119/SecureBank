package com.securebank.service.impl;

import com.securebank.dto.AccountDTO;
import com.securebank.dto.CreateAccountRequest;
import com.securebank.exception.ResourceNotFoundException;
import com.securebank.model.Account;
import com.securebank.model.User;
import com.securebank.repository.AccountRepository;
import com.securebank.repository.UserRepository;
import com.securebank.service.AccountService;
import com.securebank.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    
    @Override
    public List<AccountDTO> getCurrentUserAccounts() {
        User currentUser = securityUtils.getCurrentUser();
        return accountRepository.findByUserId(currentUser.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public AccountDTO getAccountById(Long id) {
        User currentUser = securityUtils.getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        
        // Security check - users can only access their own accounts
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to access this account");
        }
        
        return mapToDTO(account);
    }
    
    @Override
    @Transactional
    public AccountDTO createAccount(CreateAccountRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        
        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setAccountType(Account.AccountType.valueOf(request.getAccountType()));
        account.setBalance(BigDecimal.ZERO);
        account.setActive(true);
        account.setUser(currentUser);
        
        Account savedAccount = accountRepository.save(account);
        return mapToDTO(savedAccount);
    }
    
    @Override
    @Transactional
    public AccountDTO activateAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        account.setActive(true);
        return mapToDTO(accountRepository.save(account));
    }
    
    @Override
    @Transactional
    public AccountDTO deactivateAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        account.setActive(false);
        return mapToDTO(accountRepository.save(account));
    }
    
    private String generateAccountNumber() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 10);
    }
    
    private AccountDTO mapToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setAccountType(account.getAccountType().name());
        dto.setBalance(account.getBalance());
        dto.setActive(account.isActive());
        dto.setCreatedAt(account.getCreatedAt());
        return dto;
    }
}
