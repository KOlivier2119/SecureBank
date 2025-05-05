// Mock transaction service for demo purposes
// In a real application, this would make API calls to your backend

import { accountService } from "./account-service"

interface DepositRequest {
  accountId: string
  amount: number
  description: string
  merchantName?: string
}

interface WithdrawRequest {
  accountId: string
  amount: number
  description: string
}

interface TransferRequest {
  sourceAccountId: string
  destinationAccountId: string
  amount: number
  description: string
}

interface PaymentRequest {
  accountId: string
  amount: number
  description: string
  merchantName: string
  category: string
}

class TransactionService {
  // Mock transactions data
  private mockTransactions = [
    {
      id: "1",
      referenceNumber: "TXN123456789",
      type: "DEPOSIT",
      amount: 2500,
      description: "Salary Deposit",
      category: "Income",
      merchantName: "Acme Corp",
      timestamp: "2023-05-01T09:15:00Z",
      status: "COMPLETED",
      accountId: "1",
    },
    {
      id: "2",
      referenceNumber: "TXN987654321",
      type: "PAYMENT",
      amount: -85.45,
      description: "Grocery Shopping",
      category: "Food & Dining",
      merchantName: "Whole Foods",
      timestamp: "2023-05-02T14:34:00Z",
      status: "COMPLETED",
      accountId: "1",
    },
    {
      id: "3",
      referenceNumber: "TXN456789123",
      type: "PAYMENT",
      amount: -12.99,
      description: "Netflix Subscription",
      category: "Entertainment",
      merchantName: "Netflix",
      timestamp: "2023-05-03T10:00:00Z",
      status: "COMPLETED",
      accountId: "1",
    },
    {
      id: "4",
      referenceNumber: "TXN789123456",
      type: "TRANSFER",
      amount: -500,
      description: "Transfer to Savings",
      category: "Transfer",
      timestamp: "2023-05-04T16:45:00Z",
      status: "COMPLETED",
      accountId: "1",
      destinationAccountId: "2",
    },
  ]

  private generateReferenceNumber(): string {
    return "TXN" + Math.random().toString(36).substring(2, 15).toUpperCase()
  }

  async getTransactionsByAccountId(accountId: string, page?: number, size?: number): Promise<any[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Filter transactions by account ID
    let transactions = this.mockTransactions.filter((t) => t.accountId === accountId)

    // Sort by timestamp (newest first)
    transactions = transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply pagination if provided
    if (page !== undefined && size !== undefined) {
      const start = page * size
      const end = start + size
      transactions = transactions.slice(start, end)
    }

    return [...transactions]
  }

  async deposit(request: DepositRequest): Promise<any> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Validate amount
    if (request.amount <= 0) {
      throw new Error("Deposit amount must be positive")
    }

    // Create new transaction
    const newTransaction = {
      id: (this.mockTransactions.length + 1).toString(),
      referenceNumber: this.generateReferenceNumber(),
      type: "DEPOSIT",
      amount: request.amount,
      description: request.description,
      category: "Income",
      merchantName: request.merchantName,
      timestamp: new Date().toISOString(),
      status: "COMPLETED",
      accountId: request.accountId,
    }

    // Add to mock transactions
    this.mockTransactions.push(newTransaction)

    // Update account balance
    await accountService.updateAccountBalance(request.accountId, request.amount)

    return { ...newTransaction }
  }

  async withdraw(request: WithdrawRequest): Promise<any> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Validate amount
    if (request.amount <= 0) {
      throw new Error("Withdrawal amount must be positive")
    }

    // Get account to check balance
    const account = await accountService.getAccountById(request.accountId)

    // Check sufficient funds
    if (account.balance < request.amount) {
      throw new Error("Insufficient funds for withdrawal")
    }

    // Create new transaction
    const newTransaction = {
      id: (this.mockTransactions.length + 1).toString(),
      referenceNumber: this.generateReferenceNumber(),
      type: "WITHDRAWAL",
      amount: -request.amount, // Negative amount for withdrawal
      description: request.description,
      category: "Withdrawal",
      timestamp: new Date().toISOString(),
      status: "COMPLETED",
      accountId: request.accountId,
    }

    // Add to mock transactions
    this.mockTransactions.push(newTransaction)

    // Update account balance
    await accountService.updateAccountBalance(request.accountId, -request.amount)

    return { ...newTransaction }
  }

  async transfer(request: TransferRequest): Promise<any> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Validate amount
    if (request.amount <= 0) {
      throw new Error("Transfer amount must be positive")
    }

    // Validate accounts are different
    if (request.sourceAccountId === request.destinationAccountId) {
      throw new Error("Source and destination accounts cannot be the same")
    }

    // Get source account to check balance
    const sourceAccount = await accountService.getAccountById(request.sourceAccountId)

    // Check sufficient funds
    if (sourceAccount.balance < request.amount) {
      throw new Error("Insufficient funds for transfer")
    }

    // Create new transaction
    const newTransaction = {
      id: (this.mockTransactions.length + 1).toString(),
      referenceNumber: this.generateReferenceNumber(),
      type: "TRANSFER",
      amount: -request.amount, // Negative amount for source account
      description: request.description,
      category: "Transfer",
      timestamp: new Date().toISOString(),
      status: "COMPLETED",
      accountId: request.sourceAccountId,
      destinationAccountId: request.destinationAccountId,
    }

    // Add to mock transactions
    this.mockTransactions.push(newTransaction)

    // Update account balances
    await accountService.updateAccountBalance(request.sourceAccountId, -request.amount)
    await accountService.updateAccountBalance(request.destinationAccountId, request.amount)

    return { ...newTransaction }
  }

  async payment(request: PaymentRequest): Promise<any> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Validate amount
    if (request.amount <= 0) {
      throw new Error("Payment amount must be positive")
    }

    // Get account to check balance
    const account = await accountService.getAccountById(request.accountId)

    // Check sufficient funds
    if (account.balance < request.amount) {
      throw new Error("Insufficient funds for payment")
    }

    // Create new transaction
    const newTransaction = {
      id: (this.mockTransactions.length + 1).toString(),
      referenceNumber: this.generateReferenceNumber(),
      type: "PAYMENT",
      amount: -request.amount, // Negative amount for payment
      description: request.description,
      category: request.category,
      merchantName: request.merchantName,
      timestamp: new Date().toISOString(),
      status: "COMPLETED",
      accountId: request.accountId,
    }

    // Add to mock transactions
    this.mockTransactions.push(newTransaction)

    // Update account balance
    await accountService.updateAccountBalance(request.accountId, -request.amount)

    return { ...newTransaction }
  }
}

export const transactionService = new TransactionService()
