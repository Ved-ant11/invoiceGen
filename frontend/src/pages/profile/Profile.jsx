
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Profile = () => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Card>
        <CardHeader className="pb-0 pt-6 px-6 flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{user?.name}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Account Details</p>
            <div className="border rounded-md p-3">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="text-sm font-medium text-right">{user?.name}</div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-sm font-medium text-right">{user?.email}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 pt-0">
          <Button variant="destructive" onClick={logout} className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
