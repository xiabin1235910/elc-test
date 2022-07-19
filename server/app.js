/**
 * The Server Can be configured and created here...
 * 
 * You can find the JSON Data file here in the Data module. Feel free to impliment a framework if needed.
 */

/*
-- This is the product data, you can view it in the file itself for more details 
{
    "_id": "019",
    "isActive": "false",
    "price": "23.00",
    "picture": "/img/products/N16501_430.png",
    "name": "Damage Reverse Thickening Conditioner",
    "about": "Dolor voluptate velit consequat duis. Aute ad officia fugiat esse anim exercitation voluptate excepteur pariatur sit culpa duis qui esse. Labore amet ad eu veniam nostrud minim labore aliquip est sint voluptate nostrud reprehenderit. Ipsum nostrud culpa consequat reprehenderit.",
    "tags": [
        "ojon",
        "conditioner"
    ]
}
*/
const data = require('./data');
const http = require('http');
const hostname = 'localhost';
const port = 3035;
const url = require('url');
const path = require('path');
const fs = require('fs');

// const keywordMap = new Map();

// data.forEach((item) => {
//     item.name.split(' ').forEach((key) => {
//         const value = keywordMap.get(key) || [];
//         value.push(item)
//         keywordMap.set(key, value)
//     })
// })

/** 
 * Start the Node Server Here...
 * 
 * The http.createServer() method creates a new server that listens at the specified port.  
 * The requestListener function (function (req, res)) is executed each time the server gets a request. 
 * The Request object 'req' represents the request to the server.
 * The ServerResponse object 'res' represents the writable stream back to the client.
 */
http.createServer(function (req, res) {
    // .. Here you can create your data response in a JSON format
    if (req.url.startsWith('/img')) {
        // parse URL
        const parsedUrl = url.parse(req.url);
        // extract URL path
        let pathname = `.${parsedUrl.pathname}`;
        // based on the URL path, extract the file extension. e.g. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // maps file extension to MIME typere
        const map = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword'
        };

        pathname = pathname.replace('img', 'app/images');

        fs.exists(pathname, function (exist) {
            if (!exist) {
                // if the file is not found, return 404
                res.statusCode = 404;
                res.end(`File ${pathname} not found!`);
                return;
            }

            // if is a directory search for index file matching the extension
            if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

            // read file from file system
            fs.readFile(pathname, function (err, data) {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    // if the file is found, set Content-type and send data
                    res.setHeader('Content-type', map[ext] || 'text/plain');
                    res.end(data);
                }
            });
        });

        return;
    }

    const queryObject = url.parse(req.url, true).query;
    const regex = new RegExp(queryObject.keyword, 'i')
    const result = data.filter((item) => {
        return regex.test(item.name) && item.isActive;
    })

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.write(JSON.stringify({ result })); // Write out the default response
    res.end(); //end the response
}).listen(port);


console.log(`[Server running on ${hostname}:${port}]`);
