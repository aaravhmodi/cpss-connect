'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import BackButton from '@/components/BackButton'

const GraduationCapIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9M5 13l2.5-5L12 14l4.5-6L19 13" />
  </svg>
)

const PeopleIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const BookIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

export default function SelectRolePage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && userData) {
      router.push('/home')
    }
  }, [user, userData, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cpss-green mx-auto"></div>
          <p className="mt-4 text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-right mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-2">CPSS Connect</h1>
          <p className="text-lg md:text-xl text-cpss-green font-medium">Students • Alumni • Teachers</p>
        </div>

        {/* Role Buttons */}
        <div className="space-y-4 md:space-y-6 max-w-2xl ml-auto">
          {/* Student Button */}
          <button
            onClick={() => router.push('/onboarding/student')}
            className="w-full bg-cpss-green text-white rounded-apple-lg p-6 md:p-8 hover:bg-primary-dark transition-all shadow-apple hover:shadow-apple-lg flex items-center gap-6 text-left group"
          >
            <div className="flex-shrink-0">
              <GraduationCapIcon />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Student</h2>
              <p className="text-white/90 text-base md:text-lg">Connect with your peers</p>
            </div>
          </button>

          {/* Alumni Button - Gold */}
          <button
            onClick={() => router.push('/onboarding/alumni')}
            className="w-full bg-cpss-gold text-cpss-black rounded-apple-lg p-6 md:p-8 hover:bg-gold-dark transition-all shadow-apple hover:shadow-apple-lg flex items-center gap-6 text-left group"
          >
            <div className="flex-shrink-0 text-cpss-black">
              <PeopleIcon />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-cpss-black">Alumni</h2>
              <p className="text-cpss-black/80 text-base md:text-lg">Stay connected to CPSS</p>
            </div>
          </button>

          {/* Teacher Button */}
          <button
            onClick={() => router.push('/onboarding/teacher')}
            className="w-full bg-dark-bg-card border-2 border-cpss-green text-dark-text rounded-apple-lg p-6 md:p-8 hover:bg-cpss-green/10 transition-all shadow-apple hover:shadow-apple-lg flex items-center gap-6 text-left group"
          >
            <div className="flex-shrink-0 text-cpss-green">
              <BookIcon />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Teacher</h2>
              <p className="text-dark-text-secondary text-base md:text-lg">Mentor and guide</p>
            </div>
          </button>
        </div>

        {/* Footer Tagline */}
        <div className="text-right mt-12">
          <p className="text-dark-text-muted text-sm md:text-base">Building connections within the Central Peel community</p>
        </div>
      </div>
    </div>
  )
}

