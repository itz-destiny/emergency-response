import { useEffect, useState } from 'react'
import { useSupabase } from '../provider'
import { RealtimeChannel } from '@supabase/supabase-js'

export type Message = {
  id: number
  content: string
  hospital_id: string
  firebase_user_id: string
  status: 'pending' | 'delivered' | 'read'
  created_at: string
}

export function useRealtimeMessages(hospitalId?: string) {
  const { supabase } = useSupabase()
  const [messages, setMessages] = useState<Message[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    // Initial fetch of messages
    const fetchMessages = async () => {
      try {
        const query = supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (hospitalId) {
          query.eq('hospital_id', hospitalId)
        }

        const { data, error } = await query
        if (error) {
          console.error('Error fetching messages:', error)
          return
        }
        if (data) setMessages(data)
      } catch (error) {
        console.error('Error in fetchMessages:', error)
      }
    }

    fetchMessages()

    // Set up real-time subscription
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message
            if (!hospitalId || newMessage.hospital_id === hospitalId) {
              setMessages((current) => [newMessage, ...current])
            }
          } else if (payload.eventType === 'UPDATE') {
            setMessages((current) =>
              current.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setMessages((current) =>
              current.filter((msg) => msg.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    setChannel(channel)

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, hospitalId])

  const sendMessage = async (content: string, hospitalId: string, firebaseUserId: string) => {
    if (!content?.trim() || !hospitalId || !firebaseUserId) {
      throw new Error('Missing required fields for sending message')
    }

    try {
      const messageData = {
        content: content.trim(),
        hospital_id: hospitalId,
        firebase_user_id: firebaseUserId,
        status: 'pending'
      }

      console.log('Sending message:', messageData)

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Message sent successfully:', data)
      return data
    } catch (error) {
      console.error('Error in sendMessage:', error)
      throw error
    }
  }

  return {
    messages,
    sendMessage
  }
}