import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, X } from 'lucide-react';

// --- Input Components ---

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, helperText, className, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input
      className={`w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm ${className}`}
      {...props}
    />
    {helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
  </div>
);

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, options, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <div className="relative">
      <select
        className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <ChevronDown size={14} />
      </div>
    </div>
  </div>
);

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => (
  <div className="flex items-center mb-4">
    <input
      type="checkbox"
      className="w-4 h-4 text-purple-600 bg-white border-slate-300 rounded focus:ring-purple-500 focus:ring-2"
      {...props}
    />
    <label className="ml-2 text-sm font-medium text-slate-700">{label}</label>
  </div>
);

// --- Layout Components ---

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Section: React.FC<SectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-3xl shadow-lg mb-6 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 px-6 text-left hover:bg-slate-50 transition-colors"
      >
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>
      {isOpen && <div className="p-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">{children}</div>}
    </div>
  );
};

// --- Array Helper Components ---

interface StringArrayInputProps {
  label: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  placeholder?: string;
}

export const StringArrayInput: React.FC<StringArrayInputProps> = ({ label, values, onChange, placeholder = "Add item..." }) => {
  const [currentInput, setCurrentInput] = useState('');

  const addItem = () => {
    if (currentInput.trim()) {
      onChange([...values, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const removeItem = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
        <button
          type="button"
          onClick={addItem}
          className="bg-lime-400 hover:bg-lime-500 text-slate-900 px-3 py-2 rounded-xl transition-colors font-medium shadow-sm"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((val, idx) => (
          <span key={idx} className="inline-flex items-center bg-lime-100 text-lime-800 text-xs px-3 py-1.5 rounded-full border border-lime-200 font-medium">
            {val}
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="ml-1.5 text-lime-600 hover:text-lime-900"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

interface ComplexArrayInputProps<T> {
  label: string;
  items: T[];
  renderItem: (item: T, index: number, update: (newItem: T) => void, remove: () => void) => React.ReactNode;
  onAdd: () => void;
  onUpdate: (items: T[]) => void;
  emptyLabel?: string;
}

export function ComplexArrayInput<T>({ label, items, renderItem, onAdd, onUpdate, emptyLabel = "No items added." }: ComplexArrayInputProps<T>) {

  const handleUpdateItem = (index: number, newItem: T) => {
    const newItems = [...items];
    newItems[index] = newItem;
    onUpdate(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onUpdate(newItems);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs bg-white hover:bg-slate-50 border border-slate-200 text-purple-600 px-3 py-1.5 rounded-xl flex items-center transition-colors shadow-sm font-medium"
        >
          <Plus size={14} className="mr-1" /> Add
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-slate-400 italic p-4 border border-slate-200 border-dashed rounded-xl text-center">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative shadow-sm">
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1"
                title="Remove Item"
              >
                <Trash2 size={16} />
              </button>
              {renderItem(item, index, (newItem) => handleUpdateItem(index, newItem), () => handleRemoveItem(index))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}