import { createFileRoute, Link } from "@tanstack/react-router";

import { useAuth } from "~/auth";
import { Button } from "~/components/ui/button";
import { PageTitle } from "~/components/ui/typography";

export const Route = createFileRoute("/_public/")({
  component: Home,
});

function Home() {
  const { session } = useAuth();
  return (
    <>
      <PageTitle>Octopoda Analytics</PageTitle>
      <div className="flex flex-col gap-4 md:flex-row">
        <Button asChild variant="default">
          <Link to="/contribute">Contribute Data</Link>
        </Button>
        <Button asChild variant="default">
          <Link to="/view-data">View Your Data</Link>
        </Button>
        {session?.user ? (
          <Button asChild variant="secondary">
            <Link to="/dashboard">Go To Dashboard</Link>
          </Button>
        ) : null}
      </div>
    </>
  );
}