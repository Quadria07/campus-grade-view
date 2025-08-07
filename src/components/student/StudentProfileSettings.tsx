
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Lock, LogOut, GraduationCap, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const StudentProfileSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const [error, setError] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      // In demo mode, just simulate password change
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (err: any) {
      setError('Failed to update password');
      toast({
        title: "Password Update Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your account settings and security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Matric Number</Label>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{user?.profile?.matricNumber || 'STU001'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{user?.profile?.name || 'Demo Student'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <span className="text-gray-700">{user?.email || 'demo@student.com'}</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Department</Label>
                    <span className="text-gray-700">{user?.profile?.department || 'Computer Science'}</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Level</Label>
                    <span className="text-gray-700">{user?.profile?.level || 'ND 1'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                    <span className="text-gray-700">{user?.profile?.phone || 'Not provided'}</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Academic Session</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>2023/2024</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Registration Date</Label>
                    <span className="text-gray-700">September 2023</span>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Your profile information is managed by the institution. 
                  If you need to update any details, please contact the registrar's office.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ensure your account is using a long, random password to stay secure.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="pl-10"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Password must be at least 8 characters long.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Update Password
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="account" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Actions</h3>
                  <p className="text-sm text-gray-600">
                    Manage your account settings and preferences.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Logout</CardTitle>
                    <CardDescription>
                      Sign out of your account securely
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="destructive"
                      onClick={logout}
                      className="flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout Securely
                    </Button>
                  </CardContent>
                </Card>

                <Alert>
                  <AlertDescription>
                    For account deletion or major changes, please contact the student affairs office.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfileSettings;
