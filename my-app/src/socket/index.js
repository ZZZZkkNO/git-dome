import io from "socket.io-client";

const socket = io()

socket.on('connect', () =>{
    console.log('服务器连接已建立')
})

// socket.on('change', () =>{
//     console.log('收到改变消息')
// })

export default socket