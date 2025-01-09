import { debug } from "codebase-stats-collector/dist/console/console.js";
import { SummaryDashboard } from "codebase-stats-collector/dist/dashboard/summary-dashboard.js";
import { ExpandedCommit } from "codebase-stats-collector/dist/interfaces.js";
import { Readable } from "stream";

export function setupProgressStream(
  summaryDashboard: SummaryDashboard,
): Readable {
  let commitsCounter = 0;

  const commitsStream = new Readable({
    objectMode: true,
    read() {
      // do nothing.
    },
  });
  commitsStream.on("data", (commit: ExpandedCommit) => {
    debug("Commit", commit);

    commitsCounter += 1;
    summaryDashboard.setCurrentProgress(commitsCounter, commit);
  });
  commitsStream.on("error", (err) => {
    debug("error reading commits", { err });
  });
  commitsStream.on("end", () => {
    debug("done reading commits", {});
  });
  commitsStream.on("close", () => {
    debug("stream closed", {});
  });
  return commitsStream;
}
