# TTApi
Simple Transaction APIs

## The Goal
A simple HAPI & NODE for managing a bunch of trading operations in a high performance yet very simple node style way

## Core Stack

- **Node.js** - [http://nodejs.org/](http://nodejs.org/)
- **Hapi** - [http://hapijs.com/](http://hapijs.com/)

## Quick Start

Clone project and install dependencies:
```bash
$ git clone https://github.com/rjmreis/hapi-api.git
$ cd hapi-api
$ npm install
```

Start the server:
```bash
$ npm start -s
```

Run tests:
```bash
$ npm test
```

## Project Structure
```
.
├── api/
|   ├── handlers/
|   |   └── home.js   * Sample handler
|   └── index.js      * REST routes
├── config/
|   ├── manifest.js   * Server configuration
|   └── secret.js     * Secret key
├── test/
|   └── api.js        * API test
├── server.js         * Server definition (uses the Glue plugin to read a manifest)
├── auth.js           * Auth strategies
└── package.json
```


## Performance Tests and Big O
Since the strategy has to pre-calculate and aggregate the sum,avg,min,max,coung every time a transaction arrives for each
seconds. At the end the scheduler that runs every second to remove the old seconds (older than 60) from the history
will cycle at maximum 60 times a second.
The statistics API will have a "ready to consume" object in memory to serve O(1). 
In the graph the number of transactions per second increase and the response time remains constant O(1)
[[https://github.com/wildspecial/TTApi/blob/master/perftests/RequestPerSec_vs_ResponseTime.jpg|alt=performance test]]

## License
The MIT License (MIT)

Copyright (c) 2017 Francesco Pistillo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.