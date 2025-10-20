'use client';
import { useEffect, useState } from 'react';
import { applyActionCode, checkActionCode, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ActionHandler() {
  const auth = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [mode, setMode] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess]_useState<string | null>(null);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const actionCodeParam = searchParams.get('oobCode');

    if (modeParam && actionCodeParam) {
      setMode(modeParam);
      setActionCode(actionCodeParam);
      handleAction(modeParam, actionCodeParam);
    } else {
      setError('Invalid action link. Please try again.');
      setVerifying(false);
    }
  }, [searchParams]);

  const handleAction = async (mode: string, code: string) => {
    setVerifying(true);
    setError(null);
    setSuccess(null);

    try {
      switch (mode) {
        case 'resetPassword':
          await verifyPasswordResetCode(auth, code);
          setSuccess('Password reset code verified. You can now set a new password.');
          break;
        case 'recoverEmail':
          // Handle email recovery if needed
          break;
        case 'verifyEmail':
          await applyActionCode(auth, code);
          setSuccess('Your email has been verified successfully! You can now log in.');
          toast({ title: 'Email Verified', description: 'You can now log in with your credentials.' });
          router.push('/login');
          break;
        default:
          throw new Error('Invalid action mode.');
      }
    } catch (e: any) {
      setError(`Error: ${e.message}. Please try again or request a new link.`);
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }
    setVerifying(true);
    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess('Your password has been reset successfully. You can now log in with your new password.');
      toast({ title: 'Password Reset Successful', description: 'Please log in with your new password.' });
      router.push('/login');
    } catch (e: any) {
      setError(`Error resetting password: ${e.message}`);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return <p>Verifying action code...</p>;
  }
  if (error) {
    return <p className="text-destructive">{error}</p>;
  }
  if (mode === 'resetPassword' && success) {
    return (
      <form onSubmit={handleResetPassword} className="space-y-4">
        <p>{success}</p>
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
          />
        </div>
        <Button type="submit" className="w-full">Reset Password</Button>
      </form>
    );
  }
  if (success) {
    return <p className="text-primary">{success}</p>;
  }
  return <p>Invalid request. Please return to the homepage.</p>;
}
