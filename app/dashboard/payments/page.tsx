"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownUp, CreditCard, Plus, Send } from "lucide-react"
import { accountService } from "@/services/account-service"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TransferForm } from "@/components/transfer-form"
import { DepositForm } from "@/components/deposit-form"
import { PaymentForm } from "@/components/payment-form"

export default function PaymentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("transfer")

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payments & Transfers</h1>
        <p className="text-gray-600">Send money, make payments, and manage your transfers</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center h-64">
            <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No accounts found</h3>
            <p className="text-gray-500 mb-6 text-center">
              You need at least one account to make payments or transfers.
            </p>
            <Button
              onClick={() => router.push("/dashboard/accounts/new")}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Open an Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="transfer" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transfer" className="flex items-center gap-2">
              <ArrowDownUp className="h-4 w-4" />
              <span>Transfer</span>
            </TabsTrigger>
            <TabsTrigger value="deposit" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Deposit</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Payment</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transfer" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Between Accounts</CardTitle>
                <CardDescription>Move money between your accounts instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <TransferForm accounts={accounts} onSuccess={fetchAccounts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>Add money to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <DepositForm accounts={accounts} onSuccess={fetchAccounts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
                <CardDescription>Pay bills or send money to others</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentForm accounts={accounts} onSuccess={fetchAccounts} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  )
}
