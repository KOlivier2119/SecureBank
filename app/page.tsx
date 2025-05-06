import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  DollarSign,
  Lock,
  Shield,
  Phone,
  Mail,
  MapPin,
  Star,
  Zap,
  PiggyBank,
  Menu,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SecureBank</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#security" className="text-sm font-medium hover:text-primary transition-colors">
              Security
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm" className="transition-all hover:shadow-md">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90 transition-all hover:shadow-md">
                Sign up
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-background to-emerald-50 relative overflow-hidden animate-gradient">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
        </div>
        <div className="container relative grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
              <Zap className="mr-1 h-3.5 w-3.5" />
              Banking reimagined for the digital age
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter">
              Banking made{" "}
              <span className="text-primary relative">
                simple
                <span className="absolute bottom-1 left-0 w-full h-3 bg-emerald-100 -z-10 rounded"></span>
              </span>
              , secure, and smart
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Experience the next generation of banking with real-time insights, enhanced security, and seamless
              transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 transition-all hover-lift">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="transition-all hover-lift">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -z-10 rounded-full bg-emerald-100 w-72 h-72 -top-10 -right-10 blur-3xl opacity-70"></div>
            <div className="relative bg-card p-2 rounded-2xl shadow-2xl border border-border rotate-1 transition-transform hover:rotate-0 duration-500">
              <Image
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Banking Dashboard Preview"
                width={500}
                height={400}
                className="rounded-xl shadow-sm"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f0fdf4,transparent)]"></div>
        <div className="container relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-4">
              <Zap className="mr-1 h-3.5 w-3.5" />
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Banking Features You'll Love</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers everything you need to manage your finances with confidence and ease.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-6 w-6 text-primary" />,
                title: "Real-time Analytics",
                description:
                  "Track your spending patterns and financial health with intuitive visualizations and insights.",
                image:
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
              },
              {
                icon: <CreditCard className="h-6 w-6 text-primary" />,
                title: "Smart Cards",
                description:
                  "Control your cards directly from the app with instant freezing, spending limits, and notifications.",
                image:
                  "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
              },
              {
                icon: <Lock className="h-6 w-6 text-primary" />,
                title: "Enhanced Security",
                description: "Rest easy with biometric authentication, encryption, and real-time fraud detection.",
                image:
                  "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
              },
              {
                icon: <DollarSign className="h-6 w-6 text-primary" />,
                title: "Instant Transfers",
                description: "Send and receive money instantly, with no hidden fees or waiting periods.",
                image:
                  "https://images.unsplash.com/photo-1589758438368-0ad531db3366?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
              },
              {
                icon: <PiggyBank className="h-6 w-6 text-primary" />,
                title: "Smart Budgeting",
                description: "Create custom budgets, set savings goals, and receive personalized financial advice.",
                image:
                  "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
              },
              {
                icon: <Zap className="h-6 w-6 text-primary" />,
                title: "Automated Savings",
                description: "Set up automatic transfers to your savings account based on your spending habits.",
                image:
                  "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover-lift bg-card/80 backdrop-blur-sm animate-fadeIn overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-40 w-full relative">
                  <Image src={feature.image || "/placeholder.svg"} alt={feature.title} fill className="object-cover" />
                </div>
                <CardContent className="pt-6 p-6">
                  <div className="rounded-full bg-emerald-100 w-12 h-12 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-gradient-to-b from-background to-emerald-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#f0fdf4,transparent)]"></div>
        <div className="container relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-4">
              <Lock className="mr-1 h-3.5 w-3.5" />
              Uncompromising Security
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bank-Grade Security</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your financial security is our top priority. We implement the latest security measures to protect your
              data and money.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -z-10 rounded-full bg-emerald-100 w-64 h-64 -bottom-10 -left-10 blur-3xl opacity-70"></div>
              <div className="bg-card p-3 rounded-2xl shadow-2xl border border-border rotate-[-1deg] transition-transform hover:rotate-0 duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Security Illustration"
                  width={500}
                  height={400}
                  className="rounded-xl"
                />
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg">
                  <Lock className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {[
                {
                  icon: <Lock className="h-5 w-5 text-primary" />,
                  title: "End-to-End Encryption",
                  description:
                    "All your data is encrypted using industry-standard protocols, ensuring your information remains private and secure.",
                },
                {
                  icon: <Shield className="h-5 w-5 text-primary" />,
                  title: "Fraud Detection",
                  description:
                    "Our advanced AI systems monitor your accounts 24/7 to detect and prevent unauthorized transactions.",
                },
                {
                  icon: <CreditCard className="h-5 w-5 text-primary" />,
                  title: "Multi-Factor Authentication",
                  description:
                    "Add an extra layer of security to your account with biometric verification and one-time passwords.",
                },
              ].map((feature, index) => (
                <div key={index} className="flex gap-4 group hover:bg-card/80 p-4 rounded-xl transition-all">
                  <div className="rounded-full bg-emerald-100 w-12 h-12 flex items-center justify-center shrink-0 mt-1 group-hover:bg-emerald-200 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f0fdf4,transparent)]"></div>
        <div className="container relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-4">
              <Star className="mr-1 h-3.5 w-3.5" />
              Customer Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about their experience with
              SecureBank.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                initials: "JD",
                name: "John Doe",
                role: "Small Business Owner",
                testimonial:
                  "SecureBank has transformed how I manage my business finances. The real-time analytics and easy transfer system save me hours every week.",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
              },
              {
                initials: "JS",
                name: "Jane Smith",
                role: "Freelance Designer",
                testimonial:
                  "As someone who manages irregular income, the budgeting tools have been a game-changer. I can finally plan ahead and save consistently.",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
              },
              {
                initials: "RJ",
                name: "Robert Johnson",
                role: "Retired Teacher",
                testimonial:
                  "The security features give me peace of mind, and the interface is so intuitive that even I can navigate it easily. Customer service is exceptional too.",
                image:
                  "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover-lift bg-card/80 backdrop-blur-sm animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden relative">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.testimonial}"</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-background to-emerald-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f0fdf4,transparent)]"></div>
        <div className="container relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-4">
              <Mail className="mr-1 h-3.5 w-3.5" />
              Get in Touch
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">We're Here to Help</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions or need assistance? Our team is here to help you with any inquiries.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                {
                  icon: <Phone className="h-5 w-5 text-primary" />,
                  title: "Phone Support",
                  description: "Our customer service team is available 24/7 at",
                  highlight: "1-800-SECURE-BANK",
                },
                {
                  icon: <Mail className="h-5 w-5 text-primary" />,
                  title: "Email",
                  description: "Send us an email at",
                  highlight: "support@securebank.com",
                },
                {
                  icon: <MapPin className="h-5 w-5 text-primary" />,
                  title: "Visit Us",
                  description: "123 Financial District, Suite 100",
                  highlight: "New York, NY 10004",
                },
              ].map((contact, index) => (
                <div key={index} className="flex gap-4 group hover:bg-card/80 p-4 rounded-xl transition-all">
                  <div className="rounded-full bg-emerald-100 w-12 h-12 flex items-center justify-center shrink-0 mt-1 group-hover:bg-emerald-200 transition-colors">
                    {contact.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{contact.title}</h3>
                    <p className="text-muted-foreground">
                      {contact.description} <span className="text-primary font-medium">{contact.highlight}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Card className="border-none shadow-xl bg-card/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <form className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <input
                      id="subject"
                      className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 transition-all hover:shadow-lg py-6 text-base">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-auto">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-emerald-400" />
                <span className="text-xl font-bold">SecureBank</span>
              </div>
              <p className="text-gray-400 text-sm">Next-generation banking for the digital age.</p>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-lg">Products</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Checking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Savings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Credit Cards
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Loans
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 SecureBank. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
