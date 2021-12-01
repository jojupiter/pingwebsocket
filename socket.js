const {WebSocket} = require('ws');

let start = 0;

let dates = [];

const openConnection = function (callback) {
    let ws = new WebSocket('wss://stream.binance.com/stream');

    ws.on('open', function open() {
        ws.send(JSON.stringify({method: 'SUBSCRIBE', params: ['!bookTicker'], id: 1}));
        callback(null, ws);
    });

    ws.on('error', function (err) {
        callback(err);
    });

    ws.on('ping', function (data) {
        console.log("PING");
        console.log(Buffer.from(data).toString());
        ws.pong('pong');
    });

    ws.on('pong', function(data) {
        let time = Date.now() - start;
        dates.push(time);
        console.log("PONG");
        console.log(Buffer.from(data).toString());
        console.log("TIME = " + time + " ms");
        console.log("AVG TIME = " + (Math.round(dates.reduce((a, b)=>a+b, 0)/dates.length)) + " ms");
    });

    return ws;
}

const main = function () {
    openConnection((err, ws)=>{
        if (err) console.error(err);
        else {
            setInterval(()=>{
                start = Date.now();
                ws.ping(JSON.stringify({
                    u: 42042042, s: "XXXYYY", b: 0, a: 0, B: 0, A: 0,
                }));
            }, 1000);
        }
    });
}

main();

