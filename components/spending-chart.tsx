"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { transactionService } from "@/services/transaction-service"
import { accountService } from "@/services/account-service"
import { useToast } from "@/hooks/use-toast"

export function SpendingChart() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([
    { name: "Groceries", amount: 450 },
    { name: "Dining", amount: 300 },
    { name: "Transport", amount: 200 },
    { name: "Shopping", amount: 250 },
    { name: "Utilities", amount: 180 },
    { name: "Entertainment", amount: 120 },
  ])

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Fetch accounts
      const accountsData = await accountService.getUserAccounts()

      // Fetch transactions for all accounts
      const promises = accountsData.map((account) => transactionService.getTransactionsByAccountId(account.id))
      const results = await Promise.all(promises)
      const transactionsData = results.flat()

      // Group transactions by category and calculate total amount
      const categoryMap = new Map()

      transactionsData.forEach((transaction) => {
        if (Number.parseFloat(transaction.amount) < 0) {
          // Only consider expenses (negative amounts)
          const category = transaction.category
          const amount = Math.abs(Number.parseFloat(transaction.amount))

          if (categoryMap.has(category)) {
            categoryMap.set(category, categoryMap.get(category) + amount)
          } else {
            categoryMap.set(category, amount)
          }
        }
      })

      // Convert to chart data format
      const chartData = Array.from(categoryMap.entries())
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount) // Sort by amount (highest first)
        .slice(0, 6) // Take top 6 categories

      if (chartData.length > 0) {
        setData(chartData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      // Keep default data if there's an error
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <Tooltip
            formatter={(value) => [`$${value}`, "Amount"]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "0.375rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            }}
          />
          <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
