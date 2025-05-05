// Mock account service for demo purposes
// In a real application, this would make API calls to your backend

interface CreateAccountRequest {
  accountType: string
}

class AccountService {
  // Mock accounts data
  private mockAccounts = [
    {
      id: "1",
      accountNumber: "1234567890",
      accountType: "CHECKING",
      balance: 12456.78,
      active: true,
      createdAt: "2023-01-15T10:30:00Z",
      userId: "1",
    },
    {
      id: "2",
      accountNumber: "0987654321",
      accountType: "SAVINGS",
      balance: 34892.45,
      active: true,
      createdAt: "2023-02-20T14:45:00Z",
      userId: "1",
    },
    {
      id: "3",
      accountNumber: "5678901234",
      accountType: "CREDIT",
      balance: 1543.67,
      active: true,
      createdAt: "2023-03-10T09:15:00Z",
      userId: "1",
    },
  ]

  async getUserAccounts(): Promise<any[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, you would filter by the current user's ID
    // Here we just return all mock accounts
    return [...this.mockAccounts]
  }

  async getAccountById(id: string): Promise<any> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const account = this.mockAccounts.find((a) => a.id === id)

    if (!account) {
      throw new Error("Account not found")
    }

    return { ...account }
  }

  async createAccount(request: CreateAccountRequest): Promise<any> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate a random account number
    const accountNumber = Math.floor(Math.random() * 9000000000 + 1000000000).toString()

    // Create new account
    const newAccount = {
      id: (this.mockAccounts.length + 1).toString(),
      accountNumber,
      accountType: request.accountType,
      balance: 0,
      active: true,
      createdAt: new Date().toISOString(),
      userId: "1", // In a real app, this would be the current user's ID
    }

    // Add to mock accounts
    this.mockAccounts.push(newAccount)

    return { ...newAccount }
  }

  async activateAccount(id: string): Promise<any> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const accountIndex = this.mockAccounts.findIndex((a) => a.id === id)

    if (accountIndex === -1) {
      throw new Error("Account not found")
    }

    this.mockAccounts[accountIndex].active = true

    return { ...this.mockAccounts[accountIndex] }
  }

  async deactivateAccount(id: string): Promise<any> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const accountIndex = this.mockAccounts.findIndex((a) => a.id === id)

    if (accountIndex === -1) {
      throw new Error("Account not found")
    }

    this.mockAccounts[accountIndex].active = false

    return { ...this.mockAccounts[accountIndex] }
  }

  async updateAccountBalance(id: string, amount: number): Promise<any> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const accountIndex = this.mockAccounts.findIndex((a) => a.id === id)

    if (accountIndex === -1) {
      throw new Error("Account not found")
    }

    this.mockAccounts[accountIndex].balance += amount

    return { ...this.mockAccounts[accountIndex] }
  }
}

export const accountService = new AccountService()
