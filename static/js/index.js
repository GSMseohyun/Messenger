// socket api 이용
var socket = io()

// 접속 시, 실행
socket.on('connect',function(){
    var name = prompt('반갑습니다','')
    // 이름이 빈 칸일 경우, 익명으로 접속 됨
    if(!name){
        name = '익명'
    }
    // 새로운 유저가 왔다고 알림
    socket.emit('newUser', name)
})
// 클라이언트의 메시지 수신
socket.on('update',function(data){
    var chat = document.getElementById('chat')
    // 자바스크립트 이용하여 문서에 html 요소 추가 -> createElement
    var message = document.createElement('div')
    // 선택한 요소에 텍스트 추가 (이름과, 메시지)
    var node = document.createTextNode(`${data.name}: ${data.message}`)
    var className = ''

    switch(data.type) {
        case 'message':
          className = 'other'
          break
    
        case 'connect':
          className = 'connect'
          break
    
        case 'disconnect':
          className = 'disconnect'
          break
      }
      message.classList.add(className)
      // 자식 요소 추가
      message.appendChild(node)
      chat.appendChild(message)    
})

// 전송 함수
function send(){
    // 입력 된 데이터 가져오기
    var message = document.getElementById('test').value
    // 데이터 빈 칸으로 변경
    document.getElementById('test').value = ''
    // 내가 전송할 메시지 클라이언트에게 표시
    var chat = document.getElementById('chat')
    var msg = document.createElement('div')
    var node = document.createTextNode(message)
    msg.classList.add('me')
    msg.appendChild(node)
    chat.appendChild(msg)
    // 서버로 message 이벤트 전달, 데이터와 함께  / emit = 전송
    socket.emit('message',{type : 'message' , message: message})
}