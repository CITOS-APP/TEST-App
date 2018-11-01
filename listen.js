
       window.onload = function(){
        if (annyang) {
           var interim_transcript = '';
               final_transcript = '';
               allData = {};
               annyang.start({ autoRestart: false, continuous: true })
                 var recognition = annyang.getSpeechRecognizer();
                 var final_transcript = '';
                 recognition.interimResults = true;
                 recognition.onresult = function(event) {
                       for (var i = event.resultIndex; i < event.results.length; ++i) {
                             if (event.results[i].isFinal) {
                                 final_transcript += event.results[i][0].transcript;
                                 console.log("final_transcript="+final_transcript);
                                 $("#chatLog").append("<p>"+ final_transcript + "</p>");
                                 allData = { "username": interim_transcript,
                                 "message": final_transcript
                               };
                                 callchat(allData);
                                 final_transcript = "";
                                 //annyang.trigger(final_transcript); //If the sentence is "final" for the Web Speech API, we can try to trigger the sentence
                             } else {
                                 interim_transcript += event.results[i][0].transcript;
                                 console.log("interim_transcript="+interim_transcript);
                             }
                         }
                       // document.getElementById('result').innerHTML =  '중간값:='+interim_transcript+'<br/>결과값='+final_transcript;
                       // console.log('interim='+interim_transcript+'|final='+final_transcript);
                //    allData = { "username": interim_transcript,
                //                    "message": final_transcript
                //                  };
                 };
           }
       }
    // $(document).ready( function() {
  function callchat(allData){
        // $('#button').click( function(){
      console.log("Test");
      console.log(allData);
      $.ajax({
      url: "http://localhost:3000/chatBot", // 클라이언트가 요청을 보낼 서버의 URL 주소
      // url: "http://0a232bf2.ngrok.io/chatBot", // 클라이언트가 요청을 보낼 서버의 URL 주소
      data: allData,                // HTTP 요청과 함께 서버로 보낼 데이터
      type: "post",                             // HTTP 요청 방식(GET, POST)
      dataType: "json"                         // 서버에서 보내줄 데이터의 타입
      })
  // HTTP 요청이 성공하면 요청한 데이터가 done() 메소드로 전달됨.
      .done(function(json) {
        console.log("listen")
        // $("<p>").text(json.reply).appendTo("body");
        $("#chatLog").append("<p>"+json.reply +"<p>")
        if(json.reply.split(" ")[0] == '선택하신'){
            tmpmenu = json.reply.split(" ")[2]
        }
        if(json.reply == "응"){
            if(tmpmenu != undefined){
                callqrcode(tmpmenu)
            }
        }else if(json.reply == "결제 되었습니다."){
            // refresh
        }else{
            send(json.reply);
        }

        var split_msg = json.reply.split(" ");
        if( split_msg.length ===3 ){
            if ( split_msg[2] === '주문하겠습니다.'){
                let menu = split_msg[1];
                callqrcode(menu);
            }
         }
      })
  // HTTP 요청이 실패하면 오류와 상태에 관한 정보가 fail() 메소드로 전달됨.
      .fail(function(xhr, status, errorThrown) {
        console.log("error");
        // $("#text").html("오류가 발생했습니다.<br>")
        // .append("오류명: " + errorThrown + "<br>")
        // .append("상태: " + status);
      })
      // HTTP 요청이 성공하거나 실패하는 것에 상관없이 언제나 always() 메소드가 실행됨.
     
    };


    function callqrcode(menu){

        let options = {
            'price' : 1000,
            'menu' : menu  
          }

        $.ajax({
            url: "http://localhost:3000/qrcode", // 클라이언트가 요청을 보낼 서버의 URL 주소
            data: options,                // HTTP 요청과 함께 서버로 보낼 데이터
            type: "post",                             // HTTP 요청 방식(GET, POST)
            dataType: "json"                         // 서버에서 보내줄 데이터의 타입
            }).done(function(json) {
                console.log(json);
                $("#chatLog").append("<img src=" + json.QRcode +"></img>")
                setTimeout(()=>{
                    location.reload();
                }, 5000);
            });
          
    }
// });
//   });
var send = null;
$(document).ready(function() {  
    // $("#chatLog").append("<p>test</p>");
    $('#button').on('click', function(){
        $(this).toggleClass('on');
    });
    $('#exampleModal').on('show.bs.modal', function() {
        // do something when the modal is shown
        // console.log($("#chatLog"));
    });

    $('#exampleModal').on('hidden.bs.modal', function () {
        // console.log($("#chatLog"));
        $("#chatLog").detach();
        // window.alert('hidden event fired!');
        
    });

if(!("WebSocket" in window)){  
$('#chatLog, input, button, #examples').fadeOut("fast");  
$('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');  
}else{  
//The user has We

connect();  

function connect(){  
  var socket;  
  var host = "ws://localhost:8888/ws";  

  try{  
      var socket = new WebSocket(host);  

    //   message('<p class="event">Socket Status: '+socket.readyState);  

      socket.onopen = function(){  
        //  message('<p class="event">Socket Status: '+socket.readyState+' (open)');  
      }  

      socket.onmessage = function(msg){  
        //  message('<p class="message">Received: '+msg.data);  
      }  

      socket.onclose = function(){  
        // message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');  
      }           

  } catch(exception){  
    //  message('<p>Error'+exception);  
  }  

  send = function (reply){  
      var text = reply;  
    //   var text = $('#text').val();  

      if(text==""){  
        //   message('<p class="warning">Please enter a message');  
          return ;  
      }  
      try{  
          socket.send(text);
          console.log(text);  
        //   message('<p class="event">Sent: '+text)  

      } catch(exception){  
        console.log(exception);  
        //  message('<p class="warning">');  
      }  
      $('#text').val("");  
  }  

  function message(msg){  
    $('#chatLog').append(msg+'</p>');  
    console.log(msg);
  }  

  $('#text').keypress(function(event) {  
      if (event.keyCode == '13') {  
        send();  
      }  
  });   
  $('#send').click(function(){  
    send();
  });    

  $('#disconnect').click(function(){  
     socket.close();  
  });  

}//End connect  

}//End else  

});  
