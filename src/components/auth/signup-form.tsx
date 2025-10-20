'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        createdAt: serverTimestamp(),
      };
      // This is a non-blocking write, but we await the user creation first.
      setDocumentNonBlocking(userRef, userData, { merge: true });

      // Create role document
      const roleRef = doc(firestore, 'roles_user', user.uid);
      setDocumentNonBlocking(roleRef, { role: 'user' }, { merge: true });

      toast({
        title: 'Account Created!',
        description: "We've created your account for you. Redirecting...",
      });
      router.push('/'); // Navigate to home page after successful signup
    
    } catch (error: any) {
      let title = 'Sign-up Error';
      let description = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            title = 'Email Already Registered';
            description = 'An account with this email already exists. Please log in.';
            break;
          case 'auth/weak-password':
            title = 'Weak Password';
            description = 'Your password is too weak. Please choose a stronger one.';
            break;
          case 'auth/invalid-email':
            title: 'Invalid Email';
            description = 'Please enter a valid email address.';
            break;
          default:
            // This can happen if firestore rules deny the write
            title = 'Permission Denied';
            description = 'Could not save user profile. Please contact support.';
            console.error('Firestore Write Error:', error); // Log the actual error
            break;
        }
      } else {
         console.error('Generic Signup Error:', error);
      }

      toast({
        variant: 'destructive',
        title: title,
        description: description,
      });
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
}
