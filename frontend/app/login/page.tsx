'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserRole } from '@/lib/types';

const demoAccounts: { email: string; role: UserRole; name: string }[] = [
  { email: 'admin@gmail.com', role: 'admin', name: 'Admin' },
  { email: 'waiter@gmail.com', role: 'waiter', name: 'Marcus Johnson' },
  // { email: 'kitchen@gmail.com', role: 'kitchen', name: 'Chef Antonio' },
  { email: 'cashier@gmail.com', role: 'cashier', name: 'Emily Rodriguez' },
];

function LoginForm() {
  const router = useRouter();
  const { login, isLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const loggedInUser = await login(email, password);
    if (loggedInUser) {
      router.push(`/dashboard/${loggedInUser.role}`);
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary">
            <UtensilsCrossed className="size-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">DineFlow</h1>
          <p className="text-muted-foreground">Restaurant Management System</p>
        </div>

        {/* Login Card */}
        <Card className="bg-card border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-foreground">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="touch-target"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 touch-target"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full touch-target" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground">
              Quick Demo Access
            </CardTitle>
            <CardDescription className="text-xs">
              Click any role to sign in instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <Button
                  key={account.email}
                  variant="outline"
                  className="flex flex-col h-auto py-3 text-white hover:text-none touch-target"
                  disabled={isLoading}
                >
                  <span className="font-medium capitalize">{account.role}</span>
                  <span className="text-xs text-muted-foreground">{account.email}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Demo credentials: any email above + password: [admin@123, waiter@123, cashier@123]
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
