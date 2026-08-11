import type { ReactNode, AnchorHTMLAttributes } from 'react';
import { localizeHref, useRouter } from '@/lib/router';

// Renders a real <a href> for internal paths (locale-aware) so crawlers
// can follow navigation. Keeps the current locale via useRouter().
interface SmartLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  children: ReactNode;
}

export function SmartLink({ to, children, ...rest }: SmartLinkProps) {
  const { locale } = useRouter();
  return (
    <a href={localizeHref(to, locale)} {...rest}>
      {children}
    </a>
  );
}
