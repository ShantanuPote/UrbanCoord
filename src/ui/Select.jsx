import { useState, createContext, useContext } from "react";

// Create context to share state internally
const SelectContext = createContext();

export function Select({ value, onValueChange, children, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, disabled }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = "", children }) {
  const { isOpen, setIsOpen, disabled } = useContext(SelectContext);

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => !disabled && setIsOpen(!isOpen)}
      disabled={disabled}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext);
  return <span>{value || placeholder}</span>;
}

export function SelectContent({ className = "", children }) {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      <div
        className={`absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto ${className}`}
      >
        {children}
      </div>
    </>
  );
}

export function SelectItem({ value, children }) {
  const { onValueChange, setIsOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
      onClick={() => {
        onValueChange(value);
        setIsOpen(false);
      }}
    >
      {children}
    </button>
  );
}
