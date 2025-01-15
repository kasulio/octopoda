import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { InstancesFilter } from "~/components/instances-filter";
import { instanceApi } from "~/serverHandlers/instance";

export const Route = createFileRoute("/dashboard/grafana-embed")({
  component: RouteComponent,
});

function RouteComponent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const instanceData = instanceApi.getActiveInstances.useQuery();

  return (
    <>
      {/* @ts-expect-error okay for the testing now */}
      <InstancesFilter routeId={Route.id} className="mb-4" />
      <iframe
        ref={iframeRef}
        src={`https://grafana.lukasfrey.dev/public-dashboards/2253e03512554bc58bdfb8f592a48d62?theme=light&var-instanceIds=${instanceData.data?.map((instance) => instance.id).join(",")}`}
        className="h-full w-full rounded-lg"
        frameBorder={0}
      ></iframe>
    </>
  );
}
