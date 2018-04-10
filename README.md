# iota-gpu-pow
POW node to do GPU POW for IOTA using ccurl

## Getting Started

This requires a new-ish version of NodeJS.  If you don't know how to use it, this script may not be for you.

Simple clone this repository then run "npm install" in the iota-gpu-pow directory.

## IOTA API

In addition to using this as a POW-only field node, you can also use this to perform POW using the standard IOTA APIs. It can not perform other API calls, just attachToTangle. 

In Javascript, for instance (using iota.lib.js)

```
const IOTA = require('iota.lib.js')
const iota = new IOTA({host : 'https://field.carriota.com', port : 443}) // this is the normal iota api instance
const pow = new IOTA({host : 'http://localhost', port: 80}) //this is the POW only iota api instance
```
..... (use iota.api.* functions as normal)
```
pow.api.attachToTangle(trunk, branch, 14, trytes, callback)
```

There is a crude version of this in test.js of this repository.

## More Info
This is currently a proof-of-concept to see if I can get remote dedicated POW servers working in CarrIOTA Field.

I have included my own version of libccurl.so but I recommend you compile your own in your own environment (I can't guarantee it will work on your computer)

If you compile it with OpenCL installed it will use your GPU.

If you access the remote POW from a browser (a GET request) it will print some basic statistics in JSON format.

## Suggested Tweaks

You can change the max minimum weight magnitude to prevent abuse of your server with unreasonable POW requests

You can also change the port from default port 80

**Note that dcurl currently doesn't use GPU on the ccurl interface, but in our testing even just using CPU gives us a performance boost**

[dcurl](https://github.com/chenwei-tw/dcurl) can also generate a drop-in replacement for libccurl.so and get you a significant performance boost.  Note that you will have to overwrite libccurl.so or create a symlink to libdcurl.so.  You may have to compile it using the `BUILD_COMPAT ?= 1` setting.

## Related Links

Field
https://github.com/SemkoDev/field.cli

CCurl (Includes compile instructions)
https://github.com/iotaledger/ccurl

CCurl Interface (Includes more compile tips)
https://github.com/iotaledger/ccurl.interface.js
