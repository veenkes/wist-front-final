import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import wistLogo from '@/assets/wist-logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      navigate('/dashboard');
    } catch (error: any) {
      // If login fails with invalid credentials, check if it's a test account
      if (error.message?.includes('Invalid login credentials')) {
        const testAccounts: Record<string, { role: 'ceo' | 'teacher' | 'accountant', name: string }> = {
          'admin01@coreline.uz': { role: 'ceo', name: 'Alexander CEO' },
          'teacher01@coreline.uz': { role: 'teacher', name: 'Maria Teacher' },
          'accountant01@coreline.uz': { role: 'accountant', name: 'David Accountant' },
        };

        const testAccount = testAccounts[email];
        
        if (testAccount && password === '123456') {
          try {
            // Auto-create test account
            const { supabase } = await import('@/integrations/supabase/client');
            
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: testAccount.name,
                },
              },
            });

            if (signUpError) throw signUpError;
            if (!signUpData.user) throw new Error('Failed to create account');

            // Assign role
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: signUpData.user.id,
                role: testAccount.role,
              });

            if (roleError) console.error('Role assignment error:', roleError);

            // If not CEO, create employee record
            if (testAccount.role !== 'ceo') {
              const { error: empError } = await supabase
                .from('employees')
                .insert({
                  user_id: signUpData.user.id,
                  full_name: testAccount.name,
                  email: email,
                  status: 'active',
                  salary: testAccount.role === 'accountant' ? 2000000 : 1500000,
                  payment_schedule: 'monthly',
                });

              if (empError) console.error('Employee creation error:', empError);
            }

            toast({
              title: 'Account Created',
              description: 'Test account created and logged in successfully',
            });

            navigate('/dashboard');
            return;
          } catch (createError: any) {
            console.error('Account creation error:', createError);
            toast({
              title: 'Account Creation Failed',
              description: 'Please try again',
              variant: 'destructive',
            });
          }
        }
      }

      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <img src={wistLogo} alt="CoreLine" className="h-16" />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">CoreLine</h1>
            <p className="text-muted-foreground mt-2">Management System</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email or Username</Label>
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </form>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center mb-3">
            Test Credentials (Click to fill)
          </p>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => fillTestCredentials('admin01@coreline.uz', '123456')}
              type="button"
            >
              <span className="font-semibold mr-2">CEO:</span>
              admin01@coreline.uz / 123456
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => fillTestCredentials('teacher01@coreline.uz', '123456')}
              type="button"
            >
              <span className="font-semibold mr-2">Teacher:</span>
              teacher01@coreline.uz / 123456
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => fillTestCredentials('accountant01@coreline.uz', '123456')}
              type="button"
            >
              <span className="font-semibold mr-2">Accountant:</span>
              accountant01@coreline.uz / 123456
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          CoreLine Management System v1.0
        </p>
      </Card>
    </div>
  );
};

export default Login;