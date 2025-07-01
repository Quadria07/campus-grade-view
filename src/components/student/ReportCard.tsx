
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Printer, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Get current student data with better error handling
  const { data: currentStudent, isLoading: studentLoading, error: studentError } = useQuery({
    queryKey: ['current_student', user?.id],
    queryFn: async () => {
      console.log('Fetching student data for user:', user?.id);
      if (!user?.id) {
        console.log('No user ID available');
        return null;
      }
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          department:departments!students_department_id_fkey(name)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching student:', error);
        throw error;
      }
      
      console.log('Student data fetched:', data);
      return data;
    },
    enabled: !!user?.id,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get student results with better error handling
  const { data: allResults = [], isLoading: resultsLoading, error: resultsError } = useQuery({
    queryKey: ['student_results', currentStudent?.id],
    queryFn: async () => {
      console.log('Fetching results for student:', currentStudent?.id);
      if (!currentStudent?.id) {
        console.log('No student ID available');
        return [];
      }
      
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          course:courses(code, name, units, level),
          semester:semesters(name, code),
          session:sessions(name)
        `)
        .eq('student_id', currentStudent.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching results:', error);
        throw error;
      }

      console.log('Results fetched:', data);
      
      // Transform the data to match the component interface
      return data.map((result: any) => ({
        id: result.id,
        courseCode: result.course?.code || '',
        courseTitle: result.course?.name || '',
        creditUnits: result.course?.units || 0,
        score: result.score,
        grade: result.grade,
        gradePoint: getGradePoint(result.grade),
        semester: result.semester?.name || '',
        session: result.session?.name || '',
        remark: result.remarks || 'Pass'
      }));
    },
    enabled: !!currentStudent?.id,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get unique sessions and semesters from results
  const sessions = [...new Set(allResults.map(result => result.session))].filter(Boolean);
  const semesters = [...new Set(allResults.map(result => result.semester))].filter(Boolean);

  // Set default values when data loads
  React.useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0]);
    }
    if (semesters.length > 0 && !selectedSemester) {
      setSelectedSemester(semesters[0]);
    }
  }, [sessions, semesters, selectedSession, selectedSemester]);

  const filteredResults = allResults.filter(result => 
    (!selectedSession || result.session === selectedSession) && 
    (!selectedSemester || result.semester === selectedSemester)
  );

  const getGradePoint = (grade: string): number => {
    switch (grade) {
      case 'A': return 4.0;
      case 'AB': return 3.5;
      case 'B': return 3.0;
      case 'BC': return 2.5;
      case 'C': return 2.0;
      case 'CD': return 1.5;
      case 'D': return 1.0;
      case 'E': return 0.5;
      case 'F': return 0.0;
      default: return 0.0;
    }
  };

  const calculateGPA = () => {
    if (filteredResults.length === 0) return '0.00';
    const totalPoints = filteredResults.reduce((sum, result) => sum + (result.gradePoint * result.creditUnits), 0);
    const totalCredits = filteredResults.reduce((sum, result) => sum + result.creditUnits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const calculateCGPA = () => {
    if (allResults.length === 0) return '0.00';
    const totalPoints = allResults.reduce((sum, result) => sum + (result.gradePoint * result.creditUnits), 0);
    const totalCredits = allResults.reduce((sum, result) => sum + result.creditUnits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  // Helper function to get department name as string
  const getDepartmentName = () => {
    if (!currentStudent?.department) return 'N/A';
    return typeof currentStudent.department === 'string' 
      ? currentStudent.department 
      : currentStudent.department.name || 'N/A';
  };

  const handleDownloadReportCard = () => {
    if (!currentStudent) return;
    
    const studentInfo = {
      name: `${currentStudent.first_name} ${currentStudent.last_name}`,
      matricNumber: currentStudent.matric_number,
      department: getDepartmentName(),
      level: currentStudent.level,
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
    if (!currentStudent) return;
    
    const studentInfo = {
      name: `${currentStudent.first_name} ${currentStudent.last_name}`,
      matricNumber: currentStudent.matric_number,
      department: getDepartmentName(),
      level: currentStudent.level,
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

  // Show loading state
  if (studentLoading || resultsLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Report Card</h3>
            <p className="text-gray-500">Please wait while we fetch your academic records...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (studentError || resultsError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-red-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Report Card</h3>
            <p className="text-gray-500 mb-4">
              There was an error loading your academic records. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentStudent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Profile Found</h3>
            <p className="text-gray-500">
              Please contact the administrator to set up your student profile.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Report Card
              </CardTitle>
              <CardDescription className="text-sm">
                View consolidated report card by semester and session
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={handlePrintReportCard} variant="outline" disabled={!currentStudent || filteredResults.length === 0} className="text-sm">
                <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownloadReportCard} disabled={!currentStudent || filteredResults.length === 0} className="text-sm">
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Period Selection */}
          {(sessions.length > 0 || semesters.length > 0) && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map(session => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>{semester} Semester</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Student Info Header */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">
                  {currentStudent?.first_name} {currentStudent?.last_name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Matric No: {currentStudent?.matric_number}</p>
                <p className="text-sm sm:text-base text-gray-600">Department: {getDepartmentName()}</p>
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-600">Session: {selectedSession || 'N/A'}</p>
                <p className="text-sm sm:text-base text-gray-600">Semester: {selectedSemester || 'N/A'}</p>
                <p className="text-sm sm:text-base text-gray-600">Level: {currentStudent?.level}</p>
              </div>
            </div>
          </div>

          {/* Summary Cards - Removed Average Score */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">{calculateGPA()}</div>
                <div className="text-xs sm:text-sm text-gray-600">Semester GPA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">{calculateCGPA()}</div>
                <div className="text-xs sm:text-sm text-gray-600">Cumulative GPA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">{filteredResults.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Courses</div>
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          {filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Course Code</TableHead>
                    <TableHead className="text-xs sm:text-sm">Course Title</TableHead>
                    <TableHead className="text-center text-xs sm:text-sm">Credit Units</TableHead>
                    <TableHead className="text-center text-xs sm:text-sm">Score</TableHead>
                    <TableHead className="text-center text-xs sm:text-sm">Grade</TableHead>
                    <TableHead className="text-center text-xs sm:text-sm">Grade Point</TableHead>
                    <TableHead className="text-xs sm:text-sm">Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{result.courseCode}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{result.courseTitle}</TableCell>
                      <TableCell className="text-center text-xs sm:text-sm">{result.creditUnits}</TableCell>
                      <TableCell className="text-center font-bold text-xs sm:text-sm">{result.score}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getGradeColor(result.grade)} text-xs`}>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs sm:text-sm">{result.gradePoint}</TableCell>
                      <TableCell>
                        <Badge variant={result.remark === 'Excellent' ? 'default' : 'secondary'} className="text-xs">
                          {result.remark}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              {allResults.length === 0 
                ? "No results available for your matric number."
                : `No results found for ${selectedSemester} Semester, ${selectedSession} session.`
              }
            </div>
          )}

          {/* Grade Scale */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2 text-sm sm:text-base">Grade Scale</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs sm:text-sm">
              <div>A (90-100): 4.0</div>
              <div>AB (80-89): 3.5</div>
              <div>B (70-79): 3.0</div>
              <div>BC (65-69): 2.5</div>
              <div>C (60-64): 2.0</div>
              <div>CD (55-59): 1.5</div>
              <div>D (50-54): 1.0</div>
              <div>E (45-49): 0.5</div>
              <div>F (0-44): 0.0</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCard;
