"use strict"

const IOTA = require('iota.lib.js')
const ccurl = require('ccurl.interface.js')
const express = require('express')
const body = require('body-parser')
const program = require('commander')

program
  .version('1.0.0')
  .option('-m, --max-mwm [mwm]', 'Max Minimum Weight Magnitude', 15)
  .option('-p, --port [port]', 'Port to host the server on', 80)
  .option('-c, --ccurl [ccurlLocation]', 'Directory of libccurl.so', '.')
  .parse(process.argv)

const iota = new IOTA()

const powServer = express()
powServer.use(body.json())
powServer.use(body.urlencoded({extended:true}))

var totalrequests = 0
var averagetime = 0

const postHandler = (req, res) => {
	// Set custom headers for CORS
	res.header("Access-Control-Allow-Origin", req.headers.origin) // restrict it to the required domain
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header,X-IOTA-API-Version")
    
    switch(req.body.command){
    case 'getNodeInfo':
    	res.send({
          appName: 'gagathos/iota-gpu-pow',
          appVersion: "1.0.0",
          duration: 1
        })
    break
    case 'getNeighbors':
    	res.send({neighbors: []})
    break
    case 'attachToTangle':
    	nodeAPI(req, res)
    break
    }
}

function nodeAPI(req, res){
	let startTime = Date.now()
	let fields = req.body
	if(fields.minWeightMagnitude > program.maxMwm){
		res.send({error: "Mwm of " + fields.minWeightMagnitude + " is over max of " + program.maxMwm})
	} else {
		//ccurl doesn't update attachment timestamp. Let's do it ourselves.
		let trytes = updateTimestamp(fields.trytes)
		ccurl(fields.trunkTransaction, fields.branchTransaction, fields.minWeightMagnitude, trytes, program.ccurl, (error, success) => {
			if(error) console.log(error)
			res.send({trytes : success}) //emulate node output
			totalrequests += success.length 
			averagetime = Math.floor(((totalrequests - success.length) * averagetime + (Date.now() - startTime)) / totalrequests)
		})
	}
	
}

function updateTimestamp(trytes){
	//trytes should be an array, let's go through it and build a new one
	let updatedTrytes = []
	for(var i = 0; i < trytes.length; i++){
		let txn = iota.utils.transactionObject(trytes[i]) //open the object from the raw trytes
		txn.attachmentTimestamp = Date.now() //set the timestamp
		updatedTrytes.push(iota.utils.transactionTrytes(txn)) // put it back in trytes format and attach it to the new array
	}
	return updatedTrytes
}




function infoPage(req, res){
	res.send({total: totalrequests, averagetime: averagetime + 'ms'})
}

const server = powServer.get('*', infoPage).post('*', postHandler)
server.listen(program.port)
