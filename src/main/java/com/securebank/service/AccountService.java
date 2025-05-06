package banking.system.src.main.java.com.securebank.service;

import com.securebank.dto.AccountDTO;
import com.securebank.dto.CreateAccountRequest;
import java.util.List;

public interface AccountService {
    List<AccountDTO> getCurrentUserAccounts();
    AccountDTO getAccountById(Long id);
    AccountDTO createAccount(CreateAccountRequest request);
    AccountDTO activateAccount(Long id);
    AccountDTO deactivateAccount(Long id);
}