# iota-gpu-pow
POW node to do GPU POW for IOTA using ccurl

## Getting Started

This requires a new-ish version of NodeJS.  If you don't know how to use it, this script may not be for you.

Simple clone this repository then run "npm install" in the iota-gpu-pow directory.

## More Info
This is currently a proof-of-concept to see if I can get remote dedicated POW servers working in CarrIOTA Field.

I have included my own version of libccurl.so but I recommend you compile your own in your own environment (I can't guarantee it will work on your computer)

If you compile it with OpenCL installed it will use your GPU.

## Suggested Tweaks

You can change the max minimum weight magnitude to prevent abuse of your server with unreasonable POW requests

You can also change the port from default port 80

## Related Links

Field
https://github.com/SemkoDev/field.cli

CCurl (Includes compile instructions)
https://github.com/iotaledger/ccurl

CCurl Interface (Includes more compile tips)
https://github.com/iotaledger/ccurl.interface.js
