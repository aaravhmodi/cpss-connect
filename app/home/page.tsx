'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { Post, User } from '@/lib/types'
import Navigation from '@/components/Navigation'
import Button from '@/components/Button'
import RoleBadge from '@/components/RoleBadge'
import { formatTimestamp } from '@/lib/utils'

export default function HomePage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [authorMap, setAuthorMap] = useState<Record<string, User>>({})
  const [newPost, setNewPost] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'alumni'>('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && !userData) {
      router.push('/select-role')
    }
  }, [user, userData, loading, router])

  useEffect(() => {
    if (!userData) return

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[]
      setPosts(postsData)

      // Fetch author data for all posts
      const authorIds = [...new Set(postsData.map(post => post.authorId))]
      const authorData: Record<string, User> = {}
      
      await Promise.all(
        authorIds.map(async (authorId) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', authorId))
            if (userDoc.exists()) {
              authorData[authorId] = { uid: userDoc.id, ...userDoc.data() } as User
            }
          } catch (error) {
            console.error(`Error fetching user ${authorId}:`, error)
          }
        })
      )
      
      setAuthorMap(authorData)
    })

    return () => unsubscribe()
  }, [userData])

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() || !user || !userData) return

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorRole: userData.role,
        content: newPost.trim(),
        createdAt: new Date(),
      })
      setNewPost('')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!user || !userData) return
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await deleteDoc(doc(db, 'posts', postId))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const filteredPosts = roleFilter === 'all' 
    ? posts 
    : posts.filter(post => post.authorRole === roleFilter)

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

  const displayName = userData.fullName

  return (
    <div className="min-h-screen bg-dark-bg pt-14 md:pt-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-dark-text">
            Welcome back, {displayName}
          </h1>
        </div>

        {/* Create Post Form - Large and Prominent */}
        <div className="bg-dark-bg-card border border-dark-border rounded-apple-lg shadow-apple p-6 md:p-8 mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-dark-text mb-4">Share something</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What would you like to share with the community?"
              className="w-full px-5 py-4 text-base md:text-lg border border-dark-border rounded-apple bg-dark-bg-secondary text-dark-text focus:outline-none focus:ring-2 focus:ring-cpss-green focus:border-cpss-green resize-none placeholder-dark-text-muted"
              rows={5}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                isLoading={isSubmitting} 
                disabled={!newPost.trim()}
                className="px-8 py-3 text-base font-medium"
              >
                Post
              </Button>
            </div>
          </form>
        </div>

        {/* Filter Buttons - Larger for Mobile */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-6 py-3 rounded-apple-xl text-base font-medium transition-all whitespace-nowrap ${
              roleFilter === 'all' 
                ? 'bg-cpss-green text-white shadow-apple' 
                : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-border'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setRoleFilter('student')}
            className={`px-6 py-3 rounded-apple-xl text-base font-medium transition-all whitespace-nowrap ${
              roleFilter === 'student' 
                ? 'bg-cpss-green text-white shadow-apple' 
                : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-border'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setRoleFilter('alumni')}
            className={`px-6 py-3 rounded-apple-xl text-base font-medium transition-all whitespace-nowrap ${
              roleFilter === 'alumni' 
                ? 'bg-cpss-green text-white shadow-apple' 
                : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-border'
            }`}
          >
            Alumni
          </button>
        </div>

        {/* Posts List - Larger Cards */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="bg-dark-bg-card border border-dark-border rounded-apple-lg shadow-apple p-12 text-center">
              <p className="text-lg text-dark-text-muted">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const author = authorMap[post.authorId]
                      const authorName = post.authorId === user?.uid 
                        ? 'You' 
                        : (author?.fullName || 'Unknown User')
                      
                      const authorDisplayName = author?.fullName || 'U'
              
              return (
                <div key={post.id} className="bg-dark-bg-card border border-dark-border rounded-apple-lg shadow-apple p-6 md:p-8 hover:shadow-apple-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-cpss-green/20 flex items-center justify-center text-cpss-green text-lg md:text-xl font-semibold flex-shrink-0">
                        {authorDisplayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-lg md:text-xl text-dark-text">
                            {authorName}
                          </span>
                          <RoleBadge role={post.authorRole} />
                        </div>
                        <p className="text-sm md:text-base text-dark-text-muted mt-1">
                          {formatTimestamp(post.createdAt)}
                        </p>
                      </div>
                    </div>
                            {post.authorId === user?.uid && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-400 hover:text-red-300 text-sm md:text-base font-medium px-3 py-2 rounded-apple hover:bg-red-900/20 transition-colors flex-shrink-0"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-base md:text-lg text-dark-text-secondary whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </div>
      <Navigation />
    </div>
  )
}

