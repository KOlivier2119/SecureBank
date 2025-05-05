"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { accountService } from "@/services/account-service"
import { transactionService } from "@/services/transaction-service"
import { useToast } from "@/hooks/use-toast"

export function AccountSummary() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [budgetData, setBudgetData] = useState({
    foodAndDining: { spent: 350, budget: 500 },
    entertainment: { spent: 120, budget: 200 },
    transportation: { spent: 180, budget: 300 },
    shopping: { spent: 450, budget: 400 },
  })
  const [savingsGoals, setSavingsGoals] = useState({
    vacation: { saved: 2500, goal: 5000 },
    emergency: { saved: 8000, goal: 10000 },
    newCar: { saved: 12000, goal: 25000 },
  })
  const [creditScore, setCreditScore] = useState(765)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Fetch accounts
      const accountsData = await accountService.getUserAccounts()
      setAccounts(accountsData)

      // Fetch transactions for all accounts
      const promises = accountsData.map((account) => transactionService.getTransactionsByAccountId(account.id))
      const results = await Promise.all(promises)
      const transactionsData = results.flat()
      setTransactions(transactionsData)

      // Calculate budget data based on transactions
      // This is a simplified example - in a real app, you would do more sophisticated analysis
      const foodTransactions = transactionsData.filter(
        (t) => t.category === "Food & Dining" || t.category === "Groceries" || t.category === "Restaurants",
      )
      const entertainmentTransactions = transactionsData.filter(
        (t) => t.category === "Entertainment" || t.category === "Movies" || t.category === "Games",
      )
      const transportationTransactions = transactionsData.filter(
        (t) => t.category === "Transportation" || t.category === "Gas" || t.category === "Auto",
      )
      const shoppingTransactions = transactionsData.filter(
        (t) => t.category === "Shopping" || t.category === "Clothing" || t.category === "Electronics",
      )

      const foodSpent = Math.abs(foodTransactions.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0))
      const entertainmentSpent = Math.abs(
        entertainmentTransactions.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0),
      )
      const transportationSpent = Math.abs(
        transportationTransactions.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0),
      )
      const shoppingSpent = Math.abs(shoppingTransactions.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0))

      setBudgetData({
        foodAndDining: { spent: foodSpent || 350, budget: 500 },
        entertainment: { spent: entertainmentSpent || 120, budget: 200 },
        transportation: { spent: transportationSpent || 180, budget: 300 },
        shopping: { spent: shoppingSpent || 450, budget: 400 },
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load account summary data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Monthly Budget</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Food & Dining</span>
                  <span className="text-sm text-gray-500">
                    ${budgetData.foodAndDining.spent.toFixed(0)} / ${budgetData.foodAndDining.budget}
                  </span>
                </div>
                <Progress
                  value={(budgetData.foodAndDining.spent / budgetData.foodAndDining.budget) * 100}
                  className="h-2 bg-gray-100"
                  indicatorClassName={
                    budgetData.foodAndDining.spent > budgetData.foodAndDining.budget ? "bg-red-500" : "bg-emerald-500"
                  }
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Entertainment</span>
                  <span className="text-sm text-gray-500">
                    ${budgetData.entertainment.spent.toFixed(0)} / ${budgetData.entertainment.budget}
                  </span>
                </div>
                <Progress
                  value={(budgetData.entertainment.spent / budgetData.entertainment.budget) * 100}
                  className="h-2 bg-gray-100"
                  indicatorClassName={
                    budgetData.entertainment.spent > budgetData.entertainment.budget ? "bg-red-500" : "bg-emerald-500"
                  }
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Transportation</span>
                  <span className="text-sm text-gray-500">
                    ${budgetData.transportation.spent.toFixed(0)} / ${budgetData.transportation.budget}
                  </span>
                </div>
                <Progress
                  value={(budgetData.transportation.spent / budgetData.transportation.budget) * 100}
                  className="h-2 bg-gray-100"
                  indicatorClassName={
                    budgetData.transportation.spent > budgetData.transportation.budget ? "bg-red-500" : "bg-emerald-500"
                  }
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Shopping</span>
                  <span className="text-sm text-gray-500">
                    ${budgetData.shopping.spent.toFixed(0)} / ${budgetData.shopping.budget}
                  </span>
                </div>
                <Progress
                  value={(budgetData.shopping.spent / budgetData.shopping.budget) * 100}
                  className="h-2 bg-gray-100"
                  indicatorClassName={
                    budgetData.shopping.spent > budgetData.shopping.budget ? "bg-red-500" : "bg-emerald-500"
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Savings Goals</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Vacation Fund</span>
                  <span className="text-sm text-gray-500">
                    ${savingsGoals.vacation.saved.toLocaleString()} / ${savingsGoals.vacation.goal.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={(savingsGoals.vacation.saved / savingsGoals.vacation.goal) * 100}
                  className="h-2 bg-gray-100"
                  indicatorClassName="bg-blue-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Emergency Fund</span>
                  <span className="text-sm text-gray-500">
                    ${savingsGoals.emergency.saved.toLocaleString()} / ${savingsGoals.emergency.goal.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={(savingsGoals.emergency.saved / savingsGoals.emergency.goal) * 100}
                  className="h-2 bg-gray-100"
                  indicatorClassName="bg-blue-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">New Car</span>
                  <span className="text-sm text-gray-500">
                    ${savingsGoals.newCar.saved.toLocaleString()} / ${savingsGoals.newCar.goal.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={(savingsGoals.newCar.saved / savingsGoals.newCar.goal) * 100}
                  className="h-2 bg-gray-100"
                  indicatorClassName="bg-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Credit Score</h3>
            <div className="flex flex-col items-center justify-center h-40">
              <div className="text-4xl font-bold text-emerald-600">{creditScore}</div>
              <div className="text-sm text-gray-500 mt-2">Excellent</div>
              <div className="w-full mt-4">
                <Progress
                  value={(creditScore - 300) / 5.5}
                  className="h-2 bg-gray-100"
                  indicatorClassName="bg-emerald-500"
                />
              </div>
              <div className="flex justify-between w-full mt-2 text-xs text-gray-500">
                <span>300</span>
                <span>850</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Financial Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">Spending Trend</h4>
              <p className="text-sm text-blue-600">
                Your spending on dining out has decreased by 15% compared to last month. Great job sticking to your
                budget!
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <h4 className="font-medium text-yellow-700 mb-2">Upcoming Bill</h4>
              <p className="text-sm text-yellow-600">
                Your credit card payment of $1,543.67 is due in 5 days. Make sure to schedule your payment to avoid late
                fees.
              </p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
              <h4 className="font-medium text-emerald-700 mb-2">Savings Opportunity</h4>
              <p className="text-sm text-emerald-600">
                Based on your cash flow, you could increase your monthly savings by $200 without impacting your
                lifestyle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
