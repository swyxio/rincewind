import { Command, flags } from "@oclif/command";
const copy = require("copy-template-dir");
const path = require("path");

export default class Create extends Command {
  static description = "describe the command here";

  static examples = [`$ rw create # creates a rincewind app`];

  static flags = {
    help: flags.help({ char: "h" }),
    dir: flags.string({
      char: "d",
      description: "directory to create",
      default: process.cwd()
    })
    // // flag with no value (-f, --force)
    // force: flags.boolean({ char: "f" })
  };

  static args = [{ name: "file" }];

  async run() {
    const {
      // args,
      flags
    } = this.parse(Create);
    const createDir = flags.dir;
    const vars = { foo: "bar" };
    const inDir = path.join(__dirname, "../templates/basic");
    const outDir = createDir;
    const { promisify } = require("util");
    await promisify(copy(inDir, outDir, vars))
      .then(() => console.log("done"))
      .catch((err: any) => {
        throw err;
      });
  }
}
