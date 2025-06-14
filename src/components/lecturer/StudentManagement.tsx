
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Upload, Pencil, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Student {
  id: string;
  matricNumber: string;
  name: string;
  email: string;
  department: string;
  level: string;
  phone: string;
  status: 'active' | 'inactive';
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      matricNumber: 'CSC/2020/001',
      name: 'John Doe',
      email: 'john.doe@student.edu',
      department: 'Computer Science',
      level: '400L',
      phone: '+234 901 234 5678',
      status: 'active'
    },
    {
      id: '2',
      matricNumber: 'CSC/2020/002',
      name: 'Jane Smith',
      email: 'jane.smith@student.edu',
      department: 'Computer Science',
      level: '400L',
      phone: '+234 902 345 6789',
      status: 'active'
    },
    {
      id: '3',
      matricNumber: 'CSC/2020/003',
      name: 'Mike Johnson',
      email: 'mike.johnson@student.edu',
      department: 'Computer Science',
      level: '300L',
      phone: '+234 903 456 7890',
      status: 'inactive'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    matricNumber: '',
    name: '',
    email: '',
    department: '',
    level: '',
    phone: ''
  });

  const handleAddStudent = () => {
    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
      status: 'active'
    };
    
    setStudents([...students, student]);
    setNewStudent({
      matricNumber: '',
      name: '',
      email: '',
      department: '',
      level: '',
      phone: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Student Added",
      description: "Student has been successfully added to the system.",
    });
  };

  const handleBulkUpload = () => {
    toast({
      title: "Bulk Upload",
      description: "CSV upload functionality would be implemented here.",
    });
  };

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
              <Button onClick={handleBulkUpload} variant="outline">
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
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                      Enter the student details below
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="matricNumber">Matric Number</Label>
                      <Input
                        id="matricNumber"
                        placeholder="CSC/2024/001"
                        value={newStudent.matricNumber}
                        onChange={(e) => setNewStudent({...newStudent, matricNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@student.edu"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select onValueChange={(value) => setNewStudent({...newStudent, department: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select onValueChange={(value) => setNewStudent({...newStudent, level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100L">100 Level</SelectItem>
                          <SelectItem value="200L">200 Level</SelectItem>
                          <SelectItem value="300L">300 Level</SelectItem>
                          <SelectItem value="400L">400 Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+234 901 234 5678"
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddStudent}>Add Student</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search students by name or matric number..."
              className="max-w-sm"
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matric Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.matricNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.level}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement;
