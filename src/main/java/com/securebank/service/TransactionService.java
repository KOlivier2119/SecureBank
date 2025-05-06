package com.securebank.service;

import com.securebank.dto.*;
import java.util.List;

public interface TransactionService {
    List<TransactionDTO> getTransactionsByAccountId(Long accountId, Integer page, Integer size);
    TransactionDTO deposit(DepositRequest request);
    TransactionDTO withdraw(WithdrawRequest request);
    TransactionDTO transfer(TransferRequest request);
    TransactionDTO payment(PaymentRequest request);
    TransactionDTO getTransactionById(Long transactionId);
}