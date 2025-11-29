import { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, Trash2, CheckCircle, Paperclip } from 'lucide-react';
import ScheduleEmailModal, { ScheduleData } from './ScheduleEmailModal';

interface ScheduledEmail extends ScheduleData {
  id: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

function ScheduledEmails() {
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load scheduled emails from localStorage
    const saved = localStorage.getItem('scheduledEmails');
    if (saved) {
      const emails = JSON.parse(saved);
      setScheduledEmails(emails);
      
      // Check immediately on load
      setTimeout(() => checkAndSendEmails(emails), 1000);
    }

    // Check for emails that need to be sent every 30 seconds
    const interval = setInterval(() => {
      const current = JSON.parse(localStorage.getItem('scheduledEmails') || '[]');
      checkAndSendEmails(current);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkAndSendEmails = async (emailsList: ScheduledEmail[]) => {
    const now = new Date();
    const updated = [...emailsList];
    let hasChanges = false;

    console.log('Checking scheduled emails...', now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    for (const email of updated) {
      if (email.status === 'pending') {
        const scheduledTime = new Date(`${email.date}T${email.time}`);
        
        console.log(`Email "${email.subject}" scheduled for:`, scheduledTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
        
        if (now >= scheduledTime) {
          console.log(`Sending email to ${email.recipient}...`);
          
          // Send the email
          try {
            // Prepare attachments (files are already base64 encoded)
            const attachments = [];
            if (email.attachments?.files) {
              for (const file of email.attachments.files) {
                attachments.push({
                  filename: file.name,
                  content: file.base64,
                  content_type: file.type || 'application/octet-stream'
                });
              }
            }

            console.log(`Sending with ${attachments.length} attachment(s)...`);

            const response = await fetch('http://localhost:8001/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: email.recipient,
                subject: email.subject,
                body: email.body,
                attachments: attachments.length > 0 ? attachments : undefined,
              }),
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
              email.status = 'sent';
              console.log(`✅ Email sent successfully to ${email.recipient}`);
              alert(`✅ Scheduled email sent!\n\nTo: ${email.recipient}\nSubject: ${email.subject}\n📎 ${attachments.length} attachment(s)`);
            } else {
              email.status = 'failed';
              console.error(`❌ Failed to send email:`, result.error);
            }
            hasChanges = true;
          } catch (error) {
            email.status = 'failed';
            console.error(`❌ Error sending email:`, error);
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      setScheduledEmails(updated);
      localStorage.setItem('scheduledEmails', JSON.stringify(updated));
    }
  };

  const handleSchedule = (scheduleData: ScheduleData) => {
    // Build email body with links (files will be actual attachments)
    let emailBody = scheduleData.body;
    
    if (scheduleData.attachments?.links && scheduleData.attachments.links.length > 0) {
      emailBody += '\n\n---\n🔗 Links:\n';
      scheduleData.attachments.links.forEach(link => {
        emailBody += `  • ${link}\n`;
      });
    }

    const newEmail: ScheduledEmail = {
      ...scheduleData,
      body: emailBody,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updated = [...scheduledEmails, newEmail];
    setScheduledEmails(updated);
    localStorage.setItem('scheduledEmails', JSON.stringify(updated));

    const attachmentCount = (scheduleData.attachments?.files.length || 0) + (scheduleData.attachments?.links.length || 0);
    const attachmentText = attachmentCount > 0 ? `\n📎 ${attachmentCount} attachment(s) included` : '';
    
    alert(`✅ Email scheduled successfully!\n\nWill be sent on ${scheduleData.date} at ${scheduleData.time} IST${attachmentText}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scheduled email?')) {
      const updated = scheduledEmails.filter(email => email.id !== id);
      setScheduledEmails(updated);
      localStorage.setItem('scheduledEmails', JSON.stringify(updated));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">⏳ Pending</span>;
      case 'sent':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">✅ Sent</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">❌ Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Scheduled Emails</h2>
              <p className="text-sm text-slate-500">Manage your scheduled email deliveries</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-medium shadow-lg"
          >
            + Schedule Email
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {scheduledEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Calendar size={64} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Scheduled Emails</h3>
            <p className="text-slate-500 mb-4">Schedule emails to be sent at a specific date and time</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-medium"
            >
              Schedule Your First Email
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledEmails.map((email) => (
              <div
                key={email.id}
                className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={18} className="text-purple-600" />
                      <h4 className="font-semibold text-slate-800">{email.subject}</h4>
                      {email.attachments && (email.attachments.files.length > 0 || email.attachments.links.length > 0) && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          <Paperclip size={12} />
                          {(email.attachments.files.length || 0) + (email.attachments.links.length || 0)}
                        </span>
                      )}
                      {getStatusBadge(email.status)}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">To: {email.recipient}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{new Date(email.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{email.time} IST</span>
                      </div>
                    </div>
                  </div>
                  {email.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Send immediately
                          checkAndSendEmails([email]);
                        }}
                        className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition text-xs font-medium"
                        title="Send Now"
                      >
                        Send Now
                      </button>
                      <button
                        onClick={() => handleDelete(email.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ScheduleEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSchedule={handleSchedule}
      />
    </div>
  );
}

export default ScheduledEmails;
