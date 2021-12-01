let start = 0;

let WebSocketClient = require('websocket').client;

let dates = [];

const openConnection = function (callback) {

    let client = new WebSocketClient();

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
        callback(error);
    });

    client.on('connect', function(connection) {
        console.log('WebSocket Client Connected');
        callback(null, connection);
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('echo-protocol Connection Closed');
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
            }
        });
        connection.on('ping', function (data) {
            console.log("PING");
            console.log(Buffer.from(data).toString());
            connection.pong('pong');
        });
        connection.on('pong', function(data) {
            let time = Date.now() - start;
            dates.push(time);
            console.log("PONG");
            console.log(Buffer.from(data).toString());
            console.log("TIME = " + time + " ms");
            console.log("AVG TIME = " + (Math.round(dates.reduce((a, b)=>a+b, 0)/dates.length)) + " ms");
        });
    });
    client.connect('wss://stream.binance.com/stream');
}

const main = function () {
    openConnection((err, connection)=>{
        if (err) console.error(err);
        else {
            setInterval(()=>{
                start = Date.now();
                connection.ping(JSON.stringify({
                    u: 42042042, s: "XXXYYY", b: 0, a: 0, B: 0, A: 0,
                }));
            }, 1000);
        }
    });
    setTimeout(()=>{

    }, 60000)
}

main();

