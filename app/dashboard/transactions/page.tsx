"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownLeft, ArrowUpRight, CreditCard, Download, Filter, Search, ShoppingBag } from "lucide-react"
import { transactionService } from "@/services/transaction-service"
import { accountService } from "@/services/account-service"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function TransactionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [transactionType, setTransactionType] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [selectedAccount, transactionType, dateRange])

  const fetchAccounts = async () => {
    try {
      const accountsData = await accountService.getUserAccounts()
      setAccounts(accountsData)
      fetchTransactions()
    } catch (error) {
      console.error("Error fetching accounts:", error)
      toast({
        title: "Error",
        description: "Failed to load account information",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      let transactionsData = []

      if (selectedAccount === "all") {
        // Fetch transactions for all accounts
        const promises = accounts.map((account) => transactionService.getTransactionsByAccountId(account.id))
        const results = await Promise.all(promises)
        transactionsData = results.flat()
      } else {
        // Fetch transactions for selected account
        transactionsData = await transactionService.getTransactionsByAccountId(selectedAccount)
      }

      // Apply filters
      let filteredTransactions = transactionsData

      if (transactionType !== "all") {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.type === transactionType)
      }

      if (dateRange !== "all") {
        const now = new Date()
        const startDate = new Date()

        if (dateRange === "today") {
          startDate.setHours(0, 0, 0, 0)
        } else if (dateRange === "week") {
          startDate.setDate(now.getDate() - 7)
        } else if (dateRange === "month") {
          startDate.setMonth(now.getMonth() - 1)
        } else if (dateRange === "year") {
          startDate.setFullYear(now.getFullYear() - 1)
        }

        filteredTransactions = filteredTransactions.filter(
          (transaction) => new Date(transaction.timestamp) >= startDate,
        )
      }

      setTransactions(filteredTransactions)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transaction data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Filter transactions based on search query
    if (searchQuery.trim() === "") {
      fetchTransactions()
      return
    }

    const filtered = transactions.filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.merchantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setTransactions(filtered)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
      case "WITHDRAWAL":
        return <ArrowUpRight className="h-5 w-5 text-red-600" />
      case "PAYMENT":
        return <ShoppingBag className="h-5 w-5 text-blue-600" />
      case "TRANSFER":
        return <CreditCard className="h-5 w-5 text-purple-600" />
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-gray-600">View and manage all your account transactions</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">Account</label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="All Accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()} -{" "}
                      {account.accountNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">Transaction Type</label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="DEPOSIT">Deposits</SelectItem>
                  <SelectItem value="WITHDRAWAL">Withdrawals</SelectItem>
                  <SelectItem value="PAYMENT">Payments</SelectItem>
                  <SelectItem value="TRANSFER">Transfers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline" className="shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>{transactions.length} transactions found</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Try adjusting your search or filters" : "You don't have any transactions yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Account</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    const account = accounts.find((a) => a.id === transaction.accountId)

                    return (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full p-2 bg-gray-100">{getTransactionIcon(transaction.type)}</div>
                            <div className="text-sm">{formatDate(transaction.timestamp)}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium">{transaction.description}</div>
                          {transaction.merchantName && (
                            <div className="text-sm text-gray-500">{transaction.merchantName}</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100">
                            {transaction.category}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            {account
                              ? `${account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()} - ${account.accountNumber}`
                              : "Unknown Account"}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div
                            className={`font-medium ${Number.parseFloat(transaction.amount) >= 0 ? "text-emerald-600" : "text-gray-900"}`}
                          >
                            {formatCurrency(Number.parseFloat(transaction.amount))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              transaction.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : transaction.status === "FAILED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {transaction.status}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
