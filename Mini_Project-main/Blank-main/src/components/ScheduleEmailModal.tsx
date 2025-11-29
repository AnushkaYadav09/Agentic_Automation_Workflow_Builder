import { useState } from 'react';
import { Calendar, Clock, X, Paperclip, Link as LinkIcon, File, Trash2, FileText } from 'lucide-react';
import TemplateBrowser from './TemplateBrowser';
import { EmailTemplate } from '../data/emailTemplates';

interface ScheduleEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (scheduleData: ScheduleData) => void;
}

export interface FileData {
  name: string;
  size: number;
  type: string;
  base64: string;
}

export interface ScheduleData {
  date: string;
  time: string;
  timezone: string;
  recipient: string;
  subject: string;
  body: string;
  attachments?: {
    files: FileData[];
    links: string[];
  };
}

function ScheduleEmailModal({ isOpen, onClose, onSchedule }: ScheduleEmailModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      setLinks(prev => [...prev, newLink.trim()]);
      setNewLink('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSubject(template.subject);
    setBody(template.body);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert files to base64
    const fileDataArray: FileData[] = [];
    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        fileDataArray.push({
          name: file.name,
          size: file.size,
          type: file.type,
          base64: base64,
        });
      } catch (error) {
        console.error(`Failed to encode file ${file.name}:`, error);
      }
    }
    
    const scheduleData: ScheduleData = {
      date,
      time,
      timezone: 'Asia/Kolkata',
      recipient,
      subject,
      body,
      attachments: {
        files: fileDataArray,
        links,
      },
    };

    onSchedule(scheduleData);
    onClose();
    
    // Reset form
    setDate('');
    setTime('');
    setRecipient('');
    setSubject('');
    setBody('');
    setFiles([]);
    setLinks([]);
    setNewLink('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Schedule Email</h2>
              <p className="text-sm text-slate-500">Set date and time for email delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Time (IST)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Timezone Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              🌏 Timezone: <span className="font-semibold">Asia/Kolkata (IST - Indian Standard Time)</span>
            </p>
          </div>

          {/* Template Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowTemplates(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition font-medium flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Browse Email Templates
            </button>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Choose from professional templates for weekly reports, project updates, and more
            </p>
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Email message..."
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Paperclip size={16} className="inline mr-2" />
              Attach Files
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
            />
            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <File size={16} className="text-purple-600" />
                      <span className="text-sm text-slate-700">{file.name}</span>
                      <span className="text-xs text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <LinkIcon size={16} className="inline mr-2" />
              Add Links
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                placeholder="https://example.com/document.pdf"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium text-sm"
              >
                Add
              </button>
            </div>
            {links.length > 0 && (
              <div className="mt-2 space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <LinkIcon size={16} className="text-purple-600 flex-shrink-0" />
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate"
                      >
                        {link}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-medium shadow-lg"
            >
              Schedule Email
            </button>
          </div>
        </form>
      </div>

      {/* Template Browser */}
      <TemplateBrowser
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}

export default ScheduleEmailModal;
