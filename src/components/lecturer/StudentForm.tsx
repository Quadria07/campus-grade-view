import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { useDepartments, useSessions, useSemesters, type Student } from '@/hooks/useStudents';

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit, onCancel, isLoading }) => {
  const { data: departments = [] } = useDepartments();
  const { data: sessions = [] } = useSessions();
  const { data: semesters = [] } = useSemesters();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      matric_number: student?.matric_number || '',
      first_name: student?.first_name || '',
      last_name: student?.last_name || '',
      email: student?.email || '',
      phone: student?.phone || '',
      level: student?.level || '',
      status: student?.status || 'active',
      department_id: student?.department_id || '',
      session_id: student?.session_id || '',
      semester_id: student?.semester_id || '',
      gender: student?.gender || '',
      date_of_birth: student?.date_of_birth || '',
      address: student?.address || '',
    }
  });

  const watchedDepartment = watch('department_id');
  const watchedSession = watch('session_id');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="matric_number">Matric Number *</Label>
          <Input
            id="matric_number"
            placeholder="CSC/2024/001"
            {...register('matric_number', { required: 'Matric number is required' })}
          />
          {errors.matric_number && (
            <p className="text-sm text-red-500">{errors.matric_number.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="level">Level *</Label>
          <Select onValueChange={(value) => setValue('level', value)} defaultValue={student?.level}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ND 1">ND 1</SelectItem>
              <SelectItem value="ND 2">ND 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            placeholder="John"
            {...register('first_name', { required: 'First name is required' })}
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            placeholder="Doe"
            {...register('last_name', { required: 'Last name is required' })}
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@student.edu"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          placeholder="+234 901 234 5678"
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select onValueChange={(value) => setValue('department_id', value)} defaultValue={student?.department_id}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="session">Session</Label>
          <Select onValueChange={(value) => setValue('session_id', value)} defaultValue={student?.session_id}>
            <SelectTrigger>
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  {session.name} {session.is_active && '(Active)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select onValueChange={(value) => setValue('semester_id', value)} defaultValue={student?.semester_id}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name} ({semester.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={(value) => setValue('gender', value)} defaultValue={student?.gender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            {...register('date_of_birth')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Student address"
          {...register('address')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={(value) => setValue('status', value)} defaultValue={student?.status || 'active'}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="graduated">Graduated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default StudentForm;
