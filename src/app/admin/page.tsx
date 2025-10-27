'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageList } from '@/components/messages/message-list';
import { hospitals as hospitalData } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminPage() {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | 'all'>('all');

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Messages Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedHospitalId(value)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Messages</TabsTrigger>
              {hospitalData.map((hospital) => (
                <TabsTrigger key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all">
              <MessageList />
            </TabsContent>
            {hospitalData.map((hospital) => (
              <TabsContent key={hospital.id} value={hospital.id}>
                <MessageList hospitalId={hospital.id} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
