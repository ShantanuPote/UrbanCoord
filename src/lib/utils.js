// Simple utility functions

export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  // Simple toast functionality 
  let toastId = 0;
  const toasts = [];
  
  export function useToast() {
    const toast = ({ title, description, variant = "default" }) => {
      const id = ++toastId;
      const toastElement = document.createElement('div');
      
      const bgColor = variant === 'destructive' ? 'bg-red-500' : 'bg-gray-800';
      
      toastElement.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300`;
      toastElement.innerHTML = `
        <div class="font-medium">${title}</div>
        ${description ? `<div class="text-sm opacity-90">${description}</div>` : ''}
      `;
      
      document.body.appendChild(toastElement);
      
      setTimeout(() => {
        toastElement.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(toastElement)) {
            document.body.removeChild(toastElement);
          }
        }, 300);
      }, 3000);
    };
    
    return { toast };
  }