import { debug } from "codebase-stats-collector/dist/console/console.js";
import { SummaryDashboard } from "codebase-stats-collector/dist/dashboard/summary-dashboard.js";
import { GitRepository } from "codebase-stats-collector/dist/git-reader/git-repository.js";
import { ExpandedCommit } from "codebase-stats-collector/dist/interfaces.js";
import { getNumberOfContributorsPerFile } from "codebase-stats-collector/dist/stats/number-of-contributors-per-file.js";
import { Readable } from "stream";

import { log } from "../console.js";

function setupProgressStream(summaryDashboard: SummaryDashboard): Readable {
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

export async function collectKnowledgeGaps(
  dir: string,
  ignoreFiles: string | null,
): Promise<void> {
  // initialize repo
  const repo = new GitRepository(dir);

  // initialize summary dashboard:
  const summaryDashboard = new SummaryDashboard([]);
  summaryDashboard.startProgress();

  const commitsStream = setupProgressStream(summaryDashboard);

  // number of total commits:
  const commits = await repo.getListOfCommits();
  summaryDashboard.setCommits(commits);

  const commitsWithChangedFiles = await repo.getListOfCommitsWithChangedFiles({
    stream: commitsStream,
  });
  const contributorsPerFile = getNumberOfContributorsPerFile(
    commitsWithChangedFiles,
  ).filter((x) => x.isExistingFile);
  let knowledgeGaps = contributorsPerFile.sort((a, b) => {
    if (a.contributorsNames.length === b.contributorsNames.length) {
      return a.lastChange.getTime() - b.lastChange.getTime();
    }
    return a.contributorsNames.length - b.contributorsNames.length;
  });

  if (ignoreFiles) {
    knowledgeGaps = knowledgeGaps.filter((x) => !x.filePath.match(ignoreFiles));
  }

  const topKnowledgeGaps = knowledgeGaps.slice(0, 50);

  log(
    "knowledge gaps (files with least number of contributors)",
    topKnowledgeGaps,
  );
}
