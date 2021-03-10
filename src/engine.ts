import * as child from "child_process";
import fs from "fs";
import path from "path";

export function promiseFromChildProcess(child: child.ChildProcess) {
  return new Promise(function (resolve, reject) {
    child.addListener("error", reject);
    child.addListener("exit", resolve);
  });
}

export async function read_directory(dir: string, ext: string) {
  //Todo: switch to using jq
  //cat *.json | jq -s 'flatten' > merge.json
  let combined = fs
    .readdirSync(dir)
    .filter((file) => path.extname(file).toLowerCase() === ext)
    .reduce((combined, file) => {
      const filePath = path.join(dir, file);
      let content = require(filePath);
      combined = [...combined, content];
      return combined;
    }, new Array());
  return combined;
}
