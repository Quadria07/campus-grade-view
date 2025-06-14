
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Upload, Pencil, Trash2, Search } from 'lucide-react';
import { useStudents, useAddStudent, useUpdateStudent, useDeleteStudent, type Student } from '@/hooks/useStudents';
import StudentForm from './StudentForm';
import BulkUploadDialog from './BulkUploadDialog';

const StudentManagement: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: students = [], isLoading, error } = useStudents();
  const addStudentMutation = useAddStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();

  console.log('Students data:', students);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.matric_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = async (studentData: any) => {
    try {
      await addStudentMutation.mutateAsync(studentData);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = async (studentData: any) => {
    if (!editingStudent) return;
    
    try {
      await updateStudentMutation.mutateAsync({
        id: editingStudent.id,
        ...studentData
      });
      setIsEditDialogOpen(false);
      setEditingStudent(null);
    } catch (error) {
      console.error('Failed to update student:', error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        await deleteStudentMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <p>Error loading students: {error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Student Management
              </CardTitle>
              <CardDescription>
                Manage student records, add new students, and bulk uploads
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload CSV
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                      Enter the student details below
                    </DialogDescription>
                  </DialogHeader>
                  <StudentForm
                    onSubmit={handleAddStudent}
                    onCancel={() => setIsAddDialogOpen(false)}
                    isLoading={addStudentMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search students by name, matric number, or email..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading students...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matric Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No students found matching your search.' : 'No students added yet.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.matric_number}</TableCell>
                        <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.department?.name || 'Not assigned'}</TableCell>
                        <TableCell>{student.level}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              student.status === 'active' ? 'default' : 
                              student.status === 'graduated' ? 'secondary' : 'destructive'
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteStudent(student.id)}
                              disabled={deleteStudentMutation.isPending}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student details below
            </DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <StudentForm
              student={editingStudent}
              onSubmit={handleUpdateStudent}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingStudent(null);
              }}
              isLoading={updateStudentMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />
    </div>
  );
};

export default StudentManagement;
