import { createRequire } from "node:module";
import { defineNitroConfig } from "nitropack/config";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { stringifyYAML } from "confbox";

const nitroPkg = createRequire(import.meta.url)("nitropack/package.json");

export default defineNitroConfig({
  compatibilityDate: "2024-10-21",
  srcDir: "./server",
  runtimeConfig: {
    nitroVersion: nitroPkg.version,
  },
  publicAssets: [
    {
      baseURL: "/_dist",
      dir: "./public/_dist",
      maxAge: 60 * 60 * 24 * 365,
    },
  ],
  // --- preset stuff ---
  serveStatic: true,
  hooks: {
    async compiled() {
      const outFile = resolve(".apphosting/bundle.yaml");
      await mkdir(dirname(outFile), { recursive: true });
      await writeFile(
        ".apphosting/bundle.yaml",
        stringifyYAML({
          version: "v1",
          runConfig: {
            runCommand: "node /.output/server/index.mjs",
          },
          metadata: {
            framework: "nitro",
            adapterVersion: "0.0.0",
            adapterPackageName: nitroPkg.name,
            frameworkVersion: nitroPkg.version,
          },
        } satisfies OutputBundleConfig),
      );
    },
  },
});

/// ---- Types stuff ----

// https://github.com/FirebaseExtended/firebase-framework-tools/blob/main/packages/%40apphosting/common/src/index.ts

export interface OutputBundleConfig {
  version: "v1";
  runConfig: RunConfig;
  metadata: Metadata;
}

// Fields needed to configure the App Hosting server
export interface RunConfig {
  // Command to start the server (e.g. "node dist/index.js"). Assume this command is run from the root dir of the workspace
  runCommand: string;
  // Environment variables set when the app is run
  environmentVariables?: EnvVarConfig[];
  // See https://firebase.google.com/docs/reference/apphosting/rest/v1beta/projects.locations.backends.builds#runconfig for documentation on the next fields
  // The maximum number of concurrent requests that each server instance can receive.
  concurrency?: number;
  // The number of CPUs used in a single server instance.
  cpu?: number;
  // The amount of memory available for a server instance.
  memoryMiB?: number;
  // The limit on the minimum number of function instances that may coexist at a given time.
  minInstances?: number;
  // The limit on the maximum number of function instances that may coexist at a given time.
  maxInstances?: number;
}

// Additonal fields needed for identifying the framework and adapter being used
export interface Metadata {
  // Name of the adapter (this should be the official package name) e.g. "@apphosting/adapter-nextjs"
  adapterPackageName: string;
  // Version of the adapter, e.g. "18.0.1"
  adapterVersion: string;
  // Name of the framework that is being supported, e.g. "angular"
  framework: string;
  // Version of the framework that is being supported, e.g. "18.0.1"
  frameworkVersion?: string;
}

// Represents a single environment variable.
export interface EnvVarConfig {
  // Name of the variable
  variable: string;
  // Value associated with the variable
  value: string;
  // Where the variable will be available, for now only RUNTIME is supported
  availability: Availability.Runtime[];
}

// Represents where environment variables are made available
export enum Availability {
  // Runtime environment variables are available on the server when the app is run
  Runtime = "RUNTIME",
}

// Options to configure the build of a framework application
export interface BuildOptions {
  // command to run build script (e.g. "npm", "nx", etc.)
  buildCommand: string;
  // list of arguments to pass to the build command
  // (e.g. ["--project=my-app", "--configuration=production"])
  buildArgs: string[];
  // path to the project targeted by the build command
  projectDirectory: string;
  // the name of the project to build
  projectName?: string;
}

export interface BuildResult {
  stdout?: string;
  stderr?: string;
}
