"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Bell,
  CreditCard,
  HelpCircle,
  History,
  Home,
  LogOut,
  Menu,
  PieChart,
  Search,
  Send,
  Settings,
  Shield,
  Wallet,
  X,
} from "lucide-react"
import { authService } from "@/services/auth-service"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Authentication error:", error)
        toast({
          title: "Authentication error",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  const handleLogout = async () => {
    try {
      await authService.logout()
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button onClick={toggleMobileMenu} className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md">
          {mobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
        </button>
      )}

      {/* Sidebar - Desktop always visible, Mobile conditionally visible */}
      <aside
        className={`${
          isMobile
            ? mobileMenuOpen
              ? "fixed inset-y-0 left-0 z-40 w-64 transform translate-x-0 transition-transform duration-300 ease-in-out"
              : "fixed inset-y-0 left-0 z-40 w-64 transform -translate-x-full transition-transform duration-300 ease-in-out"
            : "hidden md:flex flex-col w-64"
        } bg-white border-r p-4 h-screen overflow-auto`}
      >
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold">SecureBank</span>
        </div>

        <nav className="space-y-1 flex-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/dashboard") &&
              !isActive("/dashboard/accounts") &&
              !isActive("/dashboard/transactions") &&
              !isActive("/dashboard/payments") &&
              !isActive("/dashboard/cards") &&
              !isActive("/dashboard/analytics")
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/accounts"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/dashboard/accounts") ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Wallet className="h-5 w-5" />
            Accounts
          </Link>
          <Link
            href="/dashboard/transactions"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/dashboard/transactions") ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <History className="h-5 w-5" />
            Transactions
          </Link>
          <Link
            href="/dashboard/payments"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/dashboard/payments") ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Send className="h-5 w-5" />
            Payments
          </Link>
          <Link
            href="/dashboard/cards"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/dashboard/cards") ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            Cards
          </Link>
          <Link
            href="/dashboard/analytics"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/dashboard/analytics") ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <PieChart className="h-5 w-5" />
            Analytics
          </Link>
        </nav>

        <div className="pt-4 border-t">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/dashboard/settings") ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link
            href="/dashboard/help"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/dashboard/help") ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleMobileMenu}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center md:hidden">
              <Shield className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold ml-2">SecureBank</span>
            </div>
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 w-full rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-1 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </div>
                <span className="hidden md:inline text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
