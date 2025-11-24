'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { User } from '@/lib/types'
import Navigation from '@/components/Navigation'
import RoleBadge from '@/components/RoleBadge'
import Link from 'next/link'

const ExploreIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export default function ExplorePage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'alumni' | 'teacher'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && !userData) {
      router.push('/select-role')
    }
  }, [user, userData, loading, router])

  useEffect(() => {
    if (!userData) return

    const q = query(collection(db, 'users'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs
        .map(doc => ({
          uid: doc.id,
          ...doc.data(),
        })) as User[]
      const filteredUsers = usersData.filter(u => u.uid !== user?.uid) // Exclude current user
      setUsers(filteredUsers)
    })

    return () => unsubscribe()
  }, [userData, user])

  const filteredUsers = users.filter(user => {
    // Ensure role exists and is valid
    if (!user.role || (user.role !== 'student' && user.role !== 'alumni' && user.role !== 'teacher')) {
      return false
    }
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesSearch = searchQuery === '' || 
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.university && user.university.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.program && user.program.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.jobTitle && user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.subject && user.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.interestedPrograms && user.interestedPrograms.some(p => 
        p.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    return matchesRole && matchesSearch
  })

  if (loading || !userData) {
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
    <div className="min-h-screen bg-dark-bg pt-14 md:pt-16">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-text mb-2">Explore</h1>
          <p className="text-lg md:text-xl text-dark-text-secondary">Discover the CPSS community</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-dark-bg-card border border-dark-border rounded-apple-lg shadow-apple p-6 md:p-8 mb-8 space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <ExploreIcon className="w-6 h-6 text-dark-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search by username, name, program, or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-base md:text-lg border border-dark-border rounded-apple-xl bg-dark-bg-secondary text-dark-text focus:outline-none focus:ring-2 focus:ring-cpss-green focus:border-cpss-green placeholder-dark-text-muted"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-6 py-3 rounded-apple-xl text-base font-medium transition-all ${
                roleFilter === 'all' ? 'bg-cpss-green text-white shadow-apple' : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-border'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRoleFilter('student')}
              className={`px-6 py-3 rounded-apple-xl text-base font-medium transition-all ${
                roleFilter === 'student' ? 'bg-cpss-green text-white shadow-apple' : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-border'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setRoleFilter('alumni')}
              className={`px-6 py-3 rounded-apple-xl text-base font-medium transition-all ${
                roleFilter === 'alumni' ? 'bg-cpss-green text-white shadow-apple' : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-border'
              }`}
            >
              Alumni
            </button>
            <button
              onClick={() => setRoleFilter('teacher')}
              className={`px-6 py-3 rounded-apple-xl text-base font-medium transition-all ${
                roleFilter === 'teacher' ? 'bg-cpss-green text-white shadow-apple' : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-border'
              }`}
            >
              Teachers
            </button>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-2 bg-dark-bg-card border border-dark-border rounded-apple-lg shadow-apple p-12 text-center">
              <p className="text-lg md:text-xl text-dark-text-muted">No users found.</p>
              {users.length === 0 && (
                <p className="text-sm text-dark-text-muted mt-2">No other users in the database yet.</p>
              )}
            </div>
          ) : (
            filteredUsers.map((userItem) => {
              const displayName = userItem.fullName
              return (
                <Link
                  key={userItem.uid}
                  href={`/profile/${userItem.uid}`}
                  className="bg-dark-bg-card border border-dark-border rounded-apple-lg shadow-apple p-6 md:p-8 hover:shadow-apple-lg hover:border-cpss-green/30 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cpss-green/20 flex items-center justify-center text-cpss-green text-2xl md:text-3xl font-semibold flex-shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-bold text-dark-text mb-2">{displayName}</h3>
                      <RoleBadge role={userItem.role} />
                    </div>
                  </div>
                
                  {userItem.role === 'student' && (
                    <div className="space-y-2 text-base text-dark-text-secondary">
                      {userItem.gradYear && (
                        <p className="font-medium">Graduating: {userItem.gradMonth && new Date(2000, userItem.gradMonth - 1).toLocaleString('default', { month: 'long' })} {userItem.gradYear}</p>
                      )}
                      {userItem.interestedPrograms && userItem.interestedPrograms.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userItem.interestedPrograms.map((program, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-cpss-gold text-cpss-black rounded-apple text-sm font-medium"
                            >
                              {program}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {userItem.role === 'alumni' && (
                    <div className="space-y-2 text-base text-dark-text-secondary">
                      {userItem.classOf && <p className="font-medium text-cpss-gold">Class of {userItem.classOf} (High School)</p>}
                      {userItem.universityClassOf && <p className="font-medium text-cpss-gold">Class of {userItem.universityClassOf} (University)</p>}
                      {userItem.university && <p><span className="font-medium text-cpss-gold">University:</span> <span className="text-dark-text-secondary">{userItem.university}</span></p>}
                      {userItem.program && <p><span className="font-medium text-cpss-gold">Program:</span> <span className="text-dark-text-secondary">{userItem.program}</span></p>}
                      {userItem.jobTitle && <p><span className="font-medium text-cpss-gold">Job:</span> <span className="text-dark-text-secondary">{userItem.jobTitle}</span></p>}
                    </div>
                  )}
                  
                  {userItem.role === 'teacher' && (
                    <div className="space-y-2 text-base text-dark-text-secondary">
                      {userItem.subject && <p><span className="font-medium text-cpss-gold">Teaches:</span> <span className="text-dark-text-secondary">{userItem.subject}</span></p>}
                    </div>
                  )}
                  
                  {userItem.bio && (
                    <p className="mt-4 text-base text-dark-text-muted line-clamp-2 leading-relaxed">{userItem.bio}</p>
                  )}
                </Link>
              )
            })
          )}
        </div>
      </div>
      <Navigation />
    </div>
  )
}

