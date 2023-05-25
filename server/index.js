const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const fs = require('fs')
const http = require('http')
const socketIO = require('socket.io')
const debounce = require('./util/debounce')
const iconv = require('iconv-lite')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secretKey = `${process.env.TOKENSECRETKEY}`


const server = http.createServer(app)


//连接mysql数据库
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})


app.use(cors({
    origin: '*'
}))

//请求格式处理中间件
app.use(bodyParser.urlencoded({extended: false}))


app.use(bodyParser.json())

const io = socketIO(server,{
    cors: {
        origin: '*',
    }
})
io.on('connect', function(socket){
    console.log('成功连接')
    fs.watch('C:/ProgramData/MySQL/MySQL Server 8.0/Data/zyk_db_01/stop_users.ibd',(event, filename) => {
        if(event === 'change'){
            debounce(io.emit('change', '数据库内容变化请更新'), 500)
        }
    })
})

const plateNumberRegex = /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]([ABCDEFGHJKLMNPQRSTUVWXYZ]{1}|[ABCDEFGHJKLMNPQRSTUVWXYZ\d]{2})\.([\da-zA-Z]{5}|[\da-zA-Z]{4}挂)/g
fs.watchFile(`${process.env.TERATERM}`, {interval: 1000} , (curr, prev) =>{
    let newContent = fs.readFileSync(`${process.env.TERATERM}`)
    newContent = iconv.decode(newContent, 'CP936')
    const plateNumbers = newContent.match(plateNumberRegex)
    if(plateNumbers === null) return 
    const nowDate = new Date().toISOString().slice(0, 19).replace('T', ' ')
    for(let plateNumber of plateNumbers){
        plateNumber = plateNumber.replace('.', ' ')
        pool.query('SELECT * FROM stop_cars WHERE carid = ?', [plateNumber], (err, result) => {
            if(err){
                throw(err)
            }else{
                if(result.length == 0){
                    pool.query('INSERT INTO stop_cars (startdate, carid) VALUES (?, ?)', [nowDate, plateNumber], (err, result) => {
                        if(err){
                            throw(err)
                        }else{
                            console.log('车牌写入数据库成功')
                            debounce(io.emit('parkingChange', '数据库内容变化请更新'), 500)
                            pool.query('UPDATE stop_parking SET status = "已占用" WHERE parkingid = "001"', (err, result) => {
                                if(err){
                                    throw(err)
                                }else{
                                    console.log('车位状态更新成功')
                                }
                            })
                        }
                    })
                }
            }
        })
    }
})

//设置请求响应接口
app.post('/api/login', (req, res) => {
    const {username, password} = req.body
//验证用户账号密码
    pool.query('SELECT * FROM stop_users WHERE username = ? AND password = ?',[username, password], (err, result) => {
        if(err){
             console.log('数据库查询失败！', err)
             res.send({success: false, code: 403})
        }else{
            if(result.length > 0){
                jwt.sign(
                    { username }, 
                    secretKey, 
                    {expiresIn: '30s'},
                    (err, token) => {
                        res.send({success: true, code: 200, message: '登陆成功', token, data: result})
                    }
                    )
            }else{
                console.log('登陆失败')
                res.send({success: false})
            }
        }
    })
})
//验证登录状态
app.post('/api/checkLoginState', (req, res) => {
    const headers = req.headers
    const token = headers['authorization'].split(' ')[1]
    jwt.verify(token, secretKey, (err, payload) => {
        if(err){
            res.send({
                code: 403,
                message: '认证失败'
            })
        }else{
            res.send({
                code: 200,
                message: '认证成功',
            })
        }
    })
})

app.get('/api/car', (req, res) => {
    pool.query('SELECT startdate, carid FROM stop_cars', (err, result) => {
        if(err){
            console.log('数据库查询失败！', err)
        }else{
            res.send({
                code: 200,
                message: '请求成功',
                data: result
            })
        }
    })
})

app.get('/api/parking', (req, res) => {
    pool.query('SELECT parkingid, status FROM stop_parking', (err, result) => {
        if(err){
            console.log('数据库查询失败！', err)
        }else{
            const canUsedParking = result.filter(item => item.status === '空闲').length
            res.send({
                code: 200,
                message: '请求成功',
                data: [
                    result,
                    canUsedParking
                ]
            })
        }
    })
})

app.post('/api/selfParking', (req, res) => {
    const {username} = req.body
    pool.query('SELECT parkingid FROM stop_parking WHERE username = ?', [username], (err, result) => {
        if(err){
            res.send({code: 400, message: '查询错误'})
        }else{
            if(result.length > 0){
                res.send({
                    code: 200,
                    message: '查询成功',
                    data: result[0]
                })
            }else{
                res.send({
                    code: 403,
                    message: '无对应车牌信息'
                })
            }
        }
    })
})

app.post('/api/changeParkingStatus', (req, res) => {
    const {username,parkingid} = req.body
    pool.query('SELECT * FROM stop_parking WHERE username =?',[username], (err, result) => {
        if(err){
            res.send({code: 400, message: '查询错误'})
        }else{
            if(result.length > 0){
                res.send({code: 403, message: '账号已预约其他车位'})  
            }else{
                pool.query('UPDATE stop_parking SET status = "已预约", username = ? WHERE parkingid = ?', [username,parkingid], (err,result) => {
                    if(err){
                        res.send({code: 400, message: '预约失败'})
                    }else{ 
                        res.send({
                            code: 200,
                            message: '预约成功'
                        })
                    }
                })
            }
        }
    })
})

app.get('/api/userInfo', (req, res) => {
    pool.query('SELECT username, permission, phone FROM stop_users', (err, result) => {
        if(err){
            res.send({code: 403, message: '数据获取失败'})
        }else{
            if(result.length > 0){
                res.send({
                    code: 200,
                    message: '数据获取成功',
                    data: result
                })
            }
        }
    })
})

app.post('/api/editUserInfo', (req, res) => {
    const {username, permission} = req.body
    pool.query('UPDATE stop_users SET permission = ? WHERE username = ?', [permission, username], (err, result) =>{
        if(err){
            res.send({code: 403, message: '权限修改失败'})
        }else{
            if(result.length > 0){
                res.send({
                    code: 200,
                    message: '权限更新成功',
                    data: result
                })
            }
        }
    })
})

//错误级别中间件，防止异常使服务器崩溃
app.use((err,req,res,next) => {
    console.log("Error happens",err.stack);
  })

server.listen(8000,()=>{
    console.log('服务器已启动，端口8000监听中......')
})
