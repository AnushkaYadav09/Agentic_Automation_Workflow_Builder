import React from 'react';
import { Plus } from 'lucide-react';
import { blockTemplates } from '../data/blockTemplates';
import { useWorkflow } from '../context/WorkflowContext';

const BlockTemplatesSidebar: React.FC = () => {
  const { addBlock, currentWorkflow } = useWorkflow();

  const categories = Array.from(new Set(blockTemplates.map(t => t.category)));

  const handleAddBlock = (template: typeof blockTemplates[0]) => {
    if (!currentWorkflow) return;

    const existingBlocks = currentWorkflow.blocks.length;
    addBlock({
      blockType: template.blockType,
      config: { ...template.defaultConfig, icon: template.icon },
      position: {
        x: 100 + (existingBlocks % 3) * 250,
        y: 100 + Math.floor(existingBlocks / 3) * 150
      },
      label: template.name
    });
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-slate-800">Building Blocks</h2>
        <p className="text-xs text-slate-500 mt-1">Drag or click to add</p>
      </div>

      <div className="p-3">
        {categories.map(category => (
          <div key={category} className="mb-4">
            <h3 className="text-xs font-semibold text-slate-600 uppercase mb-2 px-2">
              {category}
            </h3>
            <div className="space-y-1">
              {blockTemplates
                .filter(t => t.category === category)
                .map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleAddBlock(template)}
                    disabled={!currentWorkflow}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <Plus size={16} className="text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">
                          {template.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockTemplatesSidebar;
