
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSessions, useAddSession, useUpdateSession } from '../../hooks/useSessions';

interface SessionFormData {
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const SessionManagement: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const { data: sessions } = useSessions();
  const addSessionMutation = useAddSession();
  const updateSessionMutation = useUpdateSession();

  const form = useForm<SessionFormData>({
    defaultValues: {
      name: '',
      start_date: '',
      end_date: '',
      is_active: false,
    },
  });

  const handleAddSession = async (data: SessionFormData) => {
    try {
      await addSessionMutation.mutateAsync(data);
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to add session:', error);
    }
  };

  const handleEditSession = (session: any) => {
    setEditingSession(session);
    form.setValue('name', session.name);
    form.setValue('start_date', session.start_date);
    form.setValue('end_date', session.end_date);
    form.setValue('is_active', session.is_active);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSession = async (data: SessionFormData) => {
    if (!editingSession) return;
    try {
      await updateSessionMutation.mutateAsync({
        id: editingSession.id,
        ...data
      });
      setIsEditDialogOpen(false);
      setEditingSession(null);
      form.reset();
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  };

  const resetForm = () => {
    form.reset();
    setEditingSession(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Management</CardTitle>
        <CardDescription>Manage academic sessions in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Session</DialogTitle>
                <DialogDescription>
                  Enter the session details below
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddSession)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2023/2024 Academic Session" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Session</FormLabel>
                          <FormDescription>
                            Set this session as currently active
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addSessionMutation.isPending}>
                      {addSessionMutation.isPending ? 'Adding...' : 'Add Session'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions?.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.name}</TableCell>
                <TableCell>{new Date(session.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(session.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={session.is_active ? "default" : "secondary"}>
                    {session.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSession(session)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!sessions?.length && (
          <div className="text-center py-8">
            <p className="text-gray-500">No sessions found. Add your first session to get started.</p>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Session</DialogTitle>
              <DialogDescription>
                Update the session details below
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateSession)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2023/2024 Academic Session" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Session</FormLabel>
                        <FormDescription>
                          Set this session as currently active
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateSessionMutation.isPending}>
                    {updateSessionMutation.isPending ? 'Updating...' : 'Update Session'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SessionManagement;
