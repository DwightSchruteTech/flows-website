"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play, LogOut, User, CreditCard, ChevronDown } from "lucide-react"
import { useMemberstack } from "@/contexts/memberstack-context"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { member, isLoading, login, logout } = useMemberstack()
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const scrollToPricing = () => scrollToSection("pricing")

  const handleLogin = async () => {
    if (isLoading) {
      return
    }
    try {
      await login()
    } catch (error) {
      console.error('Login error in navigation:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
    setShowProfileMenu(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="text-xl font-semibold text-foreground">Flows</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </button>
          </div>

          <div className="flex items-center gap-3">
            {member ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                  disabled={isLoading}
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-foreground">
                    {member.auth?.email?.split("@")[0] || "Profile"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">
                        {member.auth?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false)
                        router.push("/account-billing")
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2 text-foreground transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Manage Billing
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2 text-destructive transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90"
                  onClick={scrollToPricing}
                >
                  Try for free
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
