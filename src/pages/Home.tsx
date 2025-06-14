
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Mail } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">CMG</span>
              </div>
              <h1 className="text-2xl font-bold">Check My Grade</h1>
            </div>
            <Link to="/contact">
              <Button variant="ghost" className="text-primary-foreground hover:text-primary hover:bg-primary-foreground">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Check My Grade
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A comprehensive grade management system for educational institutions. 
            Lecturers can manage students and results, while students can easily 
            check their academic performance.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow animate-slide-in">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Grade Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Efficiently manage and track student grades with our intuitive system
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow animate-slide-in">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Student Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Students can easily access their results and download transcripts
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow animate-slide-in">
            <CardHeader>
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Easy Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Streamlined communication between lecturers and students
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Login Options */}
        <div className="max-w-md mx-auto">
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Choose Your Login</CardTitle>
              <CardDescription>
                Select your role to access the appropriate dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/lecturer-login" className="w-full">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                  size="lg"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Lecturer Login
                </Button>
              </Link>
              <Link to="/student-login" className="w-full">
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-6 text-lg"
                  size="lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Student Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t">
          <p className="text-gray-600">
            © 2024 Check My Grade. Built for educational excellence.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
