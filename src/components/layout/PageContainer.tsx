import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function PageContainer({
  children,
  className,
  title,
  description,
  actions,
}: PageContainerProps) {
  return (
    <div className={cn('p-6 space-y-6', className)}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && (
              <h1 className="text-2xl font-semibold text-foreground animate-fade-in">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-muted-foreground mt-1 animate-fade-in delay-75">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 animate-fade-in delay-100">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
