'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Navigation from '@/components/Navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import RoleBadge from '@/components/RoleBadge'

export default function ProfilePage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    linkedinUrl: '',
    gradYear: '',
    gradMonth: '',
    interestedPrograms: '',
    classOf: '',
    universityClassOf: '',
    university: '',
    program: '',
    jobTitle: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && !userData) {
      router.push('/select-role')
    } else if (userData) {
      setFormData({
    fullName: userData.fullName || '',
    bio: userData.bio || '',
    linkedinUrl: userData.linkedinUrl || '',
    gradYear: userData.gradYear?.toString() || '',
    gradMonth: userData.gradMonth?.toString() || '',
    interestedPrograms: userData.interestedPrograms?.join(', ') || '',
    classOf: userData.classOf?.toString() || '',
    universityClassOf: userData.universityClassOf?.toString() || '',
    university: userData.university || '',
    program: userData.program || '',
    jobTitle: userData.jobTitle || '',
  })
    }
  }, [user, userData, loading, router])

  const handleSave = async () => {
    if (!user || !userData) return

    setIsSaving(true)
    try {
      const updateData: any = {
        bio: formData.bio,
        linkedinUrl: formData.linkedinUrl.trim() || null,
        updatedAt: new Date(),
      }

      updateData.fullName = formData.fullName

      if (userData.role === 'student') {
        updateData.gradYear = parseInt(formData.gradYear)
        updateData.gradMonth = parseInt(formData.gradMonth)
        updateData.interestedPrograms = formData.interestedPrograms
          .split(',')
          .map(p => p.trim())
          .filter(p => p.length > 0)
      } else if (userData.role === 'alumni') {
        updateData.classOf = parseInt(formData.classOf)
        updateData.universityClassOf = parseInt(formData.universityClassOf)
        updateData.university = formData.university
        updateData.program = formData.program || ''
        updateData.jobTitle = formData.jobTitle || ''
      }

      await updateDoc(doc(db, 'users', user.uid), updateData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cpss-green mx-auto"></div>
          <p className="mt-4 text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  const EnvelopeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )

  const LocationIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )

  const RibbonIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-dark-bg pt-14 md:pt-16" style={{ background: 'var(--gradient-hero)' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header with Settings */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-dark-text">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-dark-text-secondary hover:text-dark-text transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>

        {/* Profile Picture and Name */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-cpss-green/20 flex items-center justify-center text-cpss-green text-4xl md:text-5xl font-semibold border-4 border-cpss-green">
              {userData.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
          {isEditing ? (
            <div className="mt-4">
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="text-2xl md:text-3xl font-bold bg-dark-bg-secondary text-dark-text border-dark-border text-center"
              />
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-dark-text mt-4">{userData.fullName}</h2>
              <p className="text-cpss-green mt-2">
                {userData.role === 'student' && userData.gradYear ? `Student • Class of ${userData.gradYear}` : 
                 userData.role === 'alumni' && userData.classOf ? `Alumni • Class of ${userData.classOf}` :
                 userData.role === 'teacher' ? 'Teacher' : userData.role}
              </p>
            </>
          )}
        </div>

        {/* Profile Cards */}
        <div className="space-y-4">
          {/* Email Card */}
          <div className="bg-dark-bg-card border border-dark-border rounded-apple-lg p-5 flex items-start gap-4">
            <div className="text-cpss-gold flex-shrink-0 mt-1">
              <EnvelopeIcon />
            </div>
            <div className="flex-1">
              <p className="text-sm text-dark-text-muted mb-1">Email</p>
              <p className="text-base text-dark-text font-medium">{user?.email || 'Not available'}</p>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-dark-bg-card border border-dark-border rounded-apple-lg p-5 flex items-start gap-4">
            <div className="text-cpss-gold flex-shrink-0 mt-1">
              <LocationIcon />
            </div>
            <div className="flex-1">
              <p className="text-sm text-dark-text-muted mb-1">Location</p>
              <p className="text-base text-dark-text font-medium">Brampton, ON</p>
            </div>
          </div>

          {/* Member Since Card */}
          <div className="bg-dark-bg-card border border-dark-border rounded-apple-lg p-5 flex items-start gap-4">
            <div className="text-cpss-gold flex-shrink-0 mt-1">
              <CalendarIcon />
            </div>
            <div className="flex-1">
              <p className="text-sm text-dark-text-muted mb-1">Member Since</p>
              <p className="text-base text-dark-text font-medium">
                {userData.createdAt?.toDate ? 
                  userData.createdAt.toDate().toLocaleString('default', { month: 'long', year: 'numeric' }) :
                  'Recently'}
              </p>
            </div>
          </div>

          {/* Interests/Programs Card */}
          {(userData.interestedPrograms && userData.interestedPrograms.length > 0) && (
            <div className="bg-dark-bg-card border border-dark-border rounded-apple-lg p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-cpss-gold flex-shrink-0 mt-1">
                  <RibbonIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-dark-text-muted mb-3">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.interestedPrograms.map((program, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-cpss-gold text-cpss-black rounded-apple text-sm font-medium"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn Card */}
          {!isEditing && userData.linkedinUrl && (
            <div className="bg-dark-bg-card border border-dark-border rounded-apple-lg p-5">
              <a
                href={userData.linkedinUrl.startsWith('http') ? userData.linkedinUrl : `https://${userData.linkedinUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-[#0077b5] text-white rounded-apple-lg hover:bg-[#006399] transition-all shadow-apple hover:shadow-apple-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="font-semibold text-base">View LinkedIn Profile</span>
              </a>
            </div>
          )}

          {/* Editing Form Fields */}
          {isEditing && (
            <div className="space-y-6 bg-dark-bg-card border border-dark-border rounded-apple-lg p-6">
              {userData.role === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Graduation Year"
                      type="number"
                      value={formData.gradYear}
                      onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-cpss-green mb-2">
                        Graduation Month
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-cpss-green focus:border-cpss-green bg-dark-bg-secondary text-dark-text"
                        value={formData.gradMonth}
                        onChange={(e) => setFormData({ ...formData, gradMonth: e.target.value })}
                      >
                        <option value="" className="bg-dark-bg-secondary text-dark-text">Select month</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                          <option key={month} value={month} className="bg-dark-bg-secondary text-dark-text">
                            {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Input
                    label="Interested Programs (comma-separated)"
                    value={formData.interestedPrograms}
                    onChange={(e) => setFormData({ ...formData, interestedPrograms: e.target.value })}
                  />
                </>
              )}

              {userData.role === 'alumni' && (
                <>
                  <Input
                    label="Class of (High School Graduation Year)"
                    type="number"
                    value={formData.classOf}
                    onChange={(e) => setFormData({ ...formData, classOf: e.target.value })}
                    min="2000"
                    max="2030"
                  />
                  <Input
                    label="Class of (University Graduation Year)"
                    type="number"
                    value={formData.universityClassOf}
                    onChange={(e) => setFormData({ ...formData, universityClassOf: e.target.value })}
                    required
                    min="2000"
                    max="2035"
                  />
                  <Input
                    label="University/College or Workplace"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  />
                  <Input
                    label="Program/Major"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    placeholder="Computer Science"
                  />
                  <Input
                    label="Current Career/Job Title"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </>
              )}

              <Textarea
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={6}
                className="text-base"
              />

              <Input
                label="LinkedIn Profile URL"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
              />

              <div className="flex gap-3">
                <Button onClick={handleSave} isLoading={isSaving}>
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Profile Button */}
        {!isEditing && (
          <div className="mt-8">
            <Button 
              onClick={() => setIsEditing(true)} 
              className="w-full py-4 text-lg font-medium"
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>
      <Navigation />
    </div>
  )
}

