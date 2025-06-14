
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Upload, Download, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Result {
  id: string;
  studentName: string;
  matricNumber: string;
  courseCode: string;
  courseTitle: string;
  score: number;
  grade: string;
  semester: string;
  session: string;
}

const ResultManagement: React.FC = () => {
  const [results, setResults] = useState<Result[]>([
    {
      id: '1',
      studentName: 'John Doe',
      matricNumber: 'CSC/2020/001',
      courseCode: 'CSC401',
      courseTitle: 'Software Engineering',
      score: 78,
      grade: 'B+',
      semester: 'First',
      session: '2023/2024'
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      matricNumber: 'CSC/2020/002',
      courseCode: 'CSC401',
      courseTitle: 'Software Engineering',
      score: 85,
      grade: 'A',
      semester: 'First',
      session: '2023/2024'
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      matricNumber: 'CSC/2020/003',
      courseCode: 'CSC402',
      courseTitle: 'Database Systems',
      score: 72,
      grade: 'B',
      semester: 'First',
      session: '2023/2024'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newResult, setNewResult] = useState({
    studentName: '',
    matricNumber: '',
    courseCode: '',
    courseTitle: '',
    score: 0,
    semester: '',
    session: ''
  });

  const calculateGrade = (score: number): string => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'D+';
    if (score >= 50) return 'D';
    return 'F';
  };

  const handleAddResult = () => {
    const result: Result = {
      id: Date.now().toString(),
      ...newResult,
      grade: calculateGrade(newResult.score)
    };
    
    setResults([...results, result]);
    setNewResult({
      studentName: '',
      matricNumber: '',
      courseCode: '',
      courseTitle: '',
      score: 0,
      semester: '',
      session: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Result Added",
      description: "Student result has been successfully added.",
    });
  };

  const handleBulkUpload = () => {
    toast({
      title: "Bulk Upload",
      description: "CSV upload functionality would be implemented here.",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Result report has been generated and is ready for download.",
    });
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Result Management
              </CardTitle>
              <CardDescription>
                Upload, manage, and generate student results and reports
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleBulkUpload} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload CSV
              </Button>
              <Button onClick={handleGenerateReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Result
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Student Result</DialogTitle>
                    <DialogDescription>
                      Enter the result details below
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="matricNumber">Matric Number</Label>
                      <Input
                        id="matricNumber"
                        placeholder="CSC/2024/001"
                        value={newResult.matricNumber}
                        onChange={(e) => setNewResult({...newResult, matricNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input
                        id="studentName"
                        placeholder="John Doe"
                        value={newResult.studentName}
                        onChange={(e) => setNewResult({...newResult, studentName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseCode">Course Code</Label>
                      <Input
                        id="courseCode"
                        placeholder="CSC401"
                        value={newResult.courseCode}
                        onChange={(e) => setNewResult({...newResult, courseCode: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseTitle">Course Title</Label>
                      <Input
                        id="courseTitle"
                        placeholder="Software Engineering"
                        value={newResult.courseTitle}
                        onChange={(e) => setNewResult({...newResult, courseTitle: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="score">Score</Label>
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="85"
                        value={newResult.score || ''}
                        onChange={(e) => setNewResult({...newResult, score: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select onValueChange={(value) => setNewResult({...newResult, semester: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First">First Semester</SelectItem>
                          <SelectItem value="Second">Second Semester</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session">Academic Session</Label>
                      <Input
                        id="session"
                        placeholder="2023/2024"
                        value={newResult.session}
                        onChange={(e) => setNewResult({...newResult, session: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddResult}>Add Result</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-4">
            <Input
              placeholder="Search by student name or matric number..."
              className="max-w-sm"
            />
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="CSC401">CSC401</SelectItem>
                <SelectItem value="CSC402">CSC402</SelectItem>
                <SelectItem value="CSC403">CSC403</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matric Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.matricNumber}</TableCell>
                  <TableCell>{result.studentName}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.courseCode}</div>
                      <div className="text-sm text-gray-500">{result.courseTitle}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{result.score}</TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(result.grade)}>
                      {result.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>{result.semester}</TableCell>
                  <TableCell>{result.session}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
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

export default ResultManagement;
