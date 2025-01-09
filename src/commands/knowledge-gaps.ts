import { SummaryDashboard } from "codebase-stats-collector/dist/dashboard/summary-dashboard.js";
import { GitRepository } from "codebase-stats-collector/dist/git-reader/git-repository.js";
import { getNumberOfContributorsPerFile } from "codebase-stats-collector/dist/stats/number-of-contributors-per-file.js";

import { log } from "../console.js";
import { setupProgressStream } from "../dashboard/progress.js";

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
