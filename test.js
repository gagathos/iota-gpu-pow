"use strict"

const request = require('request')
const IOTA = require('iota.lib.js')	
const iota = new IOTA({host : 'https://field.carriota.com', port : 443}) // TODO make regular node address a program argument
const pow = new IOTA({host : 'http://localhost', port: 80}) // TODO make port a program argument
const seed = "LKAJDFLKAJDFLKAJDFLKASJDFLAKDJFLAKDJFLAKDJFALSKDFJALSKSDFJASLKDFJASLKDFJASLK" // this doesn't actually mean anything but preparetransfers needs it I guess

	iota.api.getTransactionsToApprove(5, null, function(error, toApprove){
		let trunk = toApprove.trunkTransaction
		let branch = toApprove.branchTransaction
		var payload = {test: "This is a transaction test using the POW on your server.", link: "https://github.com/gagathos/iota-gpu-pow"};
		//Let's do two transfers to make sure our code can handle bundles (for reattaching for instance)
		var transfer = [{
			'address': 'VAWBVFRYOVSRKIRTHOUZQEWDZOIUWVUAGSLDNZDFNVRBMMSWZXUOMKRZRJLODNXOXQNM9WEWAEHRCVLSXPG9JZGDND', 
			'value': 0,
			'message': iota.utils.toTrytes(JSON.stringify(payload)),
			'tag' : 'REMOTEPOWTEST'
		},
		{
			'address': 'VAWBVFRYOVSRKIRTHOUZQEWDZOIUWVUAGSLDNZDFNVRBMMSWZXUOMKRZRJLODNXOXQNM9WEWAEHRCVLSXPG9JZGDND',
			'value': 0,
			'message': iota.utils.toTrytes(JSON.stringify(payload)),
			'tag' : 'REMOTEPOWTEST'
		}];

		iota.api.prepareTransfers(seed, transfer, function(error, trytes){
			pow.api.attachToTangle(trunk, branch, 14, trytes, function(error, success){
				if(error) console.log(error)
				if(success){
					var attached = iota.utils.transactionObject(success[0]);
					iota.api.broadcastTransactions(success, (function(attached){ return function(error, success){
						if(success){
							console.log('POW successful and valid ' + attached.hash);
						}								
					}})(attached));
				}
			});

		});
	});