import React from 'react';
import { cn } from '@/lib/utils';

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        ref={ref}
        className={cn('px-6 py-2 rounded-full text-white relative overflow-hidden group', className)}
        {...props}
      />
    );
  }
);
CustomButton.displayName = 'CustomButton';

export { CustomButton };