const ws = require('nodejs-websocket')

ws.createServer((conn) => {
    conn.on('text', (str) => {
        console.log(str)
        conn.sendText('收到信息')
    })
}).listen('8080', ()=>{
    console.log('服务器启动，端口号：8080')
})