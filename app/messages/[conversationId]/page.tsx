'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { Conversation, Message, User } from '@/lib/types'
import Navigation from '@/components/Navigation'
import Button from '@/components/Button'
import RoleBadge from '@/components/RoleBadge'
import BackButton from '@/components/BackButton'
import { formatTimestamp } from '@/lib/utils'

export default function ConversationPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const conversationId = params.conversationId as string
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && !userData) {
      router.push('/select-role')
    }
  }, [user, userData, loading, router])

  useEffect(() => {
    if (!conversationId || !user) return

    const loadConversation = async () => {
      const convDoc = await getDoc(doc(db, 'conversations', conversationId))
      if (!convDoc.exists()) {
        router.push('/messages')
        return
      }

      const convData = { id: convDoc.id, ...convDoc.data() } as Conversation
      setConversation(convData)

      const otherUserId = convData.participantIds.find(id => id !== user.uid)
      if (otherUserId) {
        const userDoc = await getDoc(doc(db, 'users', otherUserId))
        if (userDoc.exists()) {
          setOtherUser({ uid: userDoc.id, ...userDoc.data() } as User)
        }
      }
    }

    loadConversation()
  }, [conversationId, user, router])

  useEffect(() => {
    if (!conversationId) return

    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[]
      setMessages(messagesData)
    })

    return () => unsubscribe()
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !conversationId) return

    setIsSending(true)
    try {
      await addDoc(collection(db, 'messages'), {
        conversationId,
        senderId: user.uid,
        content: newMessage.trim(),
        createdAt: new Date(),
      })

      // Update conversation last message
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: newMessage.trim(),
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleDeleteMessage = async (messageId: string, messageContent: string) => {
    if (!user || !conversationId) return
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    setDeletingMessageId(messageId)
    try {
      // Delete the message
      await deleteDoc(doc(db, 'messages', messageId))

      // If this was the last message, update conversation's lastMessage
      const sortedMessages = [...messages].sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0)
        const bTime = b.createdAt?.toDate?.() || new Date(0)
        return bTime.getTime() - aTime.getTime()
      })

      if (sortedMessages.length > 0 && sortedMessages[0].id === messageId) {
        // This was the last message, update conversation
        const nextMessage = sortedMessages[1]
        if (nextMessage) {
          await updateDoc(doc(db, 'conversations', conversationId), {
            lastMessage: nextMessage.content,
            lastMessageAt: nextMessage.createdAt,
            updatedAt: new Date(),
          })
        } else {
          // No more messages, clear last message
          await updateDoc(doc(db, 'conversations', conversationId), {
            lastMessage: '',
            lastMessageAt: null,
            updatedAt: new Date(),
          })
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message. Please try again.')
    } finally {
      setDeletingMessageId(null)
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

  return (
    <div className="min-h-screen bg-dark-bg-secondary pt-14 md:pt-16 flex flex-col">
      {/* Header */}
      {otherUser && (
        <div className="bg-dark-bg-card border-b border-dark-border shadow-apple sticky top-14 md:top-16 z-10">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <BackButton href="/messages" />
              <div className="w-12 h-12 rounded-full bg-cpss-green/20 flex items-center justify-center text-cpss-green text-xl font-semibold flex-shrink-0">
                {otherUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg text-dark-text truncate">
                  {otherUser.fullName}
                </h2>
                {otherUser.username && (
                  <p className="text-sm text-dark-text-muted">@{otherUser.username}</p>
                )}
              </div>
              <RoleBadge role={otherUser.role} />
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-dark-bg-card flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-dark-text-secondary">No messages yet</p>
              <p className="text-sm text-dark-text-muted mt-1">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.senderId === user?.uid
              const canDelete = isOwn || userData?.role === 'teacher'
              const senderRole = isOwn ? userData?.role : otherUser?.role
              const isDeleting = deletingMessageId === message.id
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group relative`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-md ${
                      isOwn ? 'flex flex-col items-end' : 'flex flex-col items-start'
                    }`}
                  >
                    <div className="relative group/message">
                      <div
                        className={`px-4 py-3 rounded-apple-lg ${
                          isOwn
                          ? senderRole === 'student' 
                            ? 'bg-cpss-green text-white rounded-br-md'
                            : senderRole === 'alumni'
                            ? 'bg-cpss-gold text-cpss-black rounded-br-md'
                            : 'bg-dark-bg-card text-dark-text border border-dark-border rounded-br-md'
                            : 'bg-dark-bg-card text-dark-text border border-dark-border rounded-bl-md shadow-apple'
                        } ${isDeleting ? 'opacity-50' : ''}`}
                      >
                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed break-words">
                          {message.content}
                        </p>
                      </div>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteMessage(message.id, message.content)}
                          disabled={isDeleting}
                          className={`absolute ${isOwn ? '-left-10 md:-left-8' : '-right-10 md:-right-8'} top-1/2 -translate-y-1/2 w-8 h-8 md:w-6 md:h-6 rounded-full bg-red-500/90 hover:bg-red-500 active:bg-red-600 flex items-center justify-center opacity-70 md:opacity-0 group-hover/message:opacity-100 transition-opacity touch-manipulation ${
                            isDeleting ? 'opacity-100 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title="Delete message"
                        >
                          {isDeleting ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4 md:w-3.5 md:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-1.5 px-1 ${
                        isOwn ? 'text-dark-text-muted' : 'text-dark-text-muted'
                      }`}
                    >
                      {formatTimestamp(message.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-dark-bg-card border-t border-dark-border px-4 md:px-6 py-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 pr-12 text-[15px] border border-dark-border rounded-apple-xl bg-dark-bg-secondary text-dark-text focus:outline-none focus:ring-2 focus:ring-cpss-green focus:border-cpss-green resize-none max-h-32 overflow-y-auto placeholder-dark-text-muted"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (newMessage.trim() && !isSending) {
                      const syntheticEvent = {
                        preventDefault: () => {},
                      } as React.FormEvent
                      await handleSendMessage(syntheticEvent)
                    }
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className={`px-6 py-3 rounded-apple-xl font-medium text-sm transition-all flex-shrink-0 ${
                newMessage.trim() && !isSending
                  ? 'bg-cpss-green text-white hover:bg-primary-dark shadow-apple hover:shadow-apple-lg'
                  : 'bg-dark-border text-dark-text-muted cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
      </div>

      <Navigation />
    </div>
  )
}

