#!/usr/bin/env node
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
let main_cmd = "gcc";
let args = process.argv.slice(2);
if (args[0] === "-c" || args[0] === "--command") {
    main_cmd = args[1];
    args = args.slice(2);
}
const path_to_watch = args[0];
let flags = null;
if (args.length > 1) flags = args.slice(1, args.length).join(' ');
if (!path_to_watch) {
  console.log("\x1b[0;33mUsage: cwatch.js <filename>\x1b[0m");
  return;
}
let [file_no_extension, extension] = path_to_watch.split("/").pop().split(".");

const file = path.resolve(path_to_watch);

let cmd = createCmd(main_cmd);
console.log(cmd)
console.log(`\x1b[0;32mWatching ${path_to_watch}...\x1b[0m`);

let compileTimeout;

let watcher = fs.watch(file, onFileChange);

function compile(cmd) {

  exec(cmd, (err, stdout, stderr) => {
    if (!err)
      console.log(
        `\x1b[0;96m${file_no_extension}.${extension} compiled successfully! stdout:\x1b[0m\n${stdout}`
      );
    else console.error(`\x1b[0;31mCannot compile: ${err.message}\x1b[0m`);
  });
}

function createCmd(main_cmd) {
  return main_cmd !== "gcc" 
    ? `${main_cmd} ${flags ? flags : ''}`
    : `gcc -o ${file_no_extension}.o ${file} ${flags ? flags : ''}`;
}

function onFileChange(eventType, filename) {
  clearTimeout(compileTimeout);
  compileTimeout = setTimeout(() => {
  // Bull alert: some text editors emit rename event without changing name on save.
  // Then, we need to stop watching the old, nonexistent file :)
  if (eventType === "rename") {
    watcher.close() //the file doesn't exist anymore;
    watcher = fs.watch(file, onFileChange);
    cmd = createCmd(main_cmd);
  }
  if ((eventType === "change" || eventType === "rename") && filename === `${file_no_extension}.${extension}`) {
      compile(cmd);
    } 
  }, 100); // debounce

}
