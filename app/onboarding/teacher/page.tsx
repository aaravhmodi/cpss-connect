'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import BackButton from '@/components/BackButton'
import { checkUsernameAvailability, validateUsernameFormat } from '@/lib/username'

export default function TeacherOnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    subject: '',
    bio: '',
  })
  const [error, setError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!user) return

    if (!formData.username || !formData.fullName || !formData.subject) {
      setError('Please fill in all required fields')
      return
    }

    // Validate and check username availability
    setUsernameError('')
    setIsCheckingUsername(true)
    const usernameCheck = await checkUsernameAvailability(formData.username)
    setIsCheckingUsername(false)
    
    if (!usernameCheck.available) {
      setUsernameError(usernameCheck.error || 'Username is not available')
      return
    }

    setIsSubmitting(true)

    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        role: 'teacher',
        username: formData.username.toLowerCase().trim(),
        fullName: formData.fullName,
        subject: formData.subject,
        bio: formData.bio || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      console.log('Creating teacher profile:', { uid: user.uid, email: user.email })
      
      await setDoc(doc(db, 'users', user.uid), userData)
      
      console.log('Teacher profile created successfully')
      
      // Verify the document was created
      const verifyDoc = await getDoc(doc(db, 'users', user.uid))
      if (!verifyDoc.exists()) {
        throw new Error('Profile was not created. Please try again.')
      }
      
      // Send welcome email (don't wait for it - fire and forget)
      try {
        await fetch('/api/welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: formData.fullName,
            role: 'teacher',
          }),
        })
      } catch (emailError) {
        // Silently fail - email is not critical
        console.error('Failed to send welcome email:', emailError)
      }
      
      router.push('/home')
    } catch (err: any) {
      console.error('Error creating teacher profile:', err)
      setError(err.message || 'Failed to create profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUsernameBlur = async () => {
    if (!formData.username) return

    const formatCheck = validateUsernameFormat(formData.username)
    if (!formatCheck.valid) {
      setUsernameError(formatCheck.error || 'Invalid username format')
      return
    }

    setUsernameError('')
    setIsCheckingUsername(true)
    const availabilityCheck = await checkUsernameAvailability(formData.username)
    setIsCheckingUsername(false)

    if (!availabilityCheck.available) {
      setUsernameError(availabilityCheck.error || 'Username is not available')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <BackButton href="/select-role" />
        
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Profile Setup</h1>
          <p className="text-gray-600 mb-8">Complete your teacher profile to get started</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <Input
                label="Username"
                type="text"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value })
                  setUsernameError('')
                }}
                onBlur={handleUsernameBlur}
                required
                placeholder="johndoe"
                minLength={3}
                maxLength={20}
              />
              {isCheckingUsername && (
                <p className="mt-1 text-sm text-gray-500">Checking availability...</p>
              )}
              {usernameError && (
                <p className="mt-1 text-sm text-red-600">{usernameError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>

            <Input
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              placeholder="John Doe"
            />

            <Input
              label="Subject / Class You Teach"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              placeholder="Mathematics, English, Science, etc."
            />

            <Textarea
              label="Bio (Optional)"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell students a bit about yourself..."
              rows={4}
            />

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Complete Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

