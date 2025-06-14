
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudentResult {
  id: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  score: number;
  grade: string;
  gradePoint: number;
  semester: string;
  session: string;
  remark: string;
}

const StudentResults: React.FC = () => {
  const [results] = useState<StudentResult[]>([
    {
      id: '1',
      courseCode: 'CSC401',
      courseTitle: 'Software Engineering',
      creditUnits: 3,
      score: 78,
      grade: 'B+',
      gradePoint: 3.5,
      semester: 'First',
      session: '2023/2024',
      remark: 'Pass'
    },
    {
      id: '2',
      courseCode: 'CSC402',
      courseTitle: 'Database Systems',
      creditUnits: 3,
      score: 85,
      grade: 'A',
      gradePoint: 4.0,
      semester: 'First',
      session: '2023/2024',
      remark: 'Excellent'
    },
    {
      id: '3',
      courseCode: 'CSC403',
      courseTitle: 'Computer Networks',
      creditUnits: 2,
      score: 72,
      grade: 'B',
      gradePoint: 3.0,
      semester: 'First',
      session: '2023/2024',
      remark: 'Pass'
    },
    {
      id: '4',
      courseCode: 'CSC404',
      courseTitle: 'Web Development',
      creditUnits: 3,
      score: 88,
      grade: 'A',
      gradePoint: 4.0,
      semester: 'Second',
      session: '2022/2023',
      remark: 'Excellent'
    },
    {
      id: '5',
      courseCode: 'CSC301',
      courseTitle: 'Data Structures',
      creditUnits: 3,
      score: 68,
      grade: 'B-',
      gradePoint: 2.5,
      semester: 'First',
      session: '2022/2023',
      remark: 'Pass'
    }
  ]);

  const [selectedSession, setSelectedSession] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');

  const filteredResults = results.filter(result => {
    return (selectedSession === 'all' || result.session === selectedSession) &&
           (selectedSemester === 'all' || result.semester === selectedSemester);
  });

  const calculateSemesterGPA = (semesterResults: StudentResult[]) => {
    if (semesterResults.length === 0) return 0;
    const totalPoints = semesterResults.reduce((sum, result) => sum + (result.gradePoint * result.creditUnits), 0);
    const totalCredits = semesterResults.reduce((sum, result) => sum + result.creditUnits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const calculateCGPA = () => {
    if (results.length === 0) return '0.00';
    const totalPoints = results.reduce((sum, result) => sum + (result.gradePoint * result.creditUnits), 0);
    const totalCredits = results.reduce((sum, result) => sum + result.creditUnits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const handleDownloadTranscript = () => {
    toast({
      title: "Transcript Download",
      description: "Your transcript is being prepared for download.",
    });
  };

  const handlePrintResults = () => {
    window.print();
  };

  const sessions = [...new Set(results.map(result => result.session))];
  const semesters = [...new Set(results.map(result => result.semester))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Academic Results
              </CardTitle>
              <CardDescription>
                View your academic performance and download transcripts
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePrintResults} variant="outline">
                Print Results
              </Button>
              <Button onClick={handleDownloadTranscript}>
                <Download className="w-4 h-4 mr-2" />
                Download Transcript
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{calculateCGPA()}</div>
                <div className="text-sm text-gray-600">Cumulative GPA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {filteredResults.reduce((sum, result) => sum + result.creditUnits, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Credits</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{filteredResults.length}</div>
                <div className="text-sm text-gray-600">Courses</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {calculateSemesterGPA(filteredResults)}
                </div>
                <div className="text-sm text-gray-600">Semester GPA</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter by:</span>
            </div>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {sessions.map(session => (
                  <SelectItem key={session} value={session}>{session}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map(semester => (
                  <SelectItem key={semester} value={semester}>{semester} Semester</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Credit Units</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Grade Point</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.courseCode}</TableCell>
                  <TableCell>{result.courseTitle}</TableCell>
                  <TableCell>{result.creditUnits}</TableCell>
                  <TableCell className="font-bold">{result.score}</TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(result.grade)}>
                      {result.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>{result.gradePoint}</TableCell>
                  <TableCell>{result.semester}</TableCell>
                  <TableCell>{result.session}</TableCell>
                  <TableCell>
                    <Badge variant={result.remark === 'Excellent' ? 'default' : 'secondary'}>
                      {result.remark}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No results found for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResults;
