package com.securebank.controller;

import com.securebank.dto.*;
import com.securebank.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @GetMapping("/account/{accountId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByAccountId(
            @PathVariable Long accountId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return ResponseEntity.ok(transactionService.getTransactionsByAccountId(accountId, page, size));
    }
    
    @PostMapping("/deposit")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TransactionDTO> deposit(@RequestBody DepositRequest request) {
        return new ResponseEntity<>(transactionService.deposit(request), HttpStatus.CREATED);
    }
    
    @PostMapping("/withdraw")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TransactionDTO> withdraw(@RequestBody WithdrawRequest request) {
        return new ResponseEntity<>(transactionService.withdraw(request), HttpStatus.CREATED);
    }
    
    @PostMapping("/transfer")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TransactionDTO> transfer(@RequestBody TransferRequest request) {
        return new ResponseEntity<>(transactionService.transfer(request), HttpStatus.CREATED);
    }
    
    @PostMapping("/payment")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TransactionDTO> payment(@RequestBody PaymentRequest request) {
        return new ResponseEntity<>(transactionService.payment(request), HttpStatus.CREATED);
    }
}
