import { useState, useEffect } from 'react';
import { Users, Clock, Mail, Shield, UserCog, User as UserIcon } from 'lucide-react';

interface LoginActivity {
  id: string;
  email: string;
  name: string;
  role: string;
  timestamp: string;
  loginMethod: 'email' | 'google';
}

function UserActivityLog() {
  const [activities, setActivities] = useState<LoginActivity[]>([]);

  useEffect(() => {
    // Load login activities from localStorage
    const savedActivities = localStorage.getItem('loginActivities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield size={16} className="text-red-600" />;
      case 'manager':
        return <UserCog size={16} className="text-purple-600" />;
      case 'employee':
        return <UserIcon size={16} className="text-blue-600" />;
      default:
        return <UserIcon size={16} className="text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'manager':
        return 'bg-purple-100 text-purple-700';
      case 'employee':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const clearActivities = () => {
    if (confirm('Are you sure you want to clear all login activities?')) {
      localStorage.removeItem('loginActivities');
      setActivities([]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">User Activity Log</h2>
              <p className="text-sm text-slate-500">Track all user login activities</p>
            </div>
          </div>
          <button
            onClick={clearActivities}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Users size={64} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Login Activities Yet</h3>
            <p className="text-slate-500">Login activities will appear here once users sign in</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {activity.name ? activity.name.charAt(0).toUpperCase() : activity.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-800">
                          {activity.name || 'Unknown User'}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 ${getRoleBadgeColor(activity.role)}`}>
                          {getRoleIcon(activity.role)}
                          {activity.role.charAt(0).toUpperCase() + activity.role.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} />
                        <span>{activity.email}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{new Date(activity.timestamp).toLocaleString()}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-200 rounded text-slate-700">
                          {activity.loginMethod === 'google' ? '🔐 Google' : '📧 Email'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-500 text-center">
          Total Logins: <span className="font-semibold text-slate-700">{activities.length}</span>
        </p>
      </div>
    </div>
  );
}

export default UserActivityLog;
