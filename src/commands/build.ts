import { Command, flags } from "@oclif/command";
// const copy = require("copy-template-dir");
// const path = require("path");
const { BuildError } = require("@parcel/core");
const { NodePackageManager } = require("@parcel/package-manager");
const { NodeFS } = require("@parcel/fs");

export default class Build extends Command {
  static description = "describe the command here";

  static examples = [`$ rincewind build # production build of a rincewind app`];

  static flags = {
    help: flags.help({ char: "h" }),
    // dir: flags.string({
    //   char: "d",
    //   description: "directory to create",
    //   default: process.cwd()
    // })
    // // flag with no value (-f, --force)
    "no-minify": flags.boolean({ default: false }),
    "no-scope-hoisting": flags.boolean({ default: false })
  };

  static args = [{ name: "file" }];

  async run() {
    const {
      args
      // flags
    } = this.parse(Build);
    // const createDir = flags.dir;

    let Parcel = require("@parcel/core").default;
    let packageManager = new NodePackageManager(new NodeFS());
    let defaultConfig = await packageManager.require(
      "@parcel/config-default",
      __filename
    );
    let parcel = new Parcel({
      entries: args,
      packageManager,
      defaultConfig: {
        ...defaultConfig,
        filePath: (
          await packageManager.resolve("@parcel/config-default", __filename)
        ).resolved
      },
      patchConsole: false
      // ...(await normalizeOptions(command))
    });

    try {
      await parcel.run();
    } catch (e) {
      // If an exception is thrown during Parcel.build, it is given to reporters in a
      // buildFailure event, and has been shown to the user.
      if (!(e instanceof BuildError)) console.error(e);
      process.exit(1);
    }
  }
}
