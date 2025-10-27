import { useRealtimeMessages } from '@/supabase/hooks/use-realtime'
import { Card } from '../ui/card'
import { ScrollArea } from '../ui/scroll-area'
import { useFirebase } from '@/firebase'
import { Badge } from '../ui/badge'
import { Ambulance, Clock, AlertCircle } from 'lucide-react'

interface MessageListProps {
  hospitalId?: string
  className?: string
}

export function MessageList({ hospitalId, className }: MessageListProps) {
  const { messages } = useRealtimeMessages(hospitalId)
  const { user } = useFirebase()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge className="bg-green-500">
            <Ambulance className="w-4 h-4 mr-1" />
            Ambulance Dispatched
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="w-4 h-4 mr-1" />
            Requesting Ambulance
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-4 h-4 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  const getStatusMessage = (message: any) => {
    if (message.status === 'accepted') {
      return (
        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
          <p>Ambulance has been dispatched to your location.</p>
          <p className="text-xs mt-1">
            Dispatched at: {new Date(message.accepted_at).toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <ScrollArea className="h-[500px] p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = user?.uid === message.firebase_user_id
            
            return (
              <div
                key={message.id}
                className={`rounded-lg p-4 ${
                  isOwnMessage 
                    ? 'bg-primary/10 ml-auto' 
                    : 'bg-muted'
                } max-w-[80%]`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                  {getStatusBadge(message.status)}
                </div>
                <p className="mt-1">{message.content}</p>
                {getStatusMessage(message)}
              </div>
            )
          })}
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground">
              No ambulance requests yet
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}