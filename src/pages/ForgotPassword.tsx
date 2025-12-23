import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { requestPasswordReset } from '@/services/api';
import { set } from 'date-fns';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await requestPasswordReset({email});
      setIsLoading(false);
      setSent(true);
      toast({
        title: 'Reset Link Sent',
        description: 'Please check your email for further instructions.',
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to send reset link.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-medium">
              Forgot Password?
            </h1>
            <p className="mt-3 text-body">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-body">Check your email for reset instructions</p>
              <Link to="/auth">
                <Button variant="luxury">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-label" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-input-bg border-border"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="luxury"
                size="xl"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <Link to="/auth" className="text-sm text-primary hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}