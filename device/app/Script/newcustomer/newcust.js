function OnLoad(){
	if ($.Exists("sent")){
		$.Remove("sent");
		$.AddGlobal("sent", false);		
	} else {
		$.AddGlobal("sent", false);
	}
	getCookie();
}

function getCookie() {
	if (FileSystem.Exists("/private/clientclientcookie.bmf")){
		var fileCookie = FileSystem.OpenTextFile("/private/clientclientcookie.bmf");
		var slises = new Dictionary();
		var tempStr = "";
		var i = 1;
		if (StrLen(TrimAll(fileCookie))>0){
			tempStr = Left(fileCookie, Find(fileCookie, "|")-1);
			$.phone.Text = tempStr;
			fileCookie = StrReplace(fileCookie, tempStr + "|", "");
		}
		
		if (StrLen(TrimAll(fileCookie))>0){
			tempStr = Left(fileCookie, Find(fileCookie, "|")-1);
			$.sClientName.Text = tempStr;
			fileCookie = StrReplace(fileCookie, tempStr + "|", "");
		}
	
		if (StrLen(TrimAll(fileCookie))>0){
			tempStr = Left(fileCookie, Find(fileCookie, "|")-1);
			$.sComment.Text = tempStr;
			fileCookie = StrReplace(fileCookie, tempStr + "|", "");
		}
	
	} 
}


function setCookie(phone, clientName, comment) {
	var data = "";
	if (!IsNullOrEmpty(phone)){
		data = data + phone + "|";
	}
	
	if (!IsNullOrEmpty(clientName)){
		data = data + clientName + "|";
	}
	
	if (!IsNullOrEmpty(comment)){
		data = data + comment + "|";
	}
	
	if (FileSystem.Exists("/private/clientcookie.bmf")){
		FileSystem.Delete("/private/clientcookie.bmf");
		FileSystem.CreateTextFile("/private/clientcookie.bmf", data);
	} else {
		FileSystem.CreateTextFile("/private/clientcookie.bmf", data);
	}
}

function sendRequest(phone, clientName, comment){
	var req = new HttpRequest("http://192.168.104.24"); //develop
	if (!IsNullOrEmpty(phone) && !IsNullOrEmpty(clientName) && !IsNullOrEmpty(comment)){
		setCookie(phone, clientName, comment);
		try {							
			req.Post("/bits/hs/sending", 'phone=' + phone + '&client=' + clientName + '&comment=' + comment); //develop			
		} catch (e){
			Dialog.Message("Отправка невозможна, попробуйте отправить позже");
			setCookie(phone, clientName, comment);
		}
		
		$.submitButton.Text = "РћС‚РїСЂР°РІРёС‚СЊ Р·Р°РїСЂРѕСЃ";
		$.done_message.Visible = true;
		$.sClientName.Text = "";
		$.sComment.Text = "";
		setCookie(phone, "", "");
		
	} else {
		Dialog.Message("РџРѕР¶Р°Р»СѓР№СЃС‚Р° Р·Р°РїРѕР»РЅРёС‚Рµ РІСЃРµ РїРѕР»СЏ.");
	}
}

function clickSend(){
	$.done_message.Visible = false;
	$.submitButton.Text = "Р�РґРµС‚ РѕС‚РїСЂР°РІРєР°...";
	
	Workflow.Action("DirtyHackClient", []);
	
	
	//sendRequest($.sphone.Text, $.sClientName.Text, $.sComment.Text);
}

function DoExit(){
	if ($.Exists("sent")){
		$.Remove("sent");
	}
	Workflow.Rollback();
}
