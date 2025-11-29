import React from 'react';
import { Sparkles, CircleCheck as CheckCircle } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

const AISuggestions: React.FC = () => {
  const { currentWorkflow, suggestions, generateSuggestions, applySuggestion } = useWorkflow();

  const workflowSuggestions = suggestions.filter(
    s => s.workflowId === currentWorkflow?.id
  );

  const handleGenerateSuggestions = () => {
    if (currentWorkflow) {
      generateSuggestions(currentWorkflow.id);
    }
  };

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <p className="text-slate-500">Select a workflow to see AI suggestions</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-blue-500" />
            <h2 className="text-xl font-semibold text-slate-800">AI Suggestions</h2>
          </div>
          <button
            onClick={handleGenerateSuggestions}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Sparkles size={16} />
            Generate Suggestions
          </button>
        </div>

        {workflowSuggestions.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <Sparkles size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-2">No suggestions yet</p>
            <p className="text-slate-400 text-sm">
              Click "Generate Suggestions" to get AI-powered recommendations for improving your workflow
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workflowSuggestions.map(suggestion => (
              <div
                key={suggestion.id}
                className={`bg-white rounded-lg border-2 shadow-sm p-4 transition-all ${
                  suggestion.isApplied
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {suggestion.isApplied ? (
                      <CheckCircle size={20} className="text-emerald-500" />
                    ) : (
                      <Sparkles size={20} className="text-blue-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">{suggestion.title}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                          suggestion.suggestionType === 'optimization' ? 'bg-blue-100 text-blue-700' :
                          suggestion.suggestionType === 'error_handling' ? 'bg-amber-100 text-amber-700' :
                          suggestion.suggestionType === 'new_block' ? 'bg-purple-100 text-purple-700' :
                          'bg-teal-100 text-teal-700'
                        }`}>
                          {suggestion.suggestionType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-3">
                      {suggestion.description}
                    </p>

                    {!suggestion.isApplied && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => applySuggestion(suggestion.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Mark as Applied
                        </button>
                        <button
                          onClick={() => {
                            // Dismiss logic here
                          }}
                          className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}

                    {suggestion.isApplied && (
                      <div className="flex items-center gap-2 text-emerald-600 text-sm">
                        <CheckCircle size={14} />
                        <span className="font-medium">Applied</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">About AI Suggestions</h4>
              <p className="text-blue-800 text-sm">
                Our AI analyzes your workflow structure and suggests improvements for reliability,
                performance, and best practices. Suggestions include error handling, optimization
                opportunities, and recommended blocks to enhance your automation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
