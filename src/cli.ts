import { cli, command } from "cleye";

export class CommandLineInterface {
    constructor() {}
    public run() {
        cli({
            commands: [
                command(
                    {
                        name: "knowledge-gaps",
                        parameters: ["[prompt]"],
                    },
                    async () => {
                        console.log("Calculating files with least number of contributors");
                    },
                ),
            ],
        });
    }
}