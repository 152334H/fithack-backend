// this just exists for testing right now!!!

import predict from './gpt.js'

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

process.stdout.write('> ')
rl.on('line', (line) => {
    predict(line).then(ls => {
        if (ls[0] === 0) {
            console.log("Got a help request")
        } else if (ls[0] === 1) {
            console.log(`User searched for a: "${ls[1]}"`)
        } else {
            console.error("Got bullshit:", ls)
        }
    }).then(() => process.stdout.write('> '))
});

rl.once('close', () => {
     // end of input
 });

