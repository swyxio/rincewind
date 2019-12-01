import { Command, flags } from "@oclif/command";
const { NodePackageManager } = require("@parcel/package-manager");
const { NodeFS } = require("@parcel/fs");
// const chalk = require("chalk");
import { normalizeOptions } from "../normalizeOptions";

export default class Serve extends Command {
  static description = "describe the command here";

  static examples = [`$ rincewind build # production build of a rincewind app`];
  static aliases = ["develop", "dev"];

  static flags = {
    help: flags.help({ char: "h" }),
    "no-minify": flags.boolean({ default: false }),
    "no-scope-hoisting": flags.boolean({ default: false })
  };

  static args = [{ name: "file" }]; // todo: support multiple entries

  async run() {
    const { args, flags } = this.parse(Serve);

    let Parcel = require("@parcel/core").default;
    let packageManager = new NodePackageManager(new NodeFS());
    let defaultConfig = await packageManager.require(
      "@parcel/config-default",
      __filename
    );
    let parcel = new Parcel({
      entries: args.file,
      packageManager,
      defaultConfig: {
        ...defaultConfig,
        filePath: (
          await packageManager.resolve("@parcel/config-default", __filename)
        ).resolved
      },
      patchConsole: false,
      ...(await normalizeOptions({
        isServe: true
        // // idk how this works!
        // hmr: true,
        // hmrPort: 1234,
        // hmrHost: "localhost"
      })) // todo: see what is in there we need
    });

    let { unsubscribe } = await parcel.watch((err: Error) => {
      if (err) {
        throw err;
      }
    });

    let isExiting: boolean;
    const exit = async () => {
      if (isExiting) return;
      isExiting = true;
      await unsubscribe();
      process.exit();
    };

    // Detect the ctrl+c key, and gracefully exit after writing the asset graph to the cache.
    // This is mostly for tools that wrap Parcel as a child process like yarn and npm.
    //
    // Setting raw mode prevents SIGINT from being sent in response to ctrl-c:
    // https://nodejs.org/api/tty.html#tty_readstream_setrawmode_mode
    //
    // We don't use the SIGINT event for this because when run inside yarn, the parent
    // yarn process ends before Parcel and it appears that Parcel has ended while it may still
    // be cleaning up. Handling events from stdin prevents this impression.
    if (process.stdin.isTTY) {
      process.stdin.setRawMode && process.stdin.setRawMode(true);
      require("readline").emitKeypressEvents(process.stdin);

      process.stdin.on("keypress", async (char, key) => {
        if (key.ctrl && key.name === "c") {
          await exit();
        }
      });
    }

    // In non-tty cases, respond to SIGINT by cleaning up.
    process.on("SIGINT", exit);
    process.on("SIGTERM", exit);
  }
}
