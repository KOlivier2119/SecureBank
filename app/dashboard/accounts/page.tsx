"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Wallet, DollarSign, ArrowRight, Clock } from "lucide-react"
import { accountService } from "@/services/account-service"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AccountsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setIsLoading(true)
      const accountsData = await accountService.getUserAccounts()
      setAccounts(accountsData)
    } catch (error) {
      console.error("Error fetching accounts:", error)
      toast({
        title: "Error",
        description: "Failed to load account information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "CHECKING":
        return <Wallet className="h-6 w-6 text-emerald-600" />
      case "SAVINGS":
        return <DollarSign className="h-6 w-6 text-blue-600" />
      case "CREDIT":
        return <CreditCard className="h-6 w-6 text-purple-600" />
      default:
        return <Wallet className="h-6 w-6 text-emerald-600" />
    }
  }

  const getAccountColor = (type: string) => {
    switch (type) {
      case "CHECKING":
        return "bg-emerald-50 border-emerald-200"
      case "SAVINGS":
        return "bg-blue-50 border-blue-200"
      case "CREDIT":
        return "bg-purple-50 border-purple-200"
      default:
        return "bg-emerald-50 border-emerald-200"
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Accounts</h1>
          <p className="text-gray-600">Manage all your accounts in one place</p>
        </div>
        <Button onClick={() => router.push("/dashboard/accounts/new")} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> New Account
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <>
          {accounts.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center h-64">
                <Wallet className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No accounts found</h3>
                <p className="text-gray-500 mb-6 text-center">
                  You don't have any accounts yet. Create your first account to get started.
                </p>
                <Button
                  onClick={() => router.push("/dashboard/accounts/new")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Account
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
                <TabsTrigger value="all">All Accounts</TabsTrigger>
                <TabsTrigger value="checking">Checking</TabsTrigger>
                <TabsTrigger value="savings">Savings</TabsTrigger>
                <TabsTrigger value="credit">Credit</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {accounts.map((account) => (
                    <Card key={account.id} className="overflow-hidden">
                      <div
                        className={`h-2 ${
                          account.accountType === "CHECKING"
                            ? "bg-emerald-500"
                            : account.accountType === "SAVINGS"
                              ? "bg-blue-500"
                              : "bg-purple-500"
                        }`}
                      ></div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-full p-2 ${
                                account.accountType === "CHECKING"
                                  ? "bg-emerald-100"
                                  : account.accountType === "SAVINGS"
                                    ? "bg-blue-100"
                                    : "bg-purple-100"
                              }`}
                            >
                              {getAccountIcon(account.accountType)}
                            </div>
                            <div>
                              <h3 className="font-bold">
                                {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}
                              </h3>
                              <p className="text-sm text-gray-500">#{account.accountNumber}</p>
                            </div>
                          </div>
                          <Badge
                            variant={account.active ? "default" : "outline"}
                            className={account.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                          >
                            {account.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-500">Available Balance</p>
                          <h2 className="text-3xl font-bold">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(account.balance)}
                          </h2>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Opened on {new Date(account.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 p-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-between"
                          onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                        >
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  <Card className={`border-dashed border-2 border-gray-200 bg-gray-50`}>
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[220px]">
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 mb-4 text-center">Open a new account</p>
                      <Button variant="outline" onClick={() => router.push("/dashboard/accounts/new")}>
                        Add Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="checking" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {accounts
                    .filter((account) => account.accountType === "CHECKING")
                    .map((account) => (
                      <Card key={account.id} className="overflow-hidden">
                        <div className="h-2 bg-emerald-500"></div>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full p-2 bg-emerald-100">
                                <Wallet className="h-6 w-6 text-emerald-600" />
                              </div>
                              <div>
                                <h3 className="font-bold">Checking</h3>
                                <p className="text-sm text-gray-500">#{account.accountNumber}</p>
                              </div>
                            </div>
                            <Badge
                              variant={account.active ? "default" : "outline"}
                              className={account.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                            >
                              {account.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-500">Available Balance</p>
                            <h2 className="text-3xl font-bold">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(account.balance)}
                            </h2>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Opened on {new Date(account.createdAt).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 p-4">
                          <Button
                            variant="ghost"
                            className="w-full justify-between"
                            onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                          >
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}

                  {accounts.filter((account) => account.accountType === "CHECKING").length === 0 && (
                    <Card className="col-span-full">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-64">
                        <Wallet className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No checking accounts</h3>
                        <p className="text-gray-500 mb-6 text-center">You don't have any checking accounts yet.</p>
                        <Button
                          onClick={() => router.push("/dashboard/accounts/new?type=checking")}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Open Checking Account
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="savings" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {accounts
                    .filter((account) => account.accountType === "SAVINGS")
                    .map((account) => (
                      <Card key={account.id} className="overflow-hidden">
                        <div className="h-2 bg-blue-500"></div>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full p-2 bg-blue-100">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-bold">Savings</h3>
                                <p className="text-sm text-gray-500">#{account.accountNumber}</p>
                              </div>
                            </div>
                            <Badge
                              variant={account.active ? "default" : "outline"}
                              className={account.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                            >
                              {account.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-500">Available Balance</p>
                            <h2 className="text-3xl font-bold">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(account.balance)}
                            </h2>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Opened on {new Date(account.createdAt).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 p-4">
                          <Button
                            variant="ghost"
                            className="w-full justify-between"
                            onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                          >
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}

                  {accounts.filter((account) => account.accountType === "SAVINGS").length === 0 && (
                    <Card className="col-span-full">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-64">
                        <DollarSign className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No savings accounts</h3>
                        <p className="text-gray-500 mb-6 text-center">You don't have any savings accounts yet.</p>
                        <Button
                          onClick={() => router.push("/dashboard/accounts/new?type=savings")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Open Savings Account
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="credit" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {accounts
                    .filter((account) => account.accountType === "CREDIT")
                    .map((account) => (
                      <Card key={account.id} className="overflow-hidden">
                        <div className="h-2 bg-purple-500"></div>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full p-2 bg-purple-100">
                                <CreditCard className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-bold">Credit</h3>
                                <p className="text-sm text-gray-500">#{account.accountNumber}</p>
                              </div>
                            </div>
                            <Badge
                              variant={account.active ? "default" : "outline"}
                              className={account.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                            >
                              {account.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-500">Current Balance</p>
                            <h2 className="text-3xl font-bold">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(account.balance)}
                            </h2>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Opened on {new Date(account.createdAt).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 p-4">
                          <Button
                            variant="ghost"
                            className="w-full justify-between"
                            onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                          >
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}

                  {accounts.filter((account) => account.accountType === "CREDIT").length === 0 && (
                    <Card className="col-span-full">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-64">
                        <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No credit accounts</h3>
                        <p className="text-gray-500 mb-6 text-center">You don't have any credit accounts yet.</p>
                        <Button
                          onClick={() => router.push("/dashboard/accounts/new?type=credit")}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Apply for Credit Account
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
