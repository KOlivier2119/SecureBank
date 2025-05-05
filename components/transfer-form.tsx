"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Check } from "lucide-react"
import { transactionService } from "@/services/transaction-service"
import { useToast } from "@/hooks/use-toast"

interface TransferFormProps {
  accounts: any[]
  onSuccess?: () => void
}

export function TransferForm({ accounts, onSuccess }: TransferFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    sourceAccountId: "",
    destinationAccountId: "",
    amount: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user changes input
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.sourceAccountId) {
      newErrors.sourceAccountId = "Please select a source account"
    }

    if (!formData.destinationAccountId) {
      newErrors.destinationAccountId = "Please select a destination account"
    }

    if (formData.sourceAccountId === formData.destinationAccountId) {
      newErrors.destinationAccountId = "Source and destination accounts cannot be the same"
    }

    if (!formData.amount) {
      newErrors.amount = "Please enter an amount"
    } else if (isNaN(Number.parseFloat(formData.amount)) || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than zero"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await transactionService.transfer({
        sourceAccountId: formData.sourceAccountId,
        destinationAccountId: formData.destinationAccountId,
        amount: Number.parseFloat(formData.amount),
        description: formData.description || "Transfer between accounts",
      })

      setIsSuccess(true)

      toast({
        title: "Transfer successful",
        description: `$${Number.parseFloat(formData.amount).toFixed(2)} has been transferred successfully.`,
      })

      // Reset form
      setFormData({
        sourceAccountId: "",
        destinationAccountId: "",
        amount: "",
        description: "",
      })

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Reset success state after a delay
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    } catch (error: any) {
      console.error("Transfer error:", error)
      toast({
        title: "Transfer failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="rounded-full bg-emerald-100 p-3 mb-4">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Transfer Successful!</h3>
          <p className="text-gray-600 text-center mb-6">
            ${Number.parseFloat(formData.amount).toFixed(2)} has been transferred successfully.
          </p>
          <Button type="button" onClick={() => setIsSuccess(false)} className="bg-emerald-600 hover:bg-emerald-700">
            Make Another Transfer
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="sourceAccountId">From Account</Label>
            <Select value={formData.sourceAccountId} onValueChange={(value) => handleChange("sourceAccountId", value)}>
              <SelectTrigger id="sourceAccountId" className={errors.sourceAccountId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()} -{" "}
                    {account.accountNumber} (${account.balance.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sourceAccountId && <p className="text-red-500 text-xs mt-1">{errors.sourceAccountId}</p>}
          </div>

          <div className="flex justify-center">
            <div className="rounded-full p-2 bg-gray-100">
              <ArrowRight className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinationAccountId">To Account</Label>
            <Select
              value={formData.destinationAccountId}
              onValueChange={(value) => handleChange("destinationAccountId", value)}
            >
              <SelectTrigger id="destinationAccountId" className={errors.destinationAccountId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()} -{" "}
                    {account.accountNumber} (${account.balance.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destinationAccountId && <p className="text-red-500 text-xs mt-1">{errors.destinationAccountId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={`pl-7 ${errors.amount ? "border-red-500" : ""}`}
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
            </div>
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this transfer"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
            {isLoading ? "Processing..." : "Transfer Funds"}
          </Button>
        </>
      )}
    </form>
  )
}
