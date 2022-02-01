const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// const { isMainThread } = require('worker_threads');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;

const INICIAL_STRING = 'Hi there!';

beforeEach(async ()=>{
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    

    // Use one of this accounts to deploy the contract
    inbox = await new web3.eth.Contract(abi)  // Teaches web3 about what methods an Inbox contract has
        .deploy({
            data:evm.bytecode.object, 
            arguments: [INICIAL_STRING] 
        })      // tells web3 that we want to deploy a new copy of this contract
        .send({from: accounts[0], gas: '1000000'});             // Instruct web3 to send a transaccion that creates this contract
})

describe('Inbox', () => {
    it('deploy a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, INICIAL_STRING);
    });

    it('can change the message', async() => {
        const hash = await inbox.methods.setMessage('bye').send({
            from: accounts[0], 
            gas: '1000000'
        });

        const message = await inbox.methods.message().call();

        assert.strictEqual('bye', message);

        // console.log(hash.transactionHash);
    });
});
