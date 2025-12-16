import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

type MainNavProps = {
  className?: string;
};

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Pengguna',
    href: '/dashboard/users',
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/settings',
  },
];

export function MainNav({ className, ...props }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link href="/dashboard" className="flex items-center space-x-2">
        <span className="font-bold">MyApp</span>
      </Link>
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.disabled ? '#' : item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-foreground'
              : 'text-foreground/60',
            item.disabled && 'cursor-not-allowed opacity-80'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
