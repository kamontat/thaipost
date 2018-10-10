import { Command, flags } from "@oclif/command";
import { Tracking } from "../lib/apis";
import chalk from "chalk";

class Thaipost extends Command {
  static description = "Tracking Thailand Post";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    json: flags.boolean({ char: "J", description: "Show as JSON format string" })
  };

  static args = [{ name: "trackID" }];

  async run() {
    const { args, flags } = this.parse(Thaipost);
    try {
      const result = await Tracking(args.trackID);
      if (flags.json) {
        this.log(JSON.stringify(result, undefined, " "));
      } else {
        this.log(chalk.red.underline.bold(`ID: ${args.trackID}`));
        result.forEach(v => {
          this.log(
            `${chalk.green(v.date).padEnd(30)} ${chalk.greenBright(
              `${v.time.start} - ${v.time.end}`
            )} ${chalk.blueBright.italic(v.location).padEnd(35)} ${chalk.redBright(v.description)} ${v.result}`
          );
        });
      }
    } catch (e) {
      this.error(e.message);
    }
  }
}

export = Thaipost;
