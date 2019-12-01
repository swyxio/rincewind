import { Command, flags } from "@oclif/command";
const copy = require("copy-template-dir");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const yarnOrNpm = require("yarn-or-npm");
const spawn = yarnOrNpm.spawn;
const ghUserName = require("git-user-name");
const createLogger = require("progress-estimator");
const envPaths = require("env-paths");
// All configuration keys are optional, but it's recommended to specify a storage location.
// Learn more about configuration options below.
const logger = initProgressEstimator();

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
    const { args, flags } = this.parse(Create);
    const createDir = args.file || flags.dir;
    const vars = {
      githubUsername: ghUserName() || "TODO_WRITE_THIS",
      currentYear: new Date().toISOString().slice(0, 4)
    };
    const inDir = path.join(__dirname, "../templates/basic");
    const prettifycreateDir = path.relative(process.cwd(), createDir);
    copy(inDir, createDir, vars, async () => {
      this.log(`Scaffolded app to ${chalk.cyan(prettifycreateDir)}`);
      // renameGitIgnoreFile(createDir);
      process.chdir(prettifycreateDir);

      await logger(
        new Promise((yay, nay) => {
          const childproc = spawn(["install"], {
            stdio: ["ignore", "ignore", "inherit"]
          });
          childproc.on("exit", function(code: number /*signal*/) {
            if (code > 0) {
              // not good
              console.error("something bad happened!"); // todo: think about how to handle this
              nay();
            } else {
              yay();
            }
          });
        }),
        "Installing dependencies...",
        {
          estimate: 40000
        }
      );
      this.log(`Scaffolding Done!`);
      this.log(`Please run: `);
      this.log(`    ${chalk.cyan(`cd ${prettifycreateDir}`)}`);
      this.log(`    ${chalk.cyan(`${yarnOrNpm()} start`)}`);
    });
  }
}

/**
 *
 * utils
 *
 */

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

function initProgressEstimator() {
  if (!fs.existsSync(envPaths("rincewind").cache))
    fs.mkdirSync(envPaths("rincewind").cache);
  const storagePath = path.join(
    envPaths("rincewind").cache,
    ".progress-estimator"
  );
  return createLogger({ storagePath });
}
