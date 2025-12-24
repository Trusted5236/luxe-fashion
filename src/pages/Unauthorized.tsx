import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="font-display text-3xl font-medium mb-4">Access Denied</h1>
        <p className="text-body mb-8">
          You don't have permission to access this page.
        </p>
        <Button asChild variant="luxury">
          <Link to="/">Go to Homepage</Link>
        </Button>
      </div>
    </Layout>
  );
}