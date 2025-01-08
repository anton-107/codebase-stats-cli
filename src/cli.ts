import { cli, command } from "cleye";

import { collectKnowledgeGaps } from "./commands/knowledge-gaps.js";
import { log } from "./console.js";

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
            log("Calculating files with least number of contributors", dir);
            let ignoreFilesPattern: string | null = null;
            if (argv.flags.ignoreFiles) {
              // eslint-disable-next-line no-console
              console.log(
                "will ignore the following files in the output: ",
                argv.flags.ignoreFiles,
              );
              ignoreFilesPattern = argv.flags.ignoreFiles;
            }
            await collectKnowledgeGaps(dir, ignoreFilesPattern);
          },
        ),
      ],
    });
  }
}
