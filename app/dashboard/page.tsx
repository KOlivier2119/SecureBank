"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDownUp,
  ArrowUpRight,
  Bell,
  CreditCard,
  DollarSign,
  Download,
  HelpCircle,
  History,
  Home,
  LogOut,
  Menu,
  PieChart,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Wallet,
} from "lucide-react"
import { TransactionList } from "@/components/transaction-list"
import { AccountSummary } from "@/components/account-summary"
import { SpendingChart } from "@/components/spending-chart"
import { accountService } from "@/services/account-service"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth-service"
import { useMobile } from "@/hooks/use-mobile"

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [activeTab, setActiveTab] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser()
        setUser(userData)
        fetchAccounts()
      } catch (error) {
        console.error("Authentication error:", error)
        toast({
          title: "Authentication error",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        })
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, toast])

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button onClick={toggleMobileMenu} className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md">
          <Menu className="h-6 w-6 text-gray-600" />
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
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-emerald-50 text-emerald-700"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/accounts"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Wallet className="h-5 w-5" />
            Accounts
          </Link>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <History className="h-5 w-5" />
            Transactions
          </Link>
          <Link
            href="/dashboard/payments"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Send className="h-5 w-5" />
            Payments
          </Link>
          <Link
            href="/dashboard/cards"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <CreditCard className="h-5 w-5" />
            Cards
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <PieChart className="h-5 w-5" />
            Analytics
          </Link>
        </nav>

        <div className="pt-4 border-t">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link
            href="/dashboard/help"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
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
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}</h1>
            <p className="text-gray-600">Here's what's happening with your accounts today.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full p-2 ${
                          account.accountType === "CHECKING"
                            ? "bg-emerald-100"
                            : account.accountType === "SAVINGS"
                              ? "bg-blue-100"
                              : "bg-purple-100"
                        }`}
                      >
                        {account.accountType === "CHECKING" ? (
                          <Wallet
                            className={`h-5 w-5 ${
                              account.accountType === "CHECKING"
                                ? "text-emerald-600"
                                : account.accountType === "SAVINGS"
                                  ? "text-blue-600"
                                  : "text-purple-600"
                            }`}
                          />
                        ) : account.accountType === "SAVINGS" ? (
                          <DollarSign
                            className={`h-5 w-5 ${
                              account.accountType === "CHECKING"
                                ? "text-emerald-600"
                                : account.accountType === "SAVINGS"
                                  ? "text-blue-600"
                                  : "text-purple-600"
                            }`}
                          />
                        ) : (
                          <CreditCard
                            className={`h-5 w-5 ${
                              account.accountType === "CHECKING"
                                ? "text-emerald-600"
                                : account.accountType === "SAVINGS"
                                  ? "text-blue-600"
                                  : "text-purple-600"
                            }`}
                          />
                        )}
                      </div>
                      <span className="font-medium">
                        {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(account.balance)}
                    </div>
                    <div className="text-sm text-gray-500">Available balance</div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-sm text-emerald-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>Account #{account.accountNumber}</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {accounts.length === 0 && (
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center h-40">
                  <p className="text-gray-500 mb-4">No accounts found</p>
                  <Button
                    onClick={() => router.push("/dashboard/accounts/new")}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Account
                  </Button>
                </CardContent>
              </Card>
            )}

            {accounts.length < 3 && (
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">Add a new account</p>
                  <Button
                    onClick={() => router.push("/dashboard/accounts/new")}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Open New Account
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Spending Overview</CardTitle>
                    <CardDescription>Your spending patterns for the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SpendingChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common banking tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        className="flex flex-col items-center justify-center h-24 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                        onClick={() => router.push("/dashboard/payments/send")}
                      >
                        <Send className="h-6 w-6 mb-2" />
                        <span>Send Money</span>
                      </Button>
                      <Button
                        className="flex flex-col items-center justify-center h-24 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                        onClick={() => router.push("/dashboard/payments/deposit")}
                      >
                        <Plus className="h-6 w-6 mb-2" />
                        <span>Add Money</span>
                      </Button>
                      <Button
                        className="flex flex-col items-center justify-center h-24 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                        onClick={() => router.push("/dashboard/payments/transfer")}
                      >
                        <ArrowDownUp className="h-6 w-6 mb-2" />
                        <span>Transfer</span>
                      </Button>
                      <Button
                        className="flex flex-col items-center justify-center h-24 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                        onClick={() => router.push("/dashboard/statements")}
                      >
                        <Download className="h-6 w-6 mb-2" />
                        <span>Statements</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>Your latest account activity</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/transactions")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <TransactionList limit={5} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transactions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Transactions</CardTitle>
                  <CardDescription>A complete history of your account activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList limit={10} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="insights" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Insights</CardTitle>
                  <CardDescription>Understand your spending habits and financial health</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccountSummary />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
