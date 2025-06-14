
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Upload, Download, Pencil, Trash2, FileUp, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useResults, useAddResult, useUpdateResult, useDeleteResult, useBulkAddResults, Result } from '@/hooks/useResults';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useSemesters } from '@/hooks/useSemesters';
import { useSessions } from '@/hooks/useSessions';

const ResultManagement: React.FC = () => {
  const { data: results = [], isLoading: resultsLoading } = useResults();
  const { data: students = [] } = useStudents();
  const { data: courses = [] } = useCourses();
  const { data: semesters = [] } = useSemesters();
  const { data: sessions = [] } = useSessions();
  
  const addResultMutation = useAddResult();
  const updateResultMutation = useUpdateResult();
  const deleteResultMutation = useDeleteResult();
  const bulkAddMutation = useBulkAddResults();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterSession, setFilterSession] = useState('all');

  const [newResult, setNewResult] = useState({
    student_id: '',
    course_id: '',
    semester_id: '',
    session_id: '',
    score: 0,
    remarks: ''
  });

  const resetForm = () => {
    setNewResult({
      student_id: '',
      course_id: '',
      semester_id: '',
      session_id: '',
      score: 0,
      remarks: ''
    });
  };

  const handleAddResult = async () => {
    if (!newResult.student_id || !newResult.course_id || !newResult.semester_id || !newResult.session_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    await addResultMutation.mutateAsync(newResult);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditResult = (result: Result) => {
    setEditingResult(result);
    setNewResult({
      student_id: result.student_id,
      course_id: result.course_id,
      semester_id: result.semester_id,
      session_id: result.session_id,
      score: result.score,
      remarks: result.remarks || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateResult = async () => {
    if (!editingResult) return;

    await updateResultMutation.mutateAsync({
      id: editingResult.id,
      ...newResult
    });
    resetForm();
    setIsEditDialogOpen(false);
    setEditingResult(null);
  };

  const handleDeleteResult = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      await deleteResultMutation.mutateAsync(id);
    }
  };

  const handleBulkUpload = () => {
    setIsBulkUploadOpen(true);
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const results = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          const result: any = {};
          
          headers.forEach((header, index) => {
            if (header === 'matric_number') {
              const student = students.find(s => s.matric_number === values[index]);
              result.student_id = student?.id;
            } else if (header === 'course_code') {
              const course = courses.find(c => c.code === values[index]);
              result.course_id = course?.id;
            } else if (header === 'semester_code') {
              const semester = semesters.find(s => s.code === values[index]);
              result.semester_id = semester?.id;
            } else if (header === 'session_name') {
              const session = sessions.find(s => s.name === values[index]);
              result.session_id = session?.id;
            } else if (header === 'score') {
              result.score = parseFloat(values[index]);
            } else if (header === 'remarks') {
              result.remarks = values[index];
            }
          });
          
          return result;
        })
        .filter(result => result.student_id && result.course_id && result.semester_id && result.session_id);

      if (results.length > 0) {
        bulkAddMutation.mutate(results);
        setIsBulkUploadOpen(false);
      } else {
        toast({
          title: "Error",
          description: "No valid results found in CSV file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const generateReport = (type: 'student' | 'session' | 'semester') => {
    const filteredResults = results.filter(result => {
      if (type === 'student' && searchTerm) {
        return result.student?.matric_number?.includes(searchTerm) || 
               `${result.student?.first_name} ${result.student?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (type === 'session' && filterSession !== 'all') {
        return result.session_id === filterSession;
      }
      if (type === 'semester' && filterSemester !== 'all') {
        return result.semester_id === filterSemester;
      }
      return true;
    });

    // Create printable report
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>Academic Results Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .grade-A, .grade-AB { color: #22c55e; font-weight: bold; }
              .grade-B, .grade-BC { color: #3b82f6; font-weight: bold; }
              .grade-C, .grade-CD { color: #eab308; font-weight: bold; }
              .grade-D, .grade-E { color: #f97316; font-weight: bold; }
              .grade-F { color: #ef4444; font-weight: bold; }
              @media print { 
                button { display: none; }
                body { margin: 10px; }
              }
            </style>
          </head>
          <body>
            <h1>Academic Results Report - ${type.charAt(0).toUpperCase() + type.slice(1)}</h1>
            <button onclick="window.print()" style="margin-bottom: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>
            <table>
              <thead>
                <tr>
                  <th>Matric Number</th>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Semester</th>
                  <th>Session</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${filteredResults.map(result => `
                  <tr>
                    <td>${result.student?.matric_number || ''}</td>
                    <td>${result.student?.first_name || ''} ${result.student?.last_name || ''}</td>
                    <td>${result.course?.code || ''} - ${result.course?.name || ''}</td>
                    <td>${result.score}</td>
                    <td class="grade-${result.grade}">${result.grade}</td>
                    <td>${result.semester?.name || ''}</td>
                    <td>${result.session?.name || ''}</td>
                    <td>${result.remarks || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p style="text-align: center; margin-top: 30px; color: #666;">
              Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
            </p>
          </body>
        </html>
      `);
      reportWindow.document.close();
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A' || grade === 'AB') return 'text-green-600 bg-green-50';
    if (grade === 'B' || grade === 'BC') return 'text-blue-600 bg-blue-50';
    if (grade === 'C' || grade === 'CD') return 'text-yellow-600 bg-yellow-50';
    if (grade === 'D' || grade === 'E') return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.student?.matric_number?.includes(searchTerm) ||
      `${result.student?.first_name} ${result.student?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterCourse === 'all' || result.course_id === filterCourse;
    const matchesSemester = filterSemester === 'all' || result.semester_id === filterSemester;
    const matchesSession = filterSession === 'all' || result.session_id === filterSession;
    
    return matchesSearch && matchesCourse && matchesSemester && matchesSession;
  });

  if (resultsLoading) {
    return <div className="flex justify-center items-center h-64">Loading results...</div>;
  }

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
              <Button onClick={() => generateReport('student')} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
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
                      <Label htmlFor="student">Student</Label>
                      <Select onValueChange={(value) => setNewResult({...newResult, student_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.matric_number} - {student.first_name} {student.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Select onValueChange={(value) => setNewResult({...newResult, course_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.code} - {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select onValueChange={(value) => setNewResult({...newResult, semester_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((semester) => (
                            <SelectItem key={semester.id} value={semester.id}>
                              {semester.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session">Session</Label>
                      <Select onValueChange={(value) => setNewResult({...newResult, session_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessions.map((session) => (
                            <SelectItem key={session.id} value={session.id}>
                              {session.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="score">Score (0-100)</Label>
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="85.5"
                        value={newResult.score || ''}
                        onChange={(e) => setNewResult({...newResult, score: parseFloat(e.target.value) || 0})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks (Optional)</Label>
                      <Input
                        id="remarks"
                        placeholder="Additional comments"
                        value={newResult.remarks}
                        onChange={(e) => setNewResult({...newResult, remarks: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddResult} disabled={addResultMutation.isPending}>
                      Add Result
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-4">
            <Input
              placeholder="Search by student name or matric number..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSemester} onValueChange={setFilterSemester}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSession} onValueChange={setFilterSession}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4 flex gap-2">
            <Button onClick={() => generateReport('student')} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Student Report
            </Button>
            <Button onClick={() => generateReport('semester')} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Semester Report
            </Button>
            <Button onClick={() => generateReport('session')} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Session Report
            </Button>
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
                <TableHead>Remarks</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.student?.matric_number}</TableCell>
                  <TableCell>{result.student?.first_name} {result.student?.last_name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.course?.code}</div>
                      <div className="text-sm text-gray-500">{result.course?.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{result.score}</TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(result.grade)}>
                      {result.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>{result.semester?.name}</TableCell>
                  <TableCell>{result.session?.name}</TableCell>
                  <TableCell>{result.remarks}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditResult(result)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteResult(result.id)}
                        disabled={deleteResultMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Result</DialogTitle>
            <DialogDescription>
              Update the result details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-score">Score (0-100)</Label>
              <Input
                id="edit-score"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={newResult.score || ''}
                onChange={(e) => setNewResult({...newResult, score: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-remarks">Remarks</Label>
              <Input
                id="edit-remarks"
                value={newResult.remarks}
                onChange={(e) => setNewResult({...newResult, remarks: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateResult} disabled={updateResultMutation.isPending}>
              Update Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Results</DialogTitle>
            <DialogDescription>
              Upload a CSV file with the following columns: matric_number, course_code, semester_code, session_name, score, remarks
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
              />
            </div>
            <div className="text-sm text-gray-600">
              <strong>CSV Format Example:</strong><br/>
              matric_number,course_code,semester_code,session_name,score,remarks<br/>
              CSC/2020/001,CSC401,1ST,2023/2024,85.5,Excellent performance
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultManagement;
