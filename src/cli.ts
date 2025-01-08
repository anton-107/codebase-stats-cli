import { cli, command } from "cleye";

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
            const repo = argv._.pathToRepository;
            // eslint-disable-next-line no-console
            console.log(
              "Calculating files with least number of contributors",
              repo,
            );
            if (argv.flags.ignoreFiles) {
              // eslint-disable-next-line no-console
              console.log(
                "will ignore the following files in the output: ",
                argv.flags.ignoreFiles,
              );
            }
          },
        ),
      ],
    });
  }
}
