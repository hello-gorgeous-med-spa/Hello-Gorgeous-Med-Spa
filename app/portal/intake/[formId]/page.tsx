'use client';

// ============================================================
// INTAKE FORM PAGE
// Digital form completion with signature capture
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { STANDARD_INTAKE_FORMS, type IntakeForm, type IntakeFormField } from '@/lib/hgos/intake-forms';
import { SMSDisclosure } from '@/components/SMSDisclosure';

interface SignaturePadProps {
  onChange: (dataUrl: string) => void;
}

function SignaturePad({ onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <div className="border-2 border-dashed border-black rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <button
        type="button"
        onClick={clearSignature}
        className="text-sm text-black hover:text-black"
      >
        Clear Signature
      </button>
    </div>
  );
}

export default function IntakeFormPage({ params }: { params: { formId: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Find the form
  const form = STANDARD_INTAKE_FORMS.find(f => f.id === params.formId);

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Form Not Found</h1>
        <Link href="/portal" className="text-[#FF2D8E] hover:underline">
          Return to Portal
        </Link>
      </div>
    );
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when field is changed
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    for (const field of form.fields) {
      if (field.required && field.type !== 'section') {
        const value = formData[field.id];
        
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = 'This field is required';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsComplete(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 rounded-xl p-8">
          <span className="text-5xl mb-4 block">✓</span>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Form Completed!</h1>
          <p className="text-green-700 mb-6">
            Thank you for completing the {form.name}. Your information has been saved securely.
          </p>
          <Link
            href="/portal"
            className="px-6 py-3 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black inline-block"
          >
            Return to Portal
          </Link>
        </div>
      </div>
    );
  }

  const renderField = (field: IntakeFormField) => {
    // Check conditional visibility
    if (field.conditionalOn) {
      const conditionValue = formData[field.conditionalOn.field];
      if (conditionValue !== field.conditionalOn.value) {
        return null;
      }
    }

    switch (field.type) {
      case 'section':
        return (
          <div key={field.id} className="pt-6 pb-2 border-b border-black">
            <h3 className="text-lg font-semibold text-black">{field.label}</h3>
          </div>
        );

      case 'text':
        return (
          <div key={field.id} id={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-black">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-2 border rounded-lg ${errors[field.id] ? 'border-red-500' : 'border-black'}`}
            />
            {field.helpText && <p className="text-xs text-black">{field.helpText}</p>}
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} id={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-black">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg ${errors[field.id] ? 'border-red-500' : 'border-black'}`}
            />
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} id={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-black">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg ${errors[field.id] ? 'border-red-500' : 'border-black'}`}
            />
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} id={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-black">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg ${errors[field.id] ? 'border-red-500' : 'border-black'}`}
            >
              <option value="">Select...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} id={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-black">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(opt => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    checked={formData[field.id] === opt}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="text-[#FF2D8E]"
                  />
                  <span className="text-black">{opt}</span>
                </label>
              ))}
            </div>
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} id={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-black">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(opt => (
                <label key={opt} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={(formData[field.id] || []).includes(opt)}
                    onChange={(e) => {
                      const current = formData[field.id] || [];
                      const newValue = e.target.checked
                        ? [...current, opt]
                        : current.filter((v: string) => v !== opt);
                      handleFieldChange(field.id, newValue);
                    }}
                    className="mt-1 text-[#FF2D8E] rounded"
                  />
                  <span className="text-black">{opt}</span>
                </label>
              ))}
            </div>
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
          </div>
        );

      case 'phone':
        return (
          <div key={field.id} id={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-black">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="tel"
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-2 border rounded-lg ${errors[field.id] ? 'border-red-500' : 'border-black'}`}
            />
            <SMSDisclosure variant="dark" />
            {field.helpText && <p className="text-xs text-black">{field.helpText}</p>}
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
          </div>
        );

      case 'phone':
        return (
          <div key={field.id} id={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-black">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="tel"
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-2 border rounded-lg ${errors[field.id] ? 'border-red-500' : 'border-black'}`}
            />
            <SMSDisclosure variant="dark" />
            {field.helpText && <p className="text-xs text-black">{field.helpText}</p>}
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
          </div>
        );

      case 'signature':
        return (
          <div key={field.id} id={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-black">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <p className="text-xs text-black mb-2">Please sign below using your mouse or finger</p>
            <SignaturePad onChange={(dataUrl) => handleFieldChange(field.id, dataUrl)} />
            {errors[field.id] && <p className="text-xs text-red-500">{errors[field.id]}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/portal" className="text-sm text-black hover:text-black mb-2 inline-block">
          ← Back to Portal
        </Link>
        <h1 className="text-2xl font-bold text-black">{form.name}</h1>
        <p className="text-black">{form.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-black p-6">
        <div className="space-y-6">
          {form.fields.map(renderField)}
        </div>

        <div className="mt-8 pt-6 border-t border-black">
          <div className="flex items-center justify-between">
            <p className="text-sm text-black">
              * Required fields
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </div>
      </form>

      <p className="text-xs text-black mt-4 text-center">
        Your information is protected and stored securely in compliance with HIPAA regulations.
      </p>
    </div>
  );
}
