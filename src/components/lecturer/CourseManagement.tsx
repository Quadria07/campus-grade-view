
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Pencil, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  department: string;
  level: string;
  semester: string;
  status: 'active' | 'inactive';
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      code: 'CSC401',
      title: 'Software Engineering',
      creditUnits: 3,
      department: 'Computer Science',
      level: '400L',
      semester: 'First',
      status: 'active'
    },
    {
      id: '2',
      code: 'CSC402',
      title: 'Database Systems',
      creditUnits: 3,
      department: 'Computer Science',
      level: '400L',
      semester: 'First',
      status: 'active'
    },
    {
      id: '3',
      code: 'CSC403',
      title: 'Computer Networks',
      creditUnits: 2,
      department: 'Computer Science',
      level: '400L',
      semester: 'Second',
      status: 'active'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    creditUnits: 0,
    department: '',
    level: '',
    semester: ''
  });

  const handleAddCourse = () => {
    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
      status: 'active'
    };
    
    setCourses([...courses, course]);
    setNewCourse({
      code: '',
      title: '',
      creditUnits: 0,
      department: '',
      level: '',
      semester: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Course Added",
      description: "Course has been successfully added to the system.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Course Management
              </CardTitle>
              <CardDescription>
                Manage course catalog, add new courses, and assign to departments
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>
                    Enter the course details below
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input
                      id="code"
                      placeholder="CSC401"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      placeholder="Software Engineering"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creditUnits">Credit Units</Label>
                    <Input
                      id="creditUnits"
                      type="number"
                      placeholder="3"
                      value={newCourse.creditUnits || ''}
                      onChange={(e) => setNewCourse({...newCourse, creditUnits: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={(value) => setNewCourse({...newCourse, department: value})}>
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
                    <Select onValueChange={(value) => setNewCourse({...newCourse, level: value})}>
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
                    <Label htmlFor="semester">Semester</Label>
                    <Select onValueChange={(value) => setNewCourse({...newCourse, semester: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First">First Semester</SelectItem>
                        <SelectItem value="Second">Second Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCourse}>Add Course</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search courses by code or title..."
              className="max-w-sm"
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Credit Units</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.creditUnits}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>
                    <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                      {course.status}
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

export default CourseManagement;
