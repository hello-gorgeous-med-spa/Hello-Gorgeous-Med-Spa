'use client';

// ============================================================
// INTAKE FORM COMPONENT
// Dynamic medical history questionnaire
// ============================================================

import { useState } from 'react';
import SignaturePad from './SignaturePad';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'checkbox_group' | 'date' | 'phone' | 'email' | 'number';
  required?: boolean;
  options?: string[];
  conditional?: {
    field: string;
    value: string;
  };
  placeholder?: string;
  helpText?: string;
}

interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

interface IntakeFormProps {
  templateName: string;
  sections: FormSection[];
  clientName: string;
  onComplete: (data: {
    formData: Record<string, any>;
    signatureData: string;
    signedAt: Date;
  }) => void;
  onCancel: () => void;
  existingData?: Record<string, any>;
}

export default function IntakeForm({
  templateName,
  sections,
  clientName,
  onComplete,
  onCancel,
  existingData = {},
}: IntakeFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(existingData);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLastSection = currentSection === sections.length;
  const currentSectionData = sections[currentSection];

  const updateField = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const toggleCheckboxGroup = (name: string, option: string) => {
    const current = formData[name] || [];
    const updated = current.includes(option)
      ? current.filter((o: string) => o !== option)
      : [...current, option];
    updateField(name, updated);
  };

  const validateSection = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentSectionData) return true;

    currentSectionData.fields.forEach((field) => {
      // Skip validation if field has conditional that isn't met
      if (field.conditional) {
        if (formData[field.conditional.field] !== field.conditional.value) {
          return;
        }
      }

      if (field.required) {
        const value = formData[field.name];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = 'This field is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextSection = () => {
    if (validateSection()) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const goToPreviousSection = () => {
    setCurrentSection((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    if (!signatureData) return;

    setIsSubmitting(true);
    
    // In real implementation, this would save to Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onComplete({
      formData,
      signatureData,
      signedAt: new Date(),
    });
  };

  const shouldShowField = (field: FormField) => {
    if (!field.conditional) return true;
    return formData[field.conditional.field] === field.conditional.value;
  };

  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null;

    const hasError = errors[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type === 'phone' ? 'tel' : field.type}
              value={formData[field.name] || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
            {field.helpText && <p className="text-sm text-gray-500">{field.helpText}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={formData[field.name] || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={formData[field.name] || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex flex-wrap gap-3">
              {field.options?.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer transition-colors ${
                    formData[field.name] === option
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={option}
                    checked={formData[field.name] === option}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'checkbox_group':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {field.options?.map((option) => {
                const isChecked = (formData[field.name] || []).includes(option);
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheckboxGroup(field.name, option)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className={isChecked ? 'text-indigo-700' : 'text-gray-700'}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={formData[field.name] || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{templateName}</h2>
            <p className="text-sm text-gray-500">Patient: {clientName}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {isLastSection
                ? 'Review & Sign'
                : `Section ${currentSection + 1} of ${sections.length}`}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentSection) / (sections.length + 1)) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection) / (sections.length + 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isLastSection && currentSectionData && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentSectionData.title}
                </h3>
                {currentSectionData.description && (
                  <p className="text-gray-500 mt-1">{currentSectionData.description}</p>
                )}
              </div>

              {currentSectionData.fields.map((field) => renderField(field))}
            </div>
          )}

          {/* Signature Section */}
          {isLastSection && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Review & Sign
                </h3>
                <p className="text-gray-600">
                  Please review your responses and sign below to certify that the
                  information provided is accurate and complete.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Summary</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(formData).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    const displayValue = Array.isArray(value) ? value.join(', ') : value;
                    return (
                      <div key={key} className="flex">
                        <span className="text-gray-500 w-1/3">{key}:</span>
                        <span className="text-gray-900">{displayValue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Certification:</strong> I certify that the information provided
                  in this intake form is true and accurate to the best of my knowledge.
                  I understand that providing false information may affect my treatment.
                </p>
              </div>

              <div className="flex justify-center">
                <SignaturePad
                  onComplete={(data) => setSignatureData(data)}
                  onClear={() => setSignatureData(null)}
                  width={500}
                  height={200}
                />
              </div>

              {signatureData && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-xl">✓</span>
                    <span className="font-medium">Signature captured</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={currentSection === 0 ? onCancel : goToPreviousSection}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            {currentSection === 0 ? 'Cancel' : '← Back'}
          </button>

          {!isLastSection ? (
            <button
              onClick={goToNextSection}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!signatureData || isSubmitting}
              className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : '✓ Submit Intake Form'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
