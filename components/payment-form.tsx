"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"
import { transactionService } from "@/services/transaction-service"
import { useToast } from "@/hooks/use-toast"

interface PaymentFormProps {
  accounts: any[]
  onSuccess?: () => void
}

export function PaymentForm({ accounts, onSuccess }: PaymentFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    description: "",
    merchantName: "",
    category: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    "Food & Dining",
    "Shopping",
    "Entertainment",
    "Transportation",
    "Utilities",
    "Housing",
    "Insurance",
    "Medical",
    "Education",
    "Personal Care",
    "Travel",
    "Gifts & Donations",
    "Business",
    "Other",
  ]

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

    if (!formData.accountId) {
      newErrors.accountId = "Please select an account"
    }

    if (!formData.amount) {
      newErrors.amount = "Please enter an amount"
    } else if (isNaN(Number.parseFloat(formData.amount)) || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than zero"
    }

    if (!formData.description) {
      newErrors.description = "Please enter a description"
    }

    if (!formData.merchantName) {
      newErrors.merchantName = "Please enter a merchant name"
    }

    if (!formData.category) {
      newErrors.category = "Please select a category"
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
      await transactionService.payment({
        accountId: formData.accountId,
        amount: Number.parseFloat(formData.amount),
        description: formData.description,
        merchantName: formData.merchantName,
        category: formData.category,
      })

      setIsSuccess(true)

      toast({
        title: "Payment successful",
        description: `$${Number.parseFloat(formData.amount).toFixed(2)} has been paid to ${formData.merchantName}.`,
      })

      // Reset form
      setFormData({
        accountId: "",
        amount: "",
        description: "",
        merchantName: "",
        category: "",
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
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
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
          <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-gray-600 text-center mb-6">
            ${Number.parseFloat(formData.amount).toFixed(2)} has been paid to {formData.merchantName}.
          </p>
          <Button type="button" onClick={() => setIsSuccess(false)} className="bg-emerald-600 hover:bg-emerald-700">
            Make Another Payment
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="accountId">From Account</Label>
            <Select value={formData.accountId} onValueChange={(value) => handleChange("accountId", value)}>
              <SelectTrigger id="accountId" className={errors.accountId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select account" />
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
            {errors.accountId && <p className="text-red-500 text-xs mt-1">{errors.accountId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchantName">Payee / Merchant</Label>
            <Input
              id="merchantName"
              placeholder="Enter merchant name"
              className={errors.merchantName ? "border-red-500" : ""}
              value={formData.merchantName}
              onChange={(e) => handleChange("merchantName", e.target.value)}
            />
            {errors.merchantName && <p className="text-red-500 text-xs mt-1">{errors.merchantName}</p>}
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this payment"
              className={errors.description ? "border-red-500" : ""}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
            {isLoading ? "Processing..." : "Make Payment"}
          </Button>
        </>
      )}
    </form>
  )
}
