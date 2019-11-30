import getPort from "get-port";
const chalk = require("chalk");

/**
 * porting the normalizeOptions function in parcel core over to here
 * InitialParcelOptions is found in
 * https://github.com/parcel-bundler/parcel/blob/23ba2cc54f3286f60e2cab63eb358660c916139d/packages/core/types/index.js
 *
 */
// export async function normalizeOptions(NormOpts): Promise<InitialParcelOptions> {

export type ServerOptions = {
  host?: string;
  port: number;
  https?: HTTPSOptions | boolean;
  publicUrl?: string;
};
type HTTPSOptions = { cert: string; key: string };
type HMROptions = {
  hmr?: boolean;
  port?: number;
  host?: string;
  https?: string;
};
type NormOpts = {
  isProd?: boolean;
  /**
   * if HTTPS needed, must specify cert and key
   */
  https?: HTTPSOptions;
  cert?: string;
  key?: string;
  /**
   * if serve mode, must have host and publicUrl?
   */
  isServe?: boolean;
  port?: number;
  host?: string;
  publicUrl?: string;
  /**
   * if hmr needed
   */
  hmr?: boolean;
  hmrPort?: number;
  hmrHost?: string;
  /**
   * misc
   */
  cache?: boolean;
  cacheDir?: string;
  minify?: boolean;
  sourceMaps?: boolean;
  scopeHoist?: boolean;
  autoinstall?: boolean;
  logLevel?: "none" | "error" | "warn" | "info" | "verbose";
  profile?: boolean;
  target?: any; // https://github.com/parcel-bundler/parcel/blob/23ba2cc54f3286f60e2cab63eb358660c916139d/packages/core/types/index.js#L163
};
export async function normalizeOptions(opts: NormOpts) {
  if (opts.isProd === true) {
    process.env.NODE_ENV = process.env.NODE_ENV || "production";
  } else {
    process.env.NODE_ENV = process.env.NODE_ENV || "development";
  }

  // let https = !!opts.https as HTTPSOptions | false; // also used as string | undefined in the hmr section! bug?
  let https = !!opts.https as any;
  if (opts.cert && opts.key) {
    https = {
      cert: opts.cert,
      key: opts.key
    };
  }

  let serve = false as ServerOptions | false;
  if (opts.isServe) {
    let { port = 1234, host, publicUrl } = opts;
    port = await getPort({ port, host });

    if (opts.port && port !== opts.port) {
      // Parcel logger is not set up at this point, so just use native console.
      console.warn(
        chalk.bold.yellowBright(`⚠️  Port ${opts.port} could not be used.`)
      );
    }
    serve = {
      https,
      port,
      host,
      publicUrl
    };
  }

  let hmr = false as HMROptions | false;
  if (opts.isServe && opts.hmr !== false) {
    let port = opts.hmrPort || 12345;
    let host = opts.hmrHost || opts.host;
    port = await getPort({ port, host });

    process.env.HMR_HOSTNAME = host || "";
    process.env.HMR_PORT = String(port);

    hmr = {
      https,
      port,
      host
    };
  }

  let mode = opts.isProd ? "production" : "development";
  return {
    disableCache: opts.cache === false,
    cacheDir: opts.cacheDir,
    mode,
    minify: opts.minify != null ? opts.minify : mode === "production",
    sourceMaps: opts.sourceMaps ?? true,
    scopeHoist: opts.scopeHoist,
    hot: hmr,
    serve,
    targets: opts.target?.length > 0 ? opts.target : null,
    autoinstall: opts.autoinstall ?? true,
    logLevel: opts.logLevel,
    profile: opts.profile
  };
}
