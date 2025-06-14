
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Download, Printer, Search, Filter } from 'lucide-react';
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
    },
    {
      id: '6',
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

  const [selectedSession, setSelectedSession] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = results.filter(result => {
    const matchesSession = selectedSession === 'all' || result.session === selectedSession;
    const matchesSemester = selectedSemester === 'all' || result.semester === selectedSemester;
    const matchesSearch = searchTerm === '' || 
      result.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSession && matchesSemester && matchesSearch;
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

  const handleDownloadPDF = () => {
    toast({
      title: "Download Started",
      description: "Your result slip PDF is being prepared for download.",
    });
  };

  const handlePrintResults = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Student Results - ${selectedSession || 'All Sessions'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 20px; }
              .summary { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Student Academic Results</h1>
              <p>Session: ${selectedSession === 'all' ? 'All Sessions' : selectedSession}</p>
              <p>Semester: ${selectedSemester === 'all' ? 'All Semesters' : selectedSemester}</p>
            </div>
            <div class="summary">
              <p><strong>CGPA:</strong> ${calculateCGPA()}</p>
              <p><strong>Total Credits:</strong> ${filteredResults.reduce((sum, result) => sum + result.creditUnits, 0)}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Credit Units</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Grade Point</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                ${filteredResults.map(result => `
                  <tr>
                    <td>${result.courseCode}</td>
                    <td>${result.courseTitle}</td>
                    <td>${result.creditUnits}</td>
                    <td>${result.score}</td>
                    <td>${result.grade}</td>
                    <td>${result.gradePoint}</td>
                    <td>${result.remark}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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
                View your academic performance and download/print transcripts
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePrintResults} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print Results
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
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
                <div className="text-sm text-gray-600">Period GPA</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by course code or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter:</span>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead className="text-center">Credit Units</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Grade Point</TableHead>
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
                    <TableCell className="text-center">{result.creditUnits}</TableCell>
                    <TableCell className="text-center font-bold">{result.score}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getGradeColor(result.grade)}>
                        {result.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{result.gradePoint}</TableCell>
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
          </div>

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
