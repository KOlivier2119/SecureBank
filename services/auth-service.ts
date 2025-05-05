interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: string[]
}

class AuthService {
  private tokenKey = "token"

  // Mock user data
  private mockUsers = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      roles: ["USER"],
    },
  ]

  // Mock JWT token generation
  private generateToken(user: any): string {
    // In a real app, this would be done on the server
    const payload = {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    }

    // This is just a mock token, not a real JWT
    return btoa(JSON.stringify(payload))
  }

  async login(request: LoginRequest): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find user by email
    const user = this.mockUsers.find((u) => u.email === request.email)

    if (!user || user.password !== request.password) {
      throw new Error("Invalid email or password")
    }

    // Generate token
    const token = this.generateToken(user)

    // Store token
    localStorage.setItem(this.tokenKey, token)

    // Return user without password
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword as User
  }

  async register(request: RegisterRequest): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if email already exists
    if (this.mockUsers.some((u) => u.email === request.email)) {
      throw new Error("Email already in use")
    }

    // Create new user
    const newUser = {
      id: (this.mockUsers.length + 1).toString(),
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      password: request.password,
      roles: ["USER"],
    }

    // Add to mock users
    this.mockUsers.push(newUser)

    // Generate token
    const token = this.generateToken(newUser)

    // Store token
    localStorage.setItem(this.tokenKey, token)

    // Return user without password
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword as User
  }

  async logout(): Promise<void> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Remove token
    localStorage.removeItem(this.tokenKey)
  }

  async getCurrentUser(): Promise<User | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const token = localStorage.getItem(this.tokenKey)

    if (!token) {
      return null
    }

    try {
      // In a real app, you would verify the token on the server
      // Here we just decode it
      const decoded = JSON.parse(atob(token))

      // Check if token is expired
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem(this.tokenKey)
        return null
      }

      return {
        id: decoded.sub,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        roles: decoded.roles,
      }
    } catch (error) {
      console.error("Error decoding token:", error)
      localStorage.removeItem(this.tokenKey)
      return null
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey)

    if (!token) {
      return false
    }

    try {
      const decoded = JSON.parse(atob(token))
      return decoded.exp >= Math.floor(Date.now() / 1000)
    } catch {
      return false
    }
  }
}

export const authService = new AuthService()
