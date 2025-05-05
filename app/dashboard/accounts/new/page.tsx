"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Wallet, DollarSign, CreditCard, ArrowLeft, Check } from "lucide-react"
import { accountService } from "@/services/account-service"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function NewAccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [accountType, setAccountType] = useState("CHECKING")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    const type = searchParams.get("type")
    if (type) {
      setAccountType(type.toUpperCase())
    }
  }, [searchParams])

  const handleCreateAccount = async () => {
    try {
      setIsLoading(true)

      await accountService.createAccount({
        accountType: accountType,
      })

      setStep(2)

      toast({
        title: "Account created",
        description: `Your new ${accountType.toLowerCase()} account has been created successfully.`,
      })

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/dashboard/accounts")
      }, 2000)
    } catch (error) {
      console.error("Error creating account:", error)
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/dashboard/accounts")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accounts
        </Button>
        <h1 className="text-2xl font-bold">Open a New Account</h1>
        <p className="text-gray-600">Choose the type of account you want to open</p>
      </div>

      {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Select Account Type</CardTitle>
            <CardDescription>Choose the account that best fits your financial needs</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={accountType} onValueChange={setAccountType} className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <RadioGroupItem value="CHECKING" id="checking" className="sr-only peer" />
                <Label
                  htmlFor="checking"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500"
                >
                  <Wallet className="mb-3 h-8 w-8 text-emerald-600" />
                  <div className="text-center">
                    <h3 className="font-bold">Checking Account</h3>
                    <p className="text-sm text-gray-500 mt-1">For everyday transactions and bill payments</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-emerald-500" />
                      No minimum balance
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-emerald-500" />
                      Free debit card
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-emerald-500" />
                      Online & mobile banking
                    </li>
                  </ul>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem value="SAVINGS" id="savings" className="sr-only peer" />
                <Label
                  htmlFor="savings"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500"
                >
                  <DollarSign className="mb-3 h-8 w-8 text-blue-600" />
                  <div className="text-center">
                    <h3 className="font-bold">Savings Account</h3>
                    <p className="text-sm text-gray-500 mt-1">For building your savings with interest</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-blue-500" />
                      Competitive interest rates
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-blue-500" />
                      No monthly fees
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-blue-500" />
                      Automatic savings options
                    </li>
                  </ul>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem value="CREDIT" id="credit" className="sr-only peer" />
                <Label
                  htmlFor="credit"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                >
                  <CreditCard className="mb-3 h-8 w-8 text-purple-600" />
                  <div className="text-center">
                    <h3 className="font-bold">Credit Account</h3>
                    <p className="text-sm text-gray-500 mt-1">For flexible spending and building credit</p>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-500" />
                      Competitive APR
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-500" />
                      No annual fee
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-500" />
                      Rewards on purchases
                    </li>
                  </ul>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateAccount}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Open Account"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-emerald-100 p-3 mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Account Created Successfully!</h2>
            <p className="text-gray-600 text-center mb-6">
              Your new {accountType.toLowerCase()} account has been created and is ready to use.
            </p>
            <Button onClick={() => router.push("/dashboard/accounts")} className="bg-emerald-600 hover:bg-emerald-700">
              Go to My Accounts
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
