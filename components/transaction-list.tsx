"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, CreditCard, ShoppingBag } from "lucide-react"
import { transactionService } from "@/services/transaction-service"
import { accountService } from "@/services/account-service"
import { useToast } from "@/hooks/use-toast"

interface TransactionListProps {
  limit?: number
  accountId?: string
}

export function TransactionList({ limit, accountId }: TransactionListProps) {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [accountId, limit])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Fetch accounts first
      const accountsData = await accountService.getUserAccounts()
      setAccounts(accountsData)

      // Then fetch transactions
      let transactionsData = []

      if (accountId) {
        transactionsData = await transactionService.getTransactionsByAccountId(accountId)
      } else {
        // Fetch transactions for all accounts
        const promises = accountsData.map((account) => transactionService.getTransactionsByAccountId(account.id))
        const results = await Promise.all(promises)
        transactionsData = results.flat()
      }

      // Sort by timestamp (newest first)
      transactionsData.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      // Apply limit if specified
      if (limit && limit > 0) {
        transactionsData = transactionsData.slice(0, limit)
      }

      setTransactions(transactionsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load transaction data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const account = accounts.find((a) => a.id === transaction.accountId)

        return (
          <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-2 bg-gray-100">
                {transaction.type === "DEPOSIT" ? (
                  <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                ) : transaction.type === "WITHDRAWAL" ? (
                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                ) : transaction.type === "PAYMENT" ? (
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                ) : (
                  <CreditCard className="h-5 w-5 text-purple-600" />
                )}
              </div>
              <div>
                <div className="font-medium">{transaction.description}</div>
                <div className="text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleDateString()} •
                  {account ? ` ${account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}` : ""}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${Number.parseFloat(transaction.amount) >= 0 ? "text-emerald-600" : ""}`}>
                {Number.parseFloat(transaction.amount) >= 0 ? "+" : ""}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Number.parseFloat(transaction.amount))}
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                {transaction.category}
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}
