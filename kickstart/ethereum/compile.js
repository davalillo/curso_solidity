const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

//Delete entire 'build' folder
fs.removeSync(buildPath);


// Read 'Campaign.sol' from de 'contracts' folder
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// Compile both contrafcts with solidity compiler
const output = solc.compile(source, 1).contracts;

// Write output to de 'build' folder
fs.ensureDirSync(buildPath);

console.log(output)
for( let contract in output) {
    //console.log(contract+'.json')
    fs.outputJsonSync(       
        path.resolve(buildPath, contract.replace(':', '') +'.json'),
        output[contract]
    );
}