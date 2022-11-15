'use strict';

const gateway = require('fast-gateway');
// const userAuthentication = require('./middleware/userAuthentication');
const port = 8000;

const server = gateway({
    routes: [{
        prefix: '/users',
        target: 'http://127.0.0.1:9001/',
    }, {
        prefix: '/module2',
        target: 'http://127.0.0.1:9002/',
    },]
});

// Server gateway running for /.
server.get('/', (req, res) => res.send('API-Gateway is running'));

server.start(port).then(server => {
    console.log(`API Gateway is running on port ${port} at http://localhost:${port}/`);
});