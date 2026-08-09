import type { SchemaType, SchemaDefinition } from '@/types';
import { schemaDefinitions } from '@/data/schemaDefinitions';
import { Braces, ChevronDown, Info } from 'lucide-react';
import { useState } from 'react';

interface JsonLdFormProps {
  schemaType: SchemaType;
  schemaData: Record<string, unknown>;
  onChange: (type: SchemaType, data: Record<string, unknown>) => void;
}

export function JsonLdForm({ schemaType, schemaData, onChange }: JsonLdFormProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const allTypes: SchemaType[] = ['none', ...Object.keys(schemaDefinitions) as SchemaType[]];
  const currentDef: SchemaDefinition | null =
    schemaType !== 'none' ? schemaDefinitions[schemaType as Exclude<SchemaType, 'none'>] : null;

  const handleFieldChange = (key: string, value: string) => {
    onChange(schemaType, { ...schemaData, [key]: value });
  };

  const handleTypeChange = (type: SchemaType) => {
    setDropdownOpen(false);
    onChange(type, {});
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Braces size={18} className="text-choco-500" />
        <h3 className="text-sm font-semibold text-ink">JSON-LD Structured Data</h3>
      </div>
      <p className="text-xs text-ink-muted mb-4">
        Add schema.org structured data so Google can understand your page and show rich results.
      </p>

      {/* Schema type selector */}
      <div className="relative mb-4">
        <label className="field-label">Schema Type</label>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="field-input flex items-center justify-between cursor-pointer text-left"
        >
          <span className={schemaType === 'none' ? 'text-ink-muted' : 'text-ink'}>
            {schemaType === 'none' ? 'Select a schema type...' : currentDef?.label}
          </span>
          <ChevronDown size={16} className={`text-ink-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute z-20 mt-1 w-full rounded-lg border border-sand-200 bg-white shadow-lift py-1.5 max-h-[300px] overflow-auto scrollbar-thin">
              {allTypes.map((type) => {
                const def = type !== 'none' ? schemaDefinitions[type as Exclude<SchemaType, 'none'>] : null;
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors ${
                      schemaType === type ? 'bg-choco-50 text-choco-700 font-medium' : 'text-ink-soft hover:bg-sand-50'
                    }`}
                  >
                    {type === 'none' ? (
                      <span className="text-ink-muted">None — no structured data</span>
                    ) : (
                      <div>
                        <div className="font-medium">{def?.label}</div>
                        <div className="text-xs text-ink-muted">{def?.description}</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Schema fields */}
      {currentDef && (
        <div className="space-y-4 animate-slide-up">
          {currentDef.description && (
            <div className="flex gap-2.5 items-start rounded-lg bg-sand-50 border border-sand-200 px-3.5 py-3">
              <Info size={15} className="text-choco-500 flex-none mt-0.5" />
              <p className="text-xs text-ink-soft leading-relaxed">{currentDef.description}</p>
            </div>
          )}
          {currentDef.fields.map((field) => (
            <div key={field.key}>
              <label className="field-label">
                {field.label}
                {field.required && <span className="text-choco-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="field-input min-h-[80px] resize-y font-mono text-[13px]"
                  value={(schemaData[field.key] as string) || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                />
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  className="field-input"
                  value={(schemaData[field.key] as string) || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
              {field.hint && <p className="field-hint">{field.hint}</p>}
            </div>
          ))}
        </div>
      )}

      {schemaType === 'none' && (
        <div className="rounded-lg bg-sand-50 border border-dashed border-sand-300 px-4 py-8 text-center">
          <Braces size={24} className="text-sand-400 mx-auto mb-2" />
          <p className="text-sm text-ink-muted">
            Select a schema type above to generate structured data
          </p>
        </div>
      )}
    </div>
  );
}
