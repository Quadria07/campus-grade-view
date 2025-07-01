
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    
    if (user.profile?.name) {
      return user.profile.name;
    }
    
    return user.email.split('@')[0];
  };

  const getUserRole = () => {
    if (!user) return '';
    switch (user.role) {
      case 'lecturer': return 'Lecturer';
      case 'user': return 'Student';
      case 'super_admin': return 'Super Admin';
      default: return '';
    }
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'lecturer': return '/lecturer-dashboard';
      case 'user': return '/student-dashboard';
      case 'super_admin': return '/super-admin-dashboard';
      default: return '/';
    }
  };

  const handleSettingsClick = () => {
    const dashboardRoute = getDashboardRoute();
    navigate(dashboardRoute);
    // Use a small delay to ensure navigation completes, then trigger tab change
    setTimeout(() => {
      const event = new CustomEvent('change-dashboard-tab', { 
        detail: user?.role === 'lecturer' ? 'profile' : 'settings' 
      });
      window.dispatchEvent(event);
    }, 100);
  };

  const isOnDashboard = location.pathname.includes('dashboard');

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="https://gma.edu.ng/wp-content/uploads/2019/10/logo-use3.jpg?ed8dcc&ed8dcc" 
                  alt="Global Maritime Academy Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-primary">Global Maritime Academy</span>
            </Link>
            
            {isOnDashboard && user && (
              <nav className="hidden md:flex space-x-6">
                <span className="text-sm text-gray-600">
                  Welcome back, <span className="font-medium">{getUserDisplayName()}</span>
                  {user.role === 'super_admin' && (
                    <Shield className="inline w-4 h-4 ml-1 text-red-600" />
                  )}
                </span>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{getUserDisplayName()}</span>
                    <span className={`text-xs hidden md:inline ${
                      user.role === 'super_admin' ? 'text-red-600 font-semibold' : 'text-gray-500'
                    }`}>
                      ({getUserRole()})
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-gray-500">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(getDashboardRoute())}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettingsClick}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/student-login">Student Login</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/lecturer-login">Lecturer Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
