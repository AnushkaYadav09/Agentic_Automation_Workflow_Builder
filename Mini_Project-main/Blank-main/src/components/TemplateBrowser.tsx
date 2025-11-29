import { useState } from 'react';
import { X, Search, FileText, Download, Eye } from 'lucide-react';
import { emailTemplates, EmailTemplate } from '../data/emailTemplates';

interface TemplateBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: EmailTemplate) => void;
}

function TemplateBrowser({ isOpen, onClose, onSelectTemplate }: TemplateBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const categories = [
    { value: 'all', label: 'All Templates', icon: '📚' },
    { value: 'weekly-report', label: 'Weekly Reports', icon: '📊' },
    { value: 'monthly-report', label: 'Monthly Reports', icon: '📅' },
    { value: 'project-update', label: 'Project Updates', icon: '🚀' },
    { value: 'meeting-summary', label: 'Meeting Minutes', icon: '📝' },
    { value: 'status-update', label: 'Status Updates', icon: '⚡' },
  ];

  const filteredTemplates = emailTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: EmailTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  const handleDownloadTemplate = (template: EmailTemplate) => {
    const content = `Subject: ${template.subject}\n\n${template.body}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Email Templates</h2>
              <p className="text-sm text-slate-500">Choose a professional template for your email</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                  selectedCategory === category.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText size={64} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No templates found</h3>
              <p className="text-slate-500">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{template.icon}</span>
                      <div>
                        <h3 className="font-semibold text-slate-800">{template.name}</h3>
                        <p className="text-xs text-slate-500">{template.category.replace('-', ' ')}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Use Template
                    </button>
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownloadTemplate(template)}
                      className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {previewTemplate && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                <h3 className="font-bold text-lg">{previewTemplate.icon} {previewTemplate.name}</h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-700">Subject:</label>
                  <p className="text-slate-800 mt-1">{previewTemplate.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Body:</label>
                  <pre className="text-sm text-slate-800 mt-2 whitespace-pre-wrap font-sans">{previewTemplate.body}</pre>
                </div>
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      handleUseTemplate(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Use This Template
                  </button>
                  <button
                    onClick={() => handleDownloadTemplate(previewTemplate)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateBrowser;
