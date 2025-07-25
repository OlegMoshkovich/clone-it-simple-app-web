import { describe, it, expect } from 'bun:test';
import { Button, buttonVariants } from '../button';

describe('Button Component Unit Tests', () => {
  describe('buttonVariants function', () => {
    it('should return default variant classes', () => {
      const classes = buttonVariants();
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
      expect(classes).toContain('justify-center');
      expect(classes).toContain('rounded-md');
      expect(classes).toContain('text-sm');
      expect(classes).toContain('font-medium');
    });

    it('should apply default variant styles', () => {
      const classes = buttonVariants({ variant: 'default' });
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
      expect(classes).toContain('hover:bg-primary/90');
    });

    it('should apply destructive variant styles', () => {
      const classes = buttonVariants({ variant: 'destructive' });
      expect(classes).toContain('bg-destructive');
      expect(classes).toContain('text-destructive-foreground');
      expect(classes).toContain('hover:bg-destructive/90');
    });

    it('should apply outline variant styles', () => {
      const classes = buttonVariants({ variant: 'outline' });
      expect(classes).toContain('border');
      expect(classes).toContain('border-input');
      expect(classes).toContain('bg-background');
      expect(classes).toContain('hover:bg-accent');
      expect(classes).toContain('hover:text-accent-foreground');
    });

    it('should apply secondary variant styles', () => {
      const classes = buttonVariants({ variant: 'secondary' });
      expect(classes).toContain('bg-secondary');
      expect(classes).toContain('text-secondary-foreground');
      expect(classes).toContain('hover:bg-secondary/80');
    });

    it('should apply ghost variant styles', () => {
      const classes = buttonVariants({ variant: 'ghost' });
      expect(classes).toContain('hover:bg-accent');
      expect(classes).toContain('hover:text-accent-foreground');
    });

    it('should apply link variant styles', () => {
      const classes = buttonVariants({ variant: 'link' });
      expect(classes).toContain('text-primary');
      expect(classes).toContain('underline-offset-4');
      expect(classes).toContain('hover:underline');
    });

    it('should apply default size styles', () => {
      const classes = buttonVariants({ size: 'default' });
      expect(classes).toContain('h-10');
      expect(classes).toContain('px-4');
      expect(classes).toContain('py-2');
    });

    it('should apply small size styles', () => {
      const classes = buttonVariants({ size: 'sm' });
      expect(classes).toContain('h-9');
      expect(classes).toContain('rounded-md');
      expect(classes).toContain('px-3');
    });

    it('should apply large size styles', () => {
      const classes = buttonVariants({ size: 'lg' });
      expect(classes).toContain('h-11');
      expect(classes).toContain('rounded-md');
      expect(classes).toContain('px-8');
    });

    it('should apply icon size styles', () => {
      const classes = buttonVariants({ size: 'icon' });
      expect(classes).toContain('h-10');
      expect(classes).toContain('w-10');
    });

    it('should combine variant and size styles', () => {
      const classes = buttonVariants({ variant: 'destructive', size: 'lg' });
      expect(classes).toContain('bg-destructive');
      expect(classes).toContain('text-destructive-foreground');
      expect(classes).toContain('h-11');
      expect(classes).toContain('px-8');
    });

    it('should include custom className', () => {
      const classes = buttonVariants({ className: 'custom-class' });
      expect(classes).toContain('custom-class');
    });

    it('should handle all combinations', () => {
      const classes = buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'test-class'
      });
      expect(classes).toContain('border');
      expect(classes).toContain('border-input');
      expect(classes).toContain('h-9');
      expect(classes).toContain('px-3');
      expect(classes).toContain('test-class');
    });
  });

  describe('Button component structure', () => {
    it('should have correct displayName', () => {
      expect(Button.displayName).toBe('Button');
    });

    it('should be a React component', () => {
      expect(typeof Button).toBe('object');
      expect(Button.$$typeof).toBeDefined();
    });

    it('should export buttonVariants', () => {
      expect(typeof buttonVariants).toBe('function');
    });
  });

  describe('Button props validation', () => {
    it('should accept variant prop', () => {
      const validVariants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
      validVariants.forEach(variant => {
        const classes = buttonVariants({ variant });
        expect(classes).toBeDefined();
        expect(typeof classes).toBe('string');
      });
    });

    it('should accept size prop', () => {
      const validSizes = ['default', 'sm', 'lg', 'icon'];
      validSizes.forEach(size => {
        const classes = buttonVariants({ size });
        expect(classes).toBeDefined();
        expect(typeof classes).toBe('string');
      });
    });

    it('should handle invalid variant gracefully', () => {
      const classes = buttonVariants({ variant: 'invalid' });
      expect(classes).toBeDefined();
      expect(typeof classes).toBe('string');
      // Should fall back to default variant (no variant specified)
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
    });

    it('should handle invalid size gracefully', () => {
      const classes = buttonVariants({ size: 'invalid' });
      expect(classes).toBeDefined();
      expect(typeof classes).toBe('string');
      // Should fall back to default size (no size specified)
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
    });
  });

  describe('Button accessibility features', () => {
    it('should include focus styles', () => {
      const classes = buttonVariants();
      expect(classes).toContain('focus-visible:outline-none');
      expect(classes).toContain('focus-visible:ring-2');
      expect(classes).toContain('focus-visible:ring-ring');
      expect(classes).toContain('focus-visible:ring-offset-2');
    });

    it('should include disabled styles', () => {
      const classes = buttonVariants();
      expect(classes).toContain('disabled:pointer-events-none');
      expect(classes).toContain('disabled:opacity-50');
    });

    it('should include transition styles', () => {
      const classes = buttonVariants();
      expect(classes).toContain('transition-colors');
    });
  });

  describe('Button styling consistency', () => {
    it('should always include base button styles', () => {
      const classes = buttonVariants();
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
      expect(classes).toContain('justify-center');
      expect(classes).toContain('whitespace-nowrap');
      expect(classes).toContain('rounded-md');
      expect(classes).toContain('text-sm');
      expect(classes).toContain('font-medium');
    });

    it('should include ring offset styles', () => {
      const classes = buttonVariants();
      expect(classes).toContain('ring-offset-background');
    });
  });
}); 