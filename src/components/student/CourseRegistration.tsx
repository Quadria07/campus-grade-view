
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Search, Filter, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  semester: string;
  department: string;
  level: string;
  lecturer: string;
  isRegistered: boolean;
  isRequired: boolean;
}

const CourseRegistration: React.FC = () => {
  const [availableCourses] = useState<Course[]>([
    {
      id: '1',
      code: 'CSC401',
      title: 'Software Engineering',
      units: 3,
      semester: 'First',
      department: 'Computer Science',
      level: 'ND 2',
      lecturer: 'Dr. Johnson',
      isRegistered: false,
      isRequired: true
    },
    {
      id: '2',
      code: 'CSC402',
      title: 'Database Systems',
      units: 3,
      semester: 'First',
      department: 'Computer Science',
      level: 'ND 2',
      lecturer: 'Prof. Smith',
      isRegistered: true,
      isRequired: true
    },
    {
      id: '3',
      code: 'CSC403',
      title: 'Computer Networks',
      units: 2,
      semester: 'First',
      department: 'Computer Science',
      level: 'ND 2',
      lecturer: 'Dr. Williams',
      isRegistered: false,
      isRequired: false
    },
    {
      id: '4',
      code: 'MTH401',
      title: 'Numerical Analysis',
      units: 3,
      semester: 'First',
      department: 'Mathematics',
      level: 'ND 2',
      lecturer: 'Dr. Brown',
      isRegistered: false,
      isRequired: false
    }
  ]);

  const [selectedCourses, setSelectedCourses] = useState<string[]>(
    availableCourses.filter(course => course.isRegistered).map(course => course.id)
  );
  const [selectedSemester, setSelectedSemester] = useState('First');
  const [selectedSession, setSelectedSession] = useState('2023/2024');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = availableCourses.filter(course => {
    const matchesSemester = course.semester === selectedSemester;
    const matchesSearch = searchTerm === '' || 
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSemester && matchesSearch;
  });

  const handleCourseSelection = (courseId: string, checked: boolean) => {
    if (checked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    }
  };

  const getTotalUnits = () => {
    return availableCourses
      .filter(course => selectedCourses.includes(course.id))
      .reduce((total, course) => total + course.units, 0);
  };

  const handleSaveRegistration = () => {
    toast({
      title: "Registration Saved",
      description: `Successfully registered for ${selectedCourses.length} courses (${getTotalUnits()} units)`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Registration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Course Registration
          </CardTitle>
          <CardDescription>
            Register for courses for {selectedSession} academic session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{selectedCourses.length}</div>
                <div className="text-sm text-gray-600">Registered Courses</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{getTotalUnits()}</div>
                <div className="text-sm text-gray-600">Total Units</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {availableCourses.filter(c => c.isRequired && selectedCourses.includes(c.id)).length}/
                  {availableCourses.filter(c => c.isRequired).length}
                </div>
                <div className="text-sm text-gray-600">Required Courses</div>
              </CardContent>
            </Card>
          </div>

          {/* Session and Semester Selection */}
          <div className="flex space-x-4 mb-6">
            <div className="space-y-2">
              <Label>Academic Session</Label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2022/2023">2022/2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First">First Semester</SelectItem>
                  <SelectItem value="Second">Second Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search and Save */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveRegistration} className="ml-4">
              <Save className="w-4 h-4 mr-2" />
              Save Registration
            </Button>
          </div>

          {/* Available Courses Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead className="text-center">Units</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={(checked) => handleCourseSelection(course.id, checked as boolean)}
                        disabled={course.isRequired && course.isRegistered}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell className="text-center">{course.units}</TableCell>
                    <TableCell>{course.lecturer}</TableCell>
                    <TableCell>
                      <Badge variant={course.isRequired ? 'default' : 'secondary'}>
                        {course.isRequired ? 'Required' : 'Elective'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={selectedCourses.includes(course.id) ? 'default' : 'outline'}>
                        {selectedCourses.includes(course.id) ? 'Registered' : 'Available'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseRegistration;
