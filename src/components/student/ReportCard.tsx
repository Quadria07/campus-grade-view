import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateResultPDF, downloadResultAsPDF } from '../../utils/pdfGenerator';

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

const ReportCard: React.FC = () => {
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
      courseCode: 'MTH201',
      courseTitle: 'Linear Algebra',
      creditUnits: 3,
      score: 92,
      grade: 'A',
      gradePoint: 4.0,
      semester: 'Second',
      session: '2023/2024',
      remark: 'Excellent'
    }
  ]);

  const [selectedSession, setSelectedSession] = useState('2023/2024');
  const [selectedSemester, setSelectedSemester] = useState('First');

  const filteredResults = results.filter(result => 
    result.session === selectedSession && result.semester === selectedSemester
  );

  const calculateGPA = () => {
    if (filteredResults.length === 0) return '0.00';
    const totalPoints = filteredResults.reduce((sum, result) => sum + (result.gradePoint * result.creditUnits), 0);
    const totalCredits = filteredResults.reduce((sum, result) => sum + result.creditUnits, 0);
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

  const handleDownloadReportCard = () => {
    const studentInfo = {
      name: 'Demo Student',
      matricNumber: 'STU001',
      department: 'Computer Science',
      level: '200',
      session: selectedSession,
      semester: selectedSemester
    };

    downloadResultAsPDF(
      studentInfo,
      filteredResults,
      calculateCGPA(),
      calculateGPA()
    );
  };

  const handlePrintReportCard = () => {
    const studentInfo = {
      name: 'Demo Student',
      matricNumber: 'STU001',
      department: 'Computer Science',
      level: '200',
      session: selectedSession,
      semester: selectedSemester
    };

    generateResultPDF(
      studentInfo,
      filteredResults,
      calculateCGPA(),
      calculateGPA()
    );
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
                Report Card
              </CardTitle>
              <CardDescription>
                View consolidated report card by semester and session
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePrintReportCard} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownloadReportCard}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Period Selection */}
          <div className="flex space-x-4 mb-6">
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
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
                {semesters.map(semester => (
                  <SelectItem key={semester} value={semester}>{semester} Semester</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Info Header */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">Demo Student</h3>
                <p className="text-gray-600">Matric No: STU001</p>
                <p className="text-gray-600">Department: Computer Science</p>
              </div>
              <div>
                <p className="text-gray-600">Session: {selectedSession}</p>
                <p className="text-gray-600">Semester: {selectedSemester}</p>
                <p className="text-gray-600">Level: 200</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{calculateGPA()}</div>
                <div className="text-sm text-gray-600">Semester GPA</div>
              </CardContent>
            </Card>
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
                <div className="text-sm text-gray-600">Credits Earned</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{filteredResults.length}</div>
                <div className="text-sm text-gray-600">Courses</div>
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead className="text-center">Credit Units</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead className="text-center">Grade Point</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.courseCode}</TableCell>
                  <TableCell>{result.courseTitle}</TableCell>
                  <TableCell className="text-center">{result.creditUnits}</TableCell>
                  <TableCell className="text-center font-bold">{result.score}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getGradeColor(result.grade)}>
                      {result.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{result.gradePoint}</TableCell>
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
              No results found for {selectedSemester} Semester, {selectedSession} session.
            </div>
          )}

          {/* Grade Scale */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Grade Scale</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>A (90-100): 4.0</div>
              <div>B+ (80-89): 3.5</div>
              <div>B (70-79): 3.0</div>
              <div>C+ (60-69): 2.5</div>
              <div>C (50-59): 2.0</div>
              <div>D (45-49): 1.0</div>
              <div>E (40-44): 0.5</div>
              <div>F (0-39): 0.0</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCard;
