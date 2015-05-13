function connect() {
    try {
        var client = Telegram.Client($.phone);
        if(!client.Authorized)
            if (!client.Connect())
                return "sms";
                 
        return "success";
    } catch (e) {
        return e.Message;
    }
}
 
// Попытка авторизации по sms
// Параметры:
//  $.phone - номер телефона отправителя
//  $.sms - смс код
// Возвращает:
//  "success" - авторизация успешна
//  текст ошибки
function authorize() {
    try {
        var client = Telegram.Client($.phone);
        client.Authorize($.sms);
        return "success";
    } catch (e) {
        return e.Message;
    }
}
 
// Попытка отправки сообщения
// Параметры:
//  $.phone - номер телефона отправителя
//  $.user - телефон адресата
//  $.message - текст сообщения
// Возвращает:
//  "success" - сообщение успешно отправлено
//  текст ошибки
function send(){
    try {
        var client = Telegram.Client($.phone);
        client.SendMessage($.user, $.message);
        return "success";
    } catch (e) {
        return e.Message;
    }
}

function sendtogroup(){
	 try {
	        var client = Telegram.Client($.phone);
	        return client.Rpc("messages.sendMessage",[Telegram.Comb("inputPeerChat", [$.chatroom]), $.message, Telegram.GetRandom().ToString()]);	       
	    } catch (e) {
	        return e;
	    }
}


function getdialoglist(){
    try {
        var client = Telegram.Client($.phone);
        return client.Rpc("messages.getDialogs",[0, 1000 , 1000]);
    } catch (e) {
        return e;
    }
}