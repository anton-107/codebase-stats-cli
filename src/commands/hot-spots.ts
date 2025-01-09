import { SummaryDashboard } from "codebase-stats-collector/dist/dashboard/summary-dashboard.js";
import { GitRepository } from "codebase-stats-collector/dist/git-reader/git-repository.js";
import { getNumberOfChangesPerFile } from "codebase-stats-collector/dist/stats/number-of-changes-per-file.js";

import { log } from "../console.js";
import { setupProgressStream } from "../dashboard/progress.js";

export async function collectHotSpots(dir: string): Promise<void> {
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

  const commitsPerFile = getNumberOfChangesPerFile(commitsWithChangedFiles);
  const data = Object.keys(commitsPerFile).map((x) => {
    return [x, commitsPerFile[x]];
  });
  data.sort((a, b) => Number(b[1]) - Number(a[1]));
  const hotFiles = data.slice(0, 50);
  log("hot files (files with most changes)", hotFiles);
}
