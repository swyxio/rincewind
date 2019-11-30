import { Command, flags } from "@oclif/command";
const copy = require("copy-template-dir");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const yarnOrNpm = require("yarn-or-npm");
const spawn = yarnOrNpm.spawn;

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
    const prettifycreateDir = path.relative(process.cwd(), createDir);
    copy(inDir, createDir, vars, () => {
      console.log(`Scaffolded app to ${chalk.cyan(prettifycreateDir)}`);
      renameGitIgnoreFile(createDir);
      process.chdir(prettifycreateDir);
      const childproc = spawn(["install"], { stdio: "inherit" });
      childproc.on("exit", function(code: number /*signal*/) {
        if (code > 0) {
          // not good
          console.error("something bad happend!"); // todo: try this
        } else {
          console.log(`Scaffolding Done!`);
          console.log(`Please run: `);
          console.log(`    ${chalk.cyan(`cd ${prettifycreateDir}`)}`);
          console.log(`    ${chalk.cyan(`${yarnOrNpm()} start`)}`);
        }
      });
    });
  }
}

function renameGitIgnoreFile(createDir: string) {
  const fromPath = path.resolve(path.join(createDir, "gitignore"));
  const toPath = path.resolve(path.join(createDir, ".gitignore"));
  fs.renameSync(fromPath, toPath);
}
