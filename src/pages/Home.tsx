import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Mail, GraduationCap, Shield, FileText, TrendingUp, ArrowRight, HeadphonesIcon } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="https://gma.edu.ng/wp-content/uploads/2019/10/logo-use3.jpg?ed8dcc&ed8dcc" 
                  alt="Global Maritime Academy Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Check My Grade
                </h1>
                <p className="text-xs text-gray-600">Academic Excellence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/contact">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </Link>
              <Link to="/super-admin-login">
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-blue-50/50"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Academic
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                Grade Management
              </span>
              Platform
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Streamline your educational workflow with our intelligent platform. Manage grades, 
              track student progress, and enhance academic performance with modern, secure tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/lecturer-login">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <Users className="w-5 h-5 mr-2" />
                  Lecturer Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/student-login">
                <Button size="lg" variant="outline" className="border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Student Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Academic Management Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage grades, track progress, and enhance educational outcomes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Intelligent Grade Processing",
                description: "Advanced grade calculations with bulk upload, real-time validation, and automated transcript generation",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Users,
                title: "Student Management Hub",
                description: "Comprehensive student profiles, progress tracking, and instant access to academic records",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                icon: Shield,
                title: "Advanced Security",
                description: "Enterprise-grade encryption with role-based access control and comprehensive audit logging",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: FileText,
                title: "Professional Reporting",
                description: "Automated PDF generation with customizable templates and official transcript creation",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                icon: TrendingUp,
                title: "Analytics & Insights",
                description: "Performance analytics with trend analysis and data-driven recommendations for improvement",
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: Mail,
                title: "Communication Tools",
                description: "Real-time notifications, messaging system, and automated alerts for seamless collaboration",
                color: "from-pink-500 to-pink-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/90 backdrop-blur-sm hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-800 mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeadphonesIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-lg text-gray-600 mb-8">
              Our support team is here to assist you with any questions or technical issues
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all">
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://gma.edu.ng/wp-content/uploads/2019/10/logo-use3.jpg?ed8dcc&ed8dcc" 
                    alt="Global Maritime Academy Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-white">Check My Grade</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Empowering Global Maritime Academy with modern grade management solutions 
                that enhance academic excellence and student success.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/lecturer-login" className="hover:text-white transition-colors">Lecturer Portal</Link></li>
                <li><Link to="/student-login" className="hover:text-white transition-colors">Student Portal</Link></li>
                <li><Link to="/super-admin-login" className="hover:text-white transition-colors">Admin Access</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="mailto:support@checkmygrade.com" className="hover:text-white transition-colors">support@checkmygrade.com</a></li>
                <li><span className="text-gray-400">+1 (555) 123-4567</span></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-400">
              © 2024 Global Maritime Academy. Enhancing education through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
