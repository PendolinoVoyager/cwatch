#!/usr/bin/env node
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const path_to_watch = args[0];
let flags = null;
if (args.length > 1) flags = args.slice(1, args.length).join(' ');

if (!path_to_watch) {
  console.log("\x1b[0;33mUsage: cwatch.js <filename>\x1b[0m");
  return;
}
const [file_no_extension, extension] = path_to_watch.split("/").pop().split(".");

const file = path.resolve(path_to_watch);


console.log(`\x1b[0;32mWatching ${path_to_watch}...\x1b[0m`);

let compileTimeout;

fs.watch(file, (eventType, filename) => {
  if (eventType === "change" && filename === `${file_no_extension}.${extension}`) {
    clearTimeout(compileTimeout);
    compileTimeout = setTimeout(() => {
      compile(path_to_watch);
    }, 100); // debounce
  } else if (eventType === "rename") {
    console.log(`\x1b[0;31mFile ${filename} has been deleted\x1b[0m`);
    process.exit();
  }
});

function compile(file) {
  exec(`gcc -o ${file_no_extension}.o ${file} ${flags ? flags : ''}`, (err, stdout, stderr) => {
    if (!err)
      console.log(
        `\x1b[0;96m${file_no_extension}.${extension} compiled successfully\x1b[0m`
      );
    else console.error(`\x1b[0;31mCannot compile: ${err.message}\x1b[0m`);
  });
}
