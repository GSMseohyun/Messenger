// 모듈 불러오기
const express = require('express')
const socket = require('socket.io')
const http = require('http')
const fs = require('fs')

// express, 서버 생성
const app = express()
const server = http.createServer(app)

//서버 바인딩 - 이름에 속성이 연결되는 시간
const io = socket(server)
// 미들웨어 사용을 위한 app.use , 함수호출 등
app.use('/css',express.static('./static/css'))
app.use('/js',express.static('./static/js'))
// get(조회에 어울림) 방식 - > 속도가 빠르므로 /경로에 접속 / post(수정에 어울림)
app.get('/', function(request, response){
    fs.readFile('./static/index.html',function(err,data){
        // 에러 처리
        if(err){
            response.send('에러')
        }
        // 데이터 전송, 헤더 -> 내용 -> 끝 순으로 write 작성시 무조건 end 사용 
        else{
            response.writeHead(200, {'content-type' : 'text/html'})
            response.write(data)
            response.end()
        }
    })
})
//io.sockets = 접속 되는 모든 소켓, on = 해당 이벤트를 받을 시 콜백 함수 실행
io.sockets.on('connection', function(socket){
    // 접속 성공 시 뉴유저를 서버로 전송
    socket.on('newUser', function(name){
        console.log(name + ' 님이 접속하셨습니다')
    // 이름 저장
    socket.name = name

    // 모든 소켓에게 전송, 다른 접속 되어 있는 유저에게 알린다.
    io.sockets.emit('update',{type: 'connect', name:'SERVER', message: name + '님이 접속하셨습니다' })
    })

    // 수신
    socket.on('message',function(data){
        // 누가 보냈는 지 확인 
        data.name = socket.name
        console.log(data)
        // 본인 제외 나머지 유저에게 데이터 전송, sockets.emit -> 전체 / socket.broadcast.emit -> 본인 제외 모두
        socket.broadcast.emit('update' , data);
    })
    // 접속 종료
    socket.on('disconnect',function(){
        console.log(socket.name + '님이 나가셨습니다')

        // 나간 사람 제외 나머지 유저에게 전송
        socket.broadcast.emit('update',{type: 'disconnect', name:'SERVER', message: socket.name +' 님이 나가셨습니다.'});
    })
})

//서버 구동
server.listen(8000, function(){
    console.log('서버 실행중')
})

