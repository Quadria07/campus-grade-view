
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Mail, GraduationCap, Shield, FileText, TrendingUp, CheckCircle, Star, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Check My Grade
                </h1>
                <p className="text-sm text-gray-600">Smart Academic Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/contact">
                <Button variant="ghost" className="text-primary hover:bg-primary/10">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </Link>
              <Link to="/super-admin-login">
                <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary hover:text-white">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200 mb-8 shadow-lg">
              <Shield className="w-5 h-5 text-primary mr-3" />
              <span className="text-sm font-semibold text-gray-700">Enterprise-Grade Security</span>
              <div className="w-2 h-2 bg-green-500 rounded-full ml-3 animate-pulse"></div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Modern
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent block">
                Grade Management
              </span>
              Made Simple
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionize your academic workflow with our intelligent platform. Seamlessly manage grades, 
              track performance, and enhance student engagement with cutting-edge tools designed for modern education.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/lecturer-login">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 rounded-xl">
                  <Users className="w-6 h-6 mr-3" />
                  Lecturer Dashboard
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
              <Link to="/student-login">
                <Button size="lg" variant="outline" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 rounded-xl">
                  <BookOpen className="w-6 h-6 mr-3" />
                  Student Portal
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-gray-600">Uptime Reliability</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">10K+</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600">Educational Institutions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From grade management to analytics, our comprehensive suite of tools empowers educators and students alike
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Smart Grade Processing",
                description: "AI-powered grade calculations with bulk upload capabilities and real-time validation systems",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Users,
                title: "Student Experience Hub",
                description: "Instant result access, downloadable transcripts, and comprehensive academic progress tracking",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level encryption with role-based access control and comprehensive audit trails",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: FileText,
                title: "Advanced Reporting",
                description: "Professional PDF generation with customizable templates and automated transcript creation",
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: TrendingUp,
                title: "Performance Analytics",
                description: "Deep insights with trend analysis, predictive modeling, and performance optimization recommendations",
                color: "from-pink-500 to-pink-600"
              },
              {
                icon: Mail,
                title: "Integrated Communication",
                description: "Real-time notifications, direct messaging, and automated alert systems for seamless interaction",
                color: "from-teal-500 to-teal-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:scale-105">
                <CardHeader className="text-center pb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800 mb-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials/Benefits Section */}
      <section className="py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Trusted by Educational Leaders</h3>
            <p className="text-xl text-gray-600">Join thousands who have transformed their academic management</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                benefit: "Reduce administrative workload by 70%",
                icon: CheckCircle
              },
              {
                benefit: "Improve student satisfaction by 85%",
                icon: Star
              },
              {
                benefit: "Streamline grading processes in minutes",
                icon: TrendingUp
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <item.icon className="w-8 h-8 text-green-500 flex-shrink-0" />
                <span className="text-lg font-semibold text-gray-800">{item.benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-5xl font-bold text-white mb-8">Ready to Transform Education?</h3>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Join the revolution in academic management. Experience the future of education technology today.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link to="/lecturer-login">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 px-10 py-6 text-lg shadow-xl rounded-xl transform hover:scale-105 transition-all">
                  Start as Lecturer
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
              <Link to="/student-login">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-6 text-lg rounded-xl transform hover:scale-105 transition-all">
                  Student Access
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Check My Grade</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Empowering educational institutions worldwide with cutting-edge grade management solutions 
                that enhance academic excellence and student success.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Quick Access</h4>
              <ul className="space-y-3">
                <li><Link to="/lecturer-login" className="hover:text-white transition-colors">Lecturer Portal</Link></li>
                <li><Link to="/student-login" className="hover:text-white transition-colors">Student Portal</Link></li>
                <li><Link to="/super-admin-login" className="hover:text-white transition-colors">Admin Access</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Support Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Get Help</h4>
              <ul className="space-y-3">
                <li><a href="mailto:support@checkmygrade.com" className="hover:text-white transition-colors">support@checkmygrade.com</a></li>
                <li><span className="text-gray-400">+1 (555) 123-4567</span></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Form</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Check My Grade. Revolutionizing education through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
