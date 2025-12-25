import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
  onSave: () => Promise<void>;
  hasChanges: boolean;
  debounceMs?: number;
  className?: string;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  onSave,
  hasChanges,
  debounceMs = 5000,
  className,
}) => {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSave = useCallback(async () => {
    setStatus('saving');
    try {
      await onSave();
      setStatus('saved');
      
      // Hide after 2 seconds
      hideTimeoutRef.current = setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
    }
  }, [onSave]);

  useEffect(() => {
    if (hasChanges) {
      setStatus('pending');
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout for auto-save
      timeoutRef.current = setTimeout(() => {
        performSave();
      }, debounceMs);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [hasChanges, debounceMs, performSave]);

  const handleRetry = () => {
    performSave();
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all',
        status === 'error'
          ? 'bg-destructive/10 border border-destructive/20 text-destructive'
          : 'bg-background border border-border text-foreground',
        className
      )}
    >
      {status === 'pending' && (
        <>
          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
          <span className="text-sm text-muted-foreground">Changes pending...</span>
        </>
      )}

      {status === 'saving' && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Saving...</span>
        </>
      )}

      {status === 'saved' && (
        <>
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600">Saved ✓</span>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Failed to save.</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </>
      )}
    </div>
  );
};

// Hook for managing auto-save state
export const useAutoSave = <T,>(
  initialData: T,
  onSave: (data: T) => Promise<void>,
  debounceMs = 5000
) => {
  const [data, setData] = useState<T>(initialData);
  const [hasChanges, setHasChanges] = useState(false);
  const initialDataRef = useRef(initialData);

  const updateData = useCallback((updates: Partial<T>) => {
    setData((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    await onSave(data);
    setHasChanges(false);
    initialDataRef.current = data;
  }, [data, onSave]);

  const resetChanges = useCallback(() => {
    setData(initialDataRef.current);
    setHasChanges(false);
  }, []);

  return {
    data,
    setData,
    updateData,
    hasChanges,
    handleSave,
    resetChanges,
  };
};
