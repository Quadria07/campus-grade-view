
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAddStudent, useDepartments, useSessions } from '@/hooks/useStudents';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedStudent {
  matric_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  level: string;
  status: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  department_code?: string;
  session_name?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ open, onOpenChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: departments = [] } = useDepartments();
  const { data: sessions = [] } = useSessions();
  const addStudentMutation = useAddStudent();

  const downloadTemplate = () => {
    const headers = [
      'matric_number',
      'first_name',
      'last_name',
      'email',
      'phone',
      'level',
      'status',
      'date_of_birth',
      'gender',
      'address',
      'department_code',
      'session_name'
    ];

    const sampleData = [
      [
        'CSC/2024/001',
        'John',
        'Doe',
        'john.doe@university.edu',
        '+234-123-456-7890',
        '100L',
        'active',
        '2000-05-15',
        'male',
        '123 University Street',
        'CSC',
        '2024/2025'
      ]
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (content: string): ParsedStudent[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const students: ParsedStudent[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
      const student: any = {};

      headers.forEach((header, index) => {
        if (values[index]) {
          student[header] = values[index];
        }
      });

      if (student.matric_number && student.first_name && student.last_name && student.email) {
        students.push(student as ParsedStudent);
      }
    }

    return students;
  };

  const validateStudent = (student: ParsedStudent, index: number): ValidationError[] => {
    const errors: ValidationError[] = [];
    const row = index + 2; // +2 because index starts at 0 and we skip header row

    if (!student.matric_number) {
      errors.push({ row, field: 'matric_number', message: 'Matric number is required' });
    }

    if (!student.first_name) {
      errors.push({ row, field: 'first_name', message: 'First name is required' });
    }

    if (!student.last_name) {
      errors.push({ row, field: 'last_name', message: 'Last name is required' });
    }

    if (!student.email) {
      errors.push({ row, field: 'email', message: 'Email is required' });
    } else if (!/\S+@\S+\.\S+/.test(student.email)) {
      errors.push({ row, field: 'email', message: 'Invalid email format' });
    }

    if (!student.level) {
      errors.push({ row, field: 'level', message: 'Level is required' });
    } else if (!['100L', '200L', '300L', '400L', '500L'].includes(student.level)) {
      errors.push({ row, field: 'level', message: 'Level must be 100L, 200L, 300L, 400L, or 500L' });
    }

    if (student.status && !['active', 'inactive', 'graduated'].includes(student.status)) {
      errors.push({ row, field: 'status', message: 'Status must be active, inactive, or graduated' });
    }

    if (student.gender && !['male', 'female'].includes(student.gender.toLowerCase())) {
      errors.push({ row, field: 'gender', message: 'Gender must be male or female' });
    }

    if (student.department_code && !departments.find(d => d.code === student.department_code)) {
      errors.push({ row, field: 'department_code', message: `Department code '${student.department_code}' not found` });
    }

    if (student.session_name && !sessions.find(s => s.name === student.session_name)) {
      errors.push({ row, field: 'session_name', message: `Session '${student.session_name}' not found` });
    }

    return errors;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === 'text/csv' || fileType === 'application/vnd.ms-excel' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setValidationErrors([]);
        setSuccessCount(0);
        setErrorCount(0);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const processUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setValidationErrors([]);
    setSuccessCount(0);
    setErrorCount(0);

    try {
      const content = await file.text();
      const students = parseCSV(content);

      if (students.length === 0) {
        toast({
          title: "No Data Found",
          description: "The CSV file doesn't contain any valid student data.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Validate all students first
      const allErrors: ValidationError[] = [];
      students.forEach((student, index) => {
        const errors = validateStudent(student, index);
        allErrors.push(...errors);
      });

      if (allErrors.length > 0) {
        setValidationErrors(allErrors);
        setIsProcessing(false);
        return;
      }

      // Process uploads
      let successCount = 0;
      let errorCount = 0;

      for (const student of students) {
        try {
          const department = departments.find(d => d.code === student.department_code);
          const session = sessions.find(s => s.name === student.session_name);

          const studentData = {
            matric_number: student.matric_number,
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            phone: student.phone || null,
            level: student.level,
            status: student.status || 'active',
            date_of_birth: student.date_of_birth || null,
            gender: student.gender || null,
            address: student.address || null,
            department_id: department?.id || null,
            session_id: session?.id || null,
          };

          await addStudentMutation.mutateAsync(studentData);
          successCount++;
        } catch (error) {
          console.error('Error adding student:', error);
          errorCount++;
        }
      }

      setSuccessCount(successCount);
      setErrorCount(errorCount);

      if (successCount > 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${successCount} students${errorCount > 0 ? ` (${errorCount} failed)` : ''}.`,
        });
      }

      if (successCount === students.length) {
        setTimeout(() => {
          onOpenChange(false);
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);
      }

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while processing the file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setValidationErrors([]);
    setSuccessCount(0);
    setErrorCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Students</DialogTitle>
          <DialogDescription>
            Upload multiple students at once using a CSV file. Download the template to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Step 1: Download Template</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download the CSV template with the correct format and sample data.
            </p>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Step 2: Upload Your File</h3>
            <div className="space-y-3">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {file && (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <span className="text-sm">Selected: {file.name}</span>
                  <Button size="sm" variant="ghost" onClick={clearFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Validation Errors Found:</div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {validationErrors.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-sm">
                      Row {error.row}, {error.field}: {error.message}
                    </div>
                  ))}
                  {validationErrors.length > 10 && (
                    <div className="text-sm font-medium">
                      ... and {validationErrors.length - 10} more errors
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Success/Error Summary */}
          {(successCount > 0 || errorCount > 0) && (
            <div className="space-y-2">
              {successCount > 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully uploaded {successCount} students.
                  </AlertDescription>
                </Alert>
              )}
              {errorCount > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to upload {errorCount} students. Check the console for details.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={processUpload} 
              disabled={!file || isProcessing || validationErrors.length > 0}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Students
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
