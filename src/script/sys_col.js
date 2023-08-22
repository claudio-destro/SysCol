#!/usr/bin/env node

const {TestScript} = require("./TestScript");

const file = process.argv[2];
if (!file) {
  console.error("Must specify a test script file");
  process.exit(1);
}

(async () => {
  const script = await TestScript.fromFile(file);
  await script.executeScript();
})();
