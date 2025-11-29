import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { WorkflowProvider } from './context/WorkflowContext';
import WorkflowList from './components/WorkflowList';
import BlockTemplatesSidebar from './components/BlockTemplatesSidebar';
import WorkflowBuilder from './components/WorkflowBuilder';
import ExecutionMonitor from './components/ExecutionMonitor';
import AISuggestions from './components/AISuggestions';
import UserActivityLog from './components/UserActivityLog';
import ScheduledEmails from './components/ScheduledEmails';
import LoginPage, { UserRole } from './components/LoginPage';
import { Workflow, Activity, Sparkles, LogOut, Shield, UserCog, User, Users, Calendar } from 'lucide-react';

type Tab = 'builder' | 'executions' | 'suggestions' | 'activity' | 'scheduled';

// TODO: Replace with your actual Google Client ID from Google Cloud Console
// Get it from: https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = '460454436602-4cos0ped4vgalbss8bmjkmsl9loccadf.apps.googleusercontent.com';

// Authorized emails for specific roles
const AUTHORIZED_EMAILS = {
  admin: ['yadavanushka759@gmail.com'], // Only your email can be admin
  manager: ['yadavanushka759@gmail.com', 'saurabh14827672@gmail.com'], // You and Saurabh
  employee: [] // Any email can be employee
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('builder');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('employee');

  const validateRoleAccess = (email: string, role: UserRole): boolean => {
    // Employee role is open to everyone
    if (role === 'employee') {
      return true;
    }
    
    // Check if email is authorized for the selected role
    const authorizedEmails = AUTHORIZED_EMAILS[role];
    return authorizedEmails.includes(email.toLowerCase());
  };

  const logLoginActivity = (email: string, name: string, role: UserRole, method: 'email' | 'google') => {
    const activity = {
      id: Date.now().toString(),
      email,
      name,
      role,
      timestamp: new Date().toISOString(),
      loginMethod: method,
    };

    // Get existing activities
    const existingActivities = localStorage.getItem('loginActivities');
    const activities = existingActivities ? JSON.parse(existingActivities) : [];
    
    // Add new activity at the beginning
    activities.unshift(activity);
    
    // Keep only last 100 activities
    const limitedActivities = activities.slice(0, 100);
    
    // Save to localStorage
    localStorage.setItem('loginActivities', JSON.stringify(limitedActivities));
  };

  const handleLogin = (
    email: string, 
    password: string, 
    role: UserRole, 
    firstName?: string, 
    lastName?: string
  ) => {
    // Validate email and password
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    // Check role-based access
    if (!validateRoleAccess(email, role)) {
      if (role === 'admin') {
        alert('⚠️ Access Denied: Only authorized administrators can login as Admin.');
      } else if (role === 'manager') {
        alert('⚠️ Access Denied: This email is not authorized for Manager access. Please contact the administrator.');
      }
      return;
    }

    // Authentication successful
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : '';
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserRole(role);
    setUserName(fullName);
    
    // Log the login activity
    logLoginActivity(email, fullName, role, 'email');
  };

  const handleGoogleLogin = (credential: string, role: UserRole) => {
    // Decode JWT token to get user info
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const email = payload.email;

      // Check role-based access for Google login
      if (!validateRoleAccess(email, role)) {
        if (role === 'admin') {
          alert('⚠️ Access Denied: Only authorized administrators can login as Admin.');
        } else if (role === 'manager') {
          alert('⚠️ Access Denied: This email is not authorized for Manager access. Please contact the administrator.');
        }
        return;
      }
      
      setIsAuthenticated(true);
      setUserEmail(email);
      setUserName(payload.name || '');
      setUserRole(role);
      
      // Log the login activity
      logLoginActivity(email, payload.name || '', role, 'google');
    } catch (error) {
      console.error('Failed to decode Google credential:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setUserRole('employee');
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin':
        return <Shield size={16} className="text-red-600" />;
      case 'manager':
        return <UserCog size={16} className="text-purple-600" />;
      case 'employee':
        return <User size={16} className="text-blue-600" />;
    }
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'manager':
        return 'bg-purple-100 text-purple-700';
      case 'employee':
        return 'bg-blue-100 text-blue-700';
    }
  };

  if (!isAuthenticated) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />
      </GoogleOAuthProvider>
    );
  }

  return (
    <WorkflowProvider>
      <div className="h-screen flex flex-col bg-slate-50">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Workflow size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">FlowForge</h1>
                  <p className="text-sm text-slate-500">AI-Powered Workflow Automation</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <nav className="flex gap-2">
                {/* Builder - Available to all roles */}
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === 'builder'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Workflow size={16} />
                  Builder
                </button>
                
                {/* Executions - Available to all roles */}
                <button
                  onClick={() => setActiveTab('executions')}
                  className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === 'executions'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Activity size={16} />
                  Executions
                </button>
                
                {/* AI Suggestions - Available to all roles */}
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === 'suggestions'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles size={16} />
                  AI Suggestions
                </button>
                
                {/* Scheduled Emails - Available to all roles */}
                <button
                  onClick={() => setActiveTab('scheduled')}
                  className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === 'scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar size={16} />
                  Scheduled
                </button>
                
                {/* User Activity - Available to Admin only */}
                {userRole === 'admin' && (
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
                      activeTab === 'activity'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Users size={16} />
                    Activity Log
                  </button>
                )}
              </nav>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    {userName && <div className="text-sm font-medium text-slate-700">{userName}</div>}
                    <div className="text-xs text-slate-500">{userEmail}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${getRoleBadgeColor()}`}>
                    {getRoleIcon()}
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          {/* Workflow List - Available to all roles */}
          <WorkflowList />

          {activeTab === 'builder' && (
            <>
              <BlockTemplatesSidebar />
              <div className="flex-1 overflow-hidden">
                <WorkflowBuilder />
              </div>
            </>
          )}

          {activeTab === 'executions' && (
            <div className="flex-1 overflow-hidden">
              <ExecutionMonitor />
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="flex-1 overflow-hidden">
              <AISuggestions />
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="flex-1 overflow-hidden">
              <ScheduledEmails />
            </div>
          )}

          {activeTab === 'activity' && userRole === 'admin' && (
            <div className="flex-1 overflow-hidden">
              <UserActivityLog />
            </div>
          )}
        </main>
      </div>
    </WorkflowProvider>
  );
}

export default App;
