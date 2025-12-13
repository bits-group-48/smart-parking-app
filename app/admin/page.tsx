"use client"
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Admin from './_components/admin'
import { Navbar } from '@/components/nav'

function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    
    if (!session?.user) {
      router.push(`/auth?callbackUrl=${encodeURIComponent("/admin")}`)
      return
    }

    if (session.user.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== "admin") {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Navbar/>
      <Admin/>
    </>
  )
}

export default AdminPage
