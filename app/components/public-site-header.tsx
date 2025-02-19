import { Link, type LinkProps } from "@tanstack/react-router";
import { GithubIcon, LayoutDashboardIcon, Rows3 } from "lucide-react";

import { useAuth } from "~/auth";
import { cn } from "~/lib/utils";
import { LogoIcon } from "./logo";

type IconLinkProps = {
  children: React.ReactNode;
  title: string;
  className?: string;
} & LinkProps;

export function IconLink({ children, to, className, ...props }: IconLinkProps) {
  const Component = to ? Link : "a";
  return (
    <Component
      to={to}
      className={cn(
        "rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-1 hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function PublicSiteHeader() {
  const { session } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full h-16 px-6 border-b shrink-0 bg-background md:rounded-t-xl">
      <div className="max-w-2xl lg:max-w-5xl mx-auto w-full h-full flex items-center">
        <IconLink
          to="/"
          title="Go To Home"
          className="mr-6 flex items-center gap-2"
        >
          <LogoIcon className="-mr-1" />
          <span className="text-xl font-semibold hidden sm:block">
            Octopoda
          </span>
        </IconLink>

        <div className="flex items-center justify-end flex-1 gap-2">
          <nav className="flex items-center gap-0.5">
            <IconLink
              to="/view-data"
              title="Meine Daten"
              className="flex items-center gap-2 mr-2"
            >
              <Rows3 className="size-6" />
              <span>Meine Daten</span>
            </IconLink>

            <IconLink
              href="https://github.com/kasulio/octopoda"
              title="Go To GitHub"
              target="_blank"
            >
              <GithubIcon className="size-6" />
            </IconLink>
            {session?.user ? (
              <IconLink to="/dashboard" title="Go To Dashboard">
                <LayoutDashboardIcon className="size-6" />
              </IconLink>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
