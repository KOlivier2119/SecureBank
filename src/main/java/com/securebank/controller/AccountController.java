package com.securebank.controller;

import com.securebank.dto.AccountDTO;
import com.securebank.dto.CreateAccountRequest;
import com.securebank.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    
    private final AccountService accountService;
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AccountDTO>> getCurrentUserAccounts() {
        return ResponseEntity.ok(accountService.getCurrentUserAccounts());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody CreateAccountRequest request) {
        return new ResponseEntity<>(accountService.createAccount(request), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AccountDTO> activateAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.activateAccount(id));
    }
    
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AccountDTO> deactivateAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.deactivateAccount(id));
    }
}
