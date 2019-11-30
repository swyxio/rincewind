import { Command, flags } from "@oclif/command";
const copy = require("copy-template-dir");
const path = require("path");
const fs = require("fs");

function findDefaultDir() {
  const basedir = path.join(process.cwd(), "rincewind-app");
  let dir = basedir;
  let idx = 0;
  while (fs.existsSync(dir)) {
    idx += 1;
    dir = basedir + "_" + idx;
  }
  return dir;
}
export default class Create extends Command {
  static description = "describe the command here";

  static examples = [`$ rw create # creates a rincewind app`];

  static flags = {
    help: flags.help({ char: "h" }),
    dir: flags.string({
      char: "d",
      description: "directory to create",
      default: findDefaultDir()
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
