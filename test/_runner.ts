type Test = { name: string; fn: () => Promise<any>; fail?: string };

type TestGroup = {
  name: string;
  describe: () => void | Promise<void>;
  tests: Test[];
};

const testGroups: TestGroup[] = [{ name: "", describe: () => {}, tests: [] }];

let currentGroup: TestGroup | undefined;

export function describe(name: string, describe: TestGroup["describe"]) {
  testGroups.push({ name, describe, tests: [] });
}

export function test(name: string, fn: Test["fn"]) {
  const group = currentGroup || testGroups[0];
  group.tests.push({ name, fn });
}

export function assert(condition: boolean | (() => boolean), message?: string) {
  if (typeof condition === "function") {
    if (!message) {
      message = condition.toString();
    }
    condition = condition();
  }
  if (!condition) {
    throw new Error(typeof message === "string" ? message : "Assertion failed");
  }
}

export async function run() {
  for (const group of testGroups) {
    currentGroup = group;
    await group.describe();
    currentGroup = undefined;
  }
  await Promise.all(
    testGroups.map(async (group) => {
      for (const test of group.tests) {
        test.fail = await test
          .fn()
          .then(() => undefined)
          .catch((error) => error.message || error);
        console.log(
          `${test.fail ? "\u001B[31m×\u001B[0m" : "\u001B[32m✓\u001B[0m"} \u001B[90m$${group.name}>\u001B[0m ${test.name}${test.fail ? `\u001B[31m (${test.fail})\u001B[0m` : ""}`,
        );
      }
    }),
  );

  return testGroups
    .filter((group) => group.tests.length)
    .map((group) => [
      group.name,
      group.tests.map((test) => [test.name, test.fail]),
    ]) as [groupName: string, [testName: string, fail: string][]][];
}
