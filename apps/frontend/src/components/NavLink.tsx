import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  activeClassName?: string;
  pendingClassName?: string;
  isActive?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, href, isActive, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
