import { cli, command } from "cleye";
import {GitRepository} from "codebase-stats-collector/dist/git-reader/git-repository.js";
import {getNumberOfContributorsPerFile} from "codebase-stats-collector/dist/stats/number-of-contributors-per-file.js";
import { Readable } from "stream";

export function log(arg1: string, arg2: object | string | null) {
  if (arg2 === null) {
    // eslint-disable-next-line no-console
    console.log(arg1);
    return;
  }
  // eslint-disable-next-line no-console
  console.log(arg1, arg2);
}

export class CommandLineInterface {  
  constructor() {}
  public run() {
    cli({
      commands: [
        command(
          {
            name: "knowledge-gaps",
            parameters: ["<path to repository>"],
            flags: {
              ignoreFiles: {
                type: String,
                description: "Which files to ignore in the output",
              },
            },
          },
          async (argv) => {
            const dir = argv._.pathToRepository;
            log(
              "Calculating files with least number of contributors",
                dir,
            );
            if (argv.flags.ignoreFiles) {
              // eslint-disable-next-line no-console
              console.log(
                "will ignore the following files in the output: ",
                argv.flags.ignoreFiles,
              );
            }

            // initialize repo
            const repo = new GitRepository(dir);
            const commitsStream = new Readable({
              objectMode: true,
              read() {
                // do nothing.
              },
            });
            const commitsWithChangedFiles = await repo.getListOfCommitsWithChangedFiles({
              stream: commitsStream,
            });
            const contributorsPerFile = getNumberOfContributorsPerFile(
                commitsWithChangedFiles
            ).filter((x) => x.isExistingFile);
            const topKnowledgeGaps = contributorsPerFile
                .sort((a, b) => {
                  if (a.contributorsNames.length === b.contributorsNames.length) {
                    return a.lastChange.getTime() - b.lastChange.getTime();
                  }
                  return a.contributorsNames.length - b.contributorsNames.length;
                })
                .slice(0, 50);

            log(
                "knowledge gaps (files with least number of contributors)",
                topKnowledgeGaps
            );
          },
        ),
      ],
    });
  }
}
