'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { User, Conversation } from '@/lib/types'
import Navigation from '@/components/Navigation'
import Button from '@/components/Button'
import RoleBadge from '@/components/RoleBadge'
import BackButton from '@/components/BackButton'
import Link from 'next/link'

export default function UserProfilePage() {
  const { user, userData, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const uid = params.uid as string
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (!authLoading && user && !userData) {
      router.push('/select-role')
    }
  }, [user, userData, authLoading, router])

  useEffect(() => {
    if (!uid) return

    const loadProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid))
        if (userDoc.exists()) {
          setProfileUser({ uid: userDoc.id, ...userDoc.data() } as User)
        } else {
          router.push('/explore')
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [uid, router])

  const handleStartConversation = async () => {
    if (!user || !profileUser) return

    // Check if conversation already exists
    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', user.uid)
    )
    const conversationsSnapshot = await getDocs(conversationsQuery)
    
    let existingConversationId: string | null = null
    conversationsSnapshot.forEach((convDoc) => {
      const data = { id: convDoc.id, ...convDoc.data() } as Conversation
      if (data.participantIds.includes(profileUser.uid)) {
        existingConversationId = data.id
      }
    })

    if (existingConversationId) {
      router.push(`/messages/${existingConversationId}`)
    } else {
      // Create new conversation
      const { addDoc } = await import('firebase/firestore')
      const newConversation = await addDoc(collection(db, 'conversations'), {
        participantIds: [user.uid, profileUser.uid],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      router.push(`/messages/${newConversation.id}`)
    }
  }

  if (loading || authLoading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cpss-green mx-auto"></div>
          <p className="mt-4 text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-dark-bg pt-14 md:pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark-text-secondary">User not found</p>
          <Link href="/explore" className="text-cpss-green hover:underline mt-4 inline-block">
            Go back to Explore
          </Link>
        </div>
      </div>
    )
  }

  const isOwnProfile = user?.uid === profileUser.uid

  return (
    <div className="min-h-screen bg-dark-bg pt-14 md:pt-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-4">
          <BackButton href="/explore" />
        </div>
        <div className="bg-dark-bg-card border border-dark-border rounded-apple-lg shadow-apple p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-cpss-green/20 flex items-center justify-center text-cpss-green text-3xl md:text-4xl font-semibold">
                {profileUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-dark-text">
                  {profileUser.fullName}
                </h1>
                <RoleBadge role={profileUser.role} className="mt-3" />
              </div>
            </div>
            {!isOwnProfile && (
              <Button onClick={handleStartConversation} className="px-6 py-3 text-base">
                Message
              </Button>
            )}
            {isOwnProfile && (
              <Link href="/profile">
                <Button variant="outline" className="px-6 py-3 text-base">Edit Profile</Button>
              </Link>
            )}
          </div>

          <div className="space-y-6">
            {profileUser.role === 'student' && (
              <>
                {profileUser.gradYear && profileUser.gradMonth && (
                  <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                    <h3 className="text-base font-semibold text-cpss-green mb-1">Graduation</h3>
                    <p className="text-lg md:text-xl font-bold text-dark-text">
                      {new Date(2000, profileUser.gradMonth - 1).toLocaleString('default', { month: 'long' })} {profileUser.gradYear}
                    </p>
                  </div>
                )}
                {profileUser.interestedPrograms && profileUser.interestedPrograms.length > 0 && (
                  <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                    <h3 className="text-base font-semibold text-cpss-green mb-1">Interested Programs</h3>
                    <p className="text-lg md:text-xl font-bold text-dark-text">{profileUser.interestedPrograms.join(', ')}</p>
                  </div>
                )}
              </>
            )}

            {profileUser.role === 'alumni' && (
              <>
                {profileUser.classOf && (
                  <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                    <h3 className="text-base font-semibold text-cpss-green mb-1">Class of (High School)</h3>
                    <p className="text-lg md:text-xl font-bold text-dark-text">{profileUser.classOf}</p>
                  </div>
                )}
                {profileUser.universityClassOf && (
                  <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                    <h3 className="text-base font-semibold text-cpss-green mb-1">Class of (University)</h3>
                    <p className="text-lg md:text-xl font-bold text-dark-text">{profileUser.universityClassOf}</p>
                  </div>
                )}
                {profileUser.university && (
                  <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                    <h3 className="text-base font-semibold text-cpss-green mb-1">University/Workplace</h3>
                    <p className="text-lg md:text-xl font-bold text-dark-text">{profileUser.university}</p>
                  </div>
                )}
                {profileUser.program && (
                  <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                    <h3 className="text-base font-semibold text-cpss-green mb-1">Program/Major</h3>
                    <p className="text-lg md:text-xl font-bold text-dark-text">{profileUser.program}</p>
                  </div>
                )}
                {profileUser.jobTitle && (
                  <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                    <h3 className="text-base font-semibold text-cpss-green mb-1">Current Career/Job Title</h3>
                    <p className="text-lg md:text-xl font-bold text-dark-text">{profileUser.jobTitle}</p>
                  </div>
                )}
              </>
            )}

            {profileUser.role === 'teacher' && (
              <>
                {profileUser.subject && (
                  <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                    <h3 className="text-base font-semibold text-cpss-green mb-1">Subject / Class</h3>
                    <p className="text-lg md:text-xl font-bold text-dark-text">{profileUser.subject}</p>
                  </div>
                )}
              </>
            )}

            {profileUser.bio && (
              <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                <h3 className="text-base font-semibold text-cpss-green mb-3">Bio</h3>
                <p className="text-base md:text-lg text-dark-text-secondary whitespace-pre-wrap leading-relaxed">{profileUser.bio}</p>
              </div>
            )}

            {/* LinkedIn Button */}
            {profileUser.linkedinUrl && (
              <div className="p-4 bg-dark-bg-secondary border border-dark-border rounded-apple">
                <a
                  href={profileUser.linkedinUrl.startsWith('http') ? profileUser.linkedinUrl : `https://${profileUser.linkedinUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-[#0077b5] text-white rounded-apple-lg hover:bg-[#006399] transition-all shadow-apple hover:shadow-apple-lg w-full"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="font-semibold text-base">View LinkedIn Profile</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  )
}

