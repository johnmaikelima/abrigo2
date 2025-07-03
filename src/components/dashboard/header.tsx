'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Sidebar } from './sidebar';
import { useSession } from 'next-auth/react';

export function Header() {
  const { data: session } = useSession();

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
              <Menu style={{ width: '20px', height: '20px' }} />
              <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>Alternar menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" style={{ width: '280px', padding: '0' }}>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <h1 style={{ fontSize: '20px', fontWeight: '600', margin: '0' }}>Dashboard</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : 'U'}
          </span>
        </div>
      </div>
    </div>
  );
}
