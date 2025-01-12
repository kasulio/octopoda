import { createServerFn } from "@tanstack/start";
import { zodValidator } from "@tanstack/zod-adapter";
import { router } from "react-query-kit";
import { z } from "zod";

import { instanceCountsAsActiveDays } from "~/constants";
import { influxDb } from "~/db/client";
import { env } from "~/env";

const loadPointMetadataRowSchema = z
  .object({
    _field: z.string(),
    _value: z.union([z.string(), z.number(), z.boolean()]),
    _time: z.string().transform((v) => new Date(v)),
    componentId: z.string(),
  })
  .transform((original) => ({
    field: original._field,
    value: original._value,
    lastUpdate: original._time,
    componentId: original.componentId,
  }));

export const getLoadPointMetaData = createServerFn()
  .validator(zodValidator(z.object({ instanceId: z.string() })))
  .handler(async ({ data }) => {
    const rows = await influxDb.collectRows(
      `from(bucket: "${env.INFLUXDB_BUCKET}")
        |> range(start: -${instanceCountsAsActiveDays}d)
        |> filter(fn: (r) => r["_measurement"] == "loadpoints")
        |> filter(fn: (r) => r["instance"] == "${data.instanceId}")
        |> last()
     `,
    );
    const res = loadPointMetadataRowSchema.array().parse(rows);
    return res.reduce(
      (acc, item) => {
        if (!acc[item.componentId]) {
          acc[item.componentId] = {};
        }
        acc[item.componentId][item.field] = {
          value: item.value,
          lastUpdate: item.lastUpdate,
        };
        return acc;
      },
      {} as Record<
        string,
        Record<string, { value: string | number | boolean; lastUpdate: Date }>
      >,
    );
  });

export const loadPointApi = router("loadPoint", {
  getLoadPointMetaData: router.query({ fetcher: getLoadPointMetaData }),
});