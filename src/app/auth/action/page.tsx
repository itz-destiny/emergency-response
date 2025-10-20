import { Suspense } from 'react';
import ActionHandler from './action-handler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActionHandlerPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
       <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Account Action
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading...</p>}>
            <ActionHandler />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
