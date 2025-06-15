
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDepartments, useAddDepartment, useUpdateDepartment } from '../../hooks/useDepartments';

interface DepartmentFormData {
  name: string;
  code: string;
}

const DepartmentManagement: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const { data: departments } = useDepartments();
  const addDepartmentMutation = useAddDepartment();
  const updateDepartmentMutation = useUpdateDepartment();

  const form = useForm<DepartmentFormData>({
    defaultValues: {
      name: '',
      code: '',
    },
  });

  const handleAddDepartment = async (data: DepartmentFormData) => {
    try {
      await addDepartmentMutation.mutateAsync(data);
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to add department:', error);
    }
  };

  const handleEditDepartment = (department: any) => {
    setEditingDepartment(department);
    form.setValue('name', department.name);
    form.setValue('code', department.code);
    setIsEditDialogOpen(true);
  };

  const handleUpdateDepartment = async (data: DepartmentFormData) => {
    if (!editingDepartment) return;
    try {
      await updateDepartmentMutation.mutateAsync({
        id: editingDepartment.id,
        ...data
      });
      setIsEditDialogOpen(false);
      setEditingDepartment(null);
      form.reset();
    } catch (error) {
      console.error('Failed to update department:', error);
    }
  };

  const resetForm = () => {
    form.reset();
    setEditingDepartment(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Management</CardTitle>
        <CardDescription>Manage academic departments in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>
                  Enter the department details below
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddDepartment)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CSC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addDepartmentMutation.isPending}>
                      {addDepartmentMutation.isPending ? 'Adding...' : 'Add Department'}
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
              <TableHead>Department Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments?.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{department.code}</Badge>
                </TableCell>
                <TableCell>{new Date(department.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDepartment(department)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!departments?.length && (
          <div className="text-center py-8">
            <p className="text-gray-500">No departments found. Add your first department to get started.</p>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update the department details below
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateDepartment)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CSC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateDepartmentMutation.isPending}>
                    {updateDepartmentMutation.isPending ? 'Updating...' : 'Update Department'}
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

export default DepartmentManagement;
