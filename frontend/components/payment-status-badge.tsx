'use client';

interface PaymentStatusBadgeProps {
  status: 'Paid' | 'Partial' | 'Unpaid';
  className?: string;
}

export function PaymentStatusBadge({ status, className = '' }: PaymentStatusBadgeProps) {
  const getBadgeStyles = (status: string) => {
    switch (status) {
      case 'Paid':
        // Solid black background, white text - highest contrast
        return {
          container: 'bg-black text-white border border-black',
          icon: '✓',
        };
      case 'Partial':
        // 1px black border, black text
        return {
          container: 'bg-transparent text-black border border-black',
          icon: '⊕',
        };
      case 'Unpaid':
        // Light gray text, subtle/dimmed
        return {
          container: 'bg-transparent text-gray-500 border border-gray-300 line-through',
          icon: '○',
        };
      default:
        return {
          container: 'bg-gray-200 text-gray-600 border border-gray-300',
          icon: '?',
        };
    }
  };

  const styles = getBadgeStyles(status);

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 px-2 py-1 text-sm font-medium ${styles.container} ${className}`}
    >
      <span className="text-xs">{styles.icon}</span>
      {status}
    </span>
  );
}
