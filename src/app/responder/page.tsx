'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hospitals } from '@/lib/data';
import { X, Ambulance } from 'lucide-react';
import { ClientTimestamp } from '@/components/client-timestamp';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeMessages, type Message } from '@/supabase/hooks/use-realtime';
import { useFirebase } from '@/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabase } from '@/supabase/provider';
import { Badge } from '@/components/ui/badge';

const MapContainer = dynamic(() => import('@/components/map-container'), {
  ssr: false,
  loading: () => <div className="bg-background animate-pulse w-full h-full" />,
});

const NIGERIA_RIVERS_STATE_PORT_HARCOURT = {
  lat: 4.8156,
  lng: 7.0498,
};

export default function ResponderPage() {
  const { toast } = useToast();
  const { messages } = useRealtimeMessages(); // No hospitalId means get all messages
  const { user } = useFirebase();
  const { supabase } = useSupabase();
  const [responderPosition] = useState<[number, number]>([NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<string | 'all'>('all');
  const [processingDispatch, setProcessingDispatch] = useState(false);

  const filteredMessages = selectedHospital === 'all' 
    ? messages.filter(msg => msg.status === 'pending') // Only show pending ambulance requests
    : messages.filter(msg => msg.hospital_id === selectedHospital && msg.status === 'pending');

  const handleDispatchAmbulance = async (message: Message) => {
    if (!user) return;

    try {
      setProcessingDispatch(true);

      // Update message status in Supabase
      const { error } = await supabase
        .from('messages')
        .update({ 
          status: 'accepted',
          responder_id: user.uid,
          accepted_at: new Date().toISOString()
        })
        .eq('id', message.id);

      if (error) throw error;

      toast({
        title: 'Ambulance Dispatched',
        description: `An ambulance has been dispatched to the patient's location.`,
      });
      
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to dispatch ambulance. Please try again.',
      });
    } finally {
      setProcessingDispatch(false);
    }
  };

  const getPatientPosition = (): [number, number] | undefined => {
    // This would need to be updated to use actual patient location from the message
    return [NIGERIA_RIVERS_STATE_PORT_HARCOURT.lat, NIGERIA_RIVERS_STATE_PORT_HARCOURT.lng];
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card>
          <CardContent className="py-6">
            <p className="text-center">Please login to view ambulance requests</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <div className="w-1/3 border-r border-border flex flex-col">
        <CardHeader>
          <CardTitle>Ambulance Requests</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedHospital(value)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Hospitals</TabsTrigger>
              {hospitals.map((hospital) => (
                <TabsTrigger key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              {filteredMessages.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">
                  No pending ambulance requests
                </p>
              ) : (
                filteredMessages.map((message) => {
                  const hospital = hospitals.find(h => h.id === message.hospital_id);
                  return (
                    <Card 
                      key={message.id} 
                      className={`cursor-pointer hover:bg-muted/50 ${selectedMessage?.id === message.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {hospital?.name || 'Unknown Hospital'}
                          </CardTitle>
                          <Badge variant="secondary">
                            Needs Ambulance
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{message.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          <ClientTimestamp timestamp={message.created_at} />
                        </p>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </Tabs>
        </CardContent>
      </div>
      <div className="w-2/3 relative">
        <MapContainer
          hospitals={hospitals}
          patientPosition={responderPosition}
          responder={{
            position: responderPosition,
            patientPosition: getPatientPosition(),
          }}
        />
        {selectedMessage && (
          <Card className="absolute top-4 left-4 z-[1000] bg-card/80 backdrop-blur-lg">
             <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Emergency Request Details</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p><strong>Hospital:</strong> {hospitals.find(h => h.id === selectedMessage.hospital_id)?.name}</p>
              <p><strong>Message:</strong> {selectedMessage.content}</p>
              <p><strong>Requested at:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</p>
              <Button 
                className="w-full mt-4" 
                onClick={() => handleDispatchAmbulance(selectedMessage)}
                disabled={processingDispatch}
              >
                <Ambulance className="w-4 h-4 mr-2" />
                {processingDispatch ? 'Dispatching...' : 'Dispatch Ambulance'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}