import { chain, clamp, mapValues, pick } from "lodash";

type PageOptions = "skip" | "take";
type FromIndex = { [k in PageOptions]?: number };

const connectionKeys = ["skip", "take"];
const defaultMaxValues = { take: 100 };

export default (options: FromIndex, maxOptions: FromIndex = defaultMaxValues) =>
  pick(
    mapValues(options, (value, key: PageOptions) =>
      clamp(value!, 0, maxOptions[key] || Number.POSITIVE_INFINITY)
    ),
    connectionKeys
  );
