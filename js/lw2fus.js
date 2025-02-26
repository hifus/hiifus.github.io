"use strict";
var abi = [
    {
        "constant": false,
        "inputs": [],
        "name": "register",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "shouldRegister",
        "outputs": [
            {
                "name": "",
                "type": "int256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

function onRegisterButtonSubmit() {
    properties.Contract.register(makeTxnCallback(function () {
        $('#register').hide();
        $('#message').text('登记成功！').show();
    }));
}

$(start(function (account) {
    var msg = $('#message').hide(), btn = $('#register');
    properties.Contract = web3.eth.contract(abi).at(contractAddresses.LastWinner2Fus2);

    return Promise.all([
        Promise.promisify(properties.Contract.shouldRegister),
        Promise.promisify(properties.Contract.register),
    ]).then(function (_promisfied) {
        // store promisified functions
        blockchain.shouldRegister = _promisfied[0];
        blockchain.register = _promisfied[1];

        // hook dom interaction event listeners
        return Promise.all([
            btn.on('click', onRegisterButtonSubmit),
        ]);
    }).then(function () {
        return blockchain.shouldRegister();
    }).then(function (p) {
        $('#loadingSpinner').hide();
        p = p.toNumber();
        if (p !== 0) {
            btn.hide();
            msg.text((p > 0) ? '您已经登记了！' : '您不是旧LW2的玩家！').show();
        }
    });
}));
