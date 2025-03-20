'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useWallet } from '@/lib/starknet/wallet-context';
import { IdentityContract } from '@/lib/starknet/identity-contract';
import IdentityStatus from '@/components/identity/identity-status';
import { toast } from 'sonner';

const formSchema = z.object({
  address: z.string().min(10, {
    message: 'Address must be at least 10 characters.',
  }),
});

export default function CheckPage() {
  const { wallet } = useWallet();
  const [checkedAddress, setCheckedAddress] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!wallet) {
      toast.error('Please connect your wallet first to access the Starknet network');
      return;
    }

    setIsChecking(true);
    try {
      // Basic validation
      const address = values.address.trim();
      if (!address.startsWith('0x') || address.length < 10) {
        toast.error('Please enter a valid Starknet address');
        return;
      }

      setCheckedAddress(address);
    } catch (error) {
      console.error('Error checking address:', error);
      toast.error('Failed to check address. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Verify Identity Status</h1>
        <p className="text-muted-foreground">Check if a Starknet address has a verified identity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Address Lookup</CardTitle>
          <CardDescription>
            Enter a Starknet address to check its identity verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starknet Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0x..." 
                        {...field} 
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isChecking || !wallet}>
                  {isChecking ? 'Checking...' : 'Check Address'}
                </Button>
              </div>
              {!wallet && (
                <p className="text-sm text-amber-600">
                  Connect your wallet first to access the Starknet network
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {checkedAddress && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Results for {checkedAddress.slice(0, 6)}...{checkedAddress.slice(-4)}</h2>
          <IdentityStatus address={checkedAddress} />
        </div>
      )}
    </div>
  );
}