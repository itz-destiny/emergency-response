'use client';

import { useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useRealtimeMessages } from '@/supabase/hooks/use-realtime'
import { useFirebase } from '@/firebase'
import { useToast } from '@/hooks/use-toast'

interface MessageInputProps {
  hospitalId: string
  className?: string
}

export function MessageInput({ hospitalId, className }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const { sendMessage } = useRealtimeMessages(hospitalId)
  const { user } = useFirebase()
  const { toast } = useToast()

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Message cannot be empty'
      })
      return
    }

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to send messages'
      })
      return
    }

    try {
      console.log('Attempting to send message:', {
        content: message,
        hospitalId,
        userId: user.uid
      })

      setSending(true)
      await sendMessage(message, hospitalId, user.uid)
      setMessage('')
      
      toast({
        title: 'Success',
        description: 'Message sent successfully'
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message. Please try again.'
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={user ? "Type your message here..." : "Please login to send messages"}
        className="min-h-[100px]"
        disabled={!user || sending}
      />
      <Button
        onClick={handleSend}
        disabled={sending || !message.trim() || !user}
        className="w-full"
      >
        {sending ? 'Sending...' : user ? 'Send Message' : 'Login to Send Message'}
      </Button>
    </div>
  )
}