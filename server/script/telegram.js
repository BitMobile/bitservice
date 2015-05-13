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
 
// ������� ����������� �� sms
// ���������:
//  $.phone - ����� �������� �����������
//  $.sms - ��� ���
// ����������:
//  "success" - ����������� �������
//  ����� ������
function authorize() {
    try {
        var client = Telegram.Client($.phone);
        client.Authorize($.sms);
        return "success";
    } catch (e) {
        return e.Message;
    }
}
 
// ������� �������� ���������
// ���������:
//  $.phone - ����� �������� �����������
//  $.user - ������� ��������
//  $.message - ����� ���������
// ����������:
//  "success" - ��������� ������� ����������
//  ����� ������
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