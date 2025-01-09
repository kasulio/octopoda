import { createServerFn } from "@tanstack/start";
import { zodValidator } from "@tanstack/zod-adapter";
import { router } from "react-query-kit";
import { z } from "zod";

import { influxDb } from "~/db/client";
import { env } from "~/env";
import { protectedFnMiddleware } from "~/globalMiddleware";

export const instancesFilterSchema = z.object({
  instanceIds: z.array(z.string()).optional(),
});

const getActiveInstances = createServerFn()
  .middleware([protectedFnMiddleware])
  .handler(async () => {
    const instances = new Map<string, { id: string; lastUpdate: Date }>();
    for await (const { values, tableMeta } of influxDb.iterateRows(
      `from(bucket: "${env.INFLUXDB_BUCKET}")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "updated")
        |> last()
     `,
    )) {
      const row = tableMeta.toObject(values);

      if (typeof row.instance === "string" && typeof row._value === "string") {
        instances.set(row.instance, {
          id: row.instance,
          lastUpdate: new Date(parseInt(row._value) * 1000),
        });
      }
    }
    return Array.from(instances.values());
  });

export const generateInstanceId = createServerFn().handler(async () => {
  const instanceId = Bun.randomUUIDv7();

  return instanceId;
});

export const getLatestInstanceUpdate = createServerFn()
  .validator(
    zodValidator(
      z.object({
        instanceId: z.string(),
        hasToBeRecent: z.boolean().default(false),
      }),
    ),
  )
  .handler(async ({ data }) => {
    for await (const { values, tableMeta } of influxDb.iterateRows(
      `from(bucket: "${env.INFLUXDB_BUCKET}")
        |> range(start: ${data.hasToBeRecent ? "-3m" : "-1y"})
        |> filter(fn: (r) => r["_measurement"] == "updated")
        |> filter(fn: (r) => r["instance"] == "${data.instanceId}")
        |> last()
     `,
    )) {
      const row = tableMeta.toObject(values);
      if (row.instance === data.instanceId) {
        if (row._value && typeof row._value === "string") {
          return new Date(parseInt(row._value) * 1000);
        }
      }
    }

    return null;
  });

export const instanceApi = router("instance", {
  getActiveInstances: router.query({ fetcher: getActiveInstances }),
  getLatestInstanceUpdate: router.query({
    fetcher: getLatestInstanceUpdate,
  }),
  generateInstanceId: router.mutation({ mutationFn: generateInstanceId }),
});