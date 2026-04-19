'use client';

import { Template } from '@/types';
import { FileText, Briefcase, Home, Users, DollarSign, Shield } from 'lucide-react';

interface TemplateGalleryProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  business: <Briefcase className="w-5 h-5" />,
  real_estate: <Home className="w-5 h-5" />,
  employment: <Users className="w-5 h-5" />,
  finance: <DollarSign className="w-5 h-5" />,
  legal: <Shield className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  business: 'bg-blue-100 text-blue-700',
  real_estate: 'bg-green-100 text-green-700',
  employment: 'bg-purple-100 text-purple-700',
  finance: 'bg-yellow-100 text-yellow-700',
  legal: 'bg-red-100 text-red-700',
};

const categoryLabels: Record<string, string> = {
  business: 'Business',
  real_estate: 'Real Estate',
  employment: 'Employment',
  finance: 'Finance',
  legal: 'Legal',
};

export default function TemplateGallery({ templates, onSelect }: TemplateGalleryProps) {
  const categories = Array.from(new Set(templates.map(t => t.category).filter((c): c is string => !!c)));

  return (
    <div className="space-y-8">
      {categories.length > 0 ? (
        categories.map(category => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-1.5 rounded-lg ${categoryColors[category] ?? 'bg-gray-100 text-gray-700'}`}>
                {categoryIcons[category] || <FileText className="w-5 h-5" />}
              </div>
              <h3 className="font-semibold text-gray-900">
                {categoryLabels[category] ?? category}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {templates
                .filter(t => t.category === category)
                .map(template => (
                  <TemplateCard key={template.id} template={template} onSelect={onSelect} />
                ))}
            </div>
          </div>
        ))
      ) : (
        // No categories — show flat grid
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates.map(template => (
            <TemplateCard key={template.id} template={template} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template, onSelect }: { template: Template; onSelect: (t: Template) => void }) {
  const color = (template.category && categoryColors[template.category]) || 'bg-gray-100 text-gray-700';

  return (
    <button
      onClick={() => onSelect(template)}
      className="flex flex-col items-start p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
        {(template.category && categoryIcons[template.category]) || <FileText className="w-5 h-5" />}
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-gray-900 leading-tight">{template.name_ru}</p>
      {template.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
      )}

      {/* Field count */}
      <div className="mt-3 text-xs text-gray-400">
        {template.fields_schema?.fields?.length || 0} fields
      </div>
    </button>
  );
}