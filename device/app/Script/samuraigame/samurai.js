function OnLoad(){
	
	getCookie();
}

function getCookie() {
	if (FileSystem.Exists("/private/cookie.bmf")){
		var fileCookie = FileSystem.OpenTextFile("/private/cookie.bmf");
		var slises = new Dictionary();
		var tempStr = "";
		var i = 1;
		if (StrLen(TrimAll(fileCookie))>0){
			tempStr = Left(fileCookie, Find(fileCookie, "|")-1);
			$.sStaffName.Text = tempStr;
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


function setCookie(staffName, clientName, comment) {
	var data = "";
	if (!IsNullOrEmpty(staffName)){
		data = data + staffName + "|";
	}
	
	if (!IsNullOrEmpty(clientName)){
		data = data + clientName + "|";
	}
	
	if (!IsNullOrEmpty(comment)){
		data = data + comment + "|";
	}
	
	if (FileSystem.Exists("/private/cookie.bmf")){
		FileSystem.Delete("/private/cookie.bmf");
		FileSystem.CreateTextFile("/private/cookie.bmf", data);
	} else {
		FileSystem.CreateTextFile("/private/cookie.bmf", data);
	}
}

function sendRequest(staffName, clientName, comment){
	var req = new HttpRequest("http://192.168.104.24"); //develop
	if (!IsNullOrEmpty(staffName) && !IsNullOrEmpty(clientName) && !IsNullOrEmpty(comment)){
		setCookie(staffName, clientName, comment);
		try {							
			req.Post("/leadmarketing/hs/sending", 'from=' + staffName + '&client=' + clientName + '&comment=' + comment); //develop			
		} catch (e){
			Dialog.Message("Запрос не отправлен. Попробуйте повторить отправку позже.");
			setCookie(staffName, clientName, comment);
		}
		
		$.submitButton.Text = "Отправить запрос";
		$.done_message.Visible = true;
		$.sClientName.Text = "";
		$.sComment.Text = "";
		setCookie(staffName, "", "");
		
	} else {
		Dialog.Message("Пожалуйста заполните все поля.");
	}
}

function clickSend(){
	$.done_message.Visible = false;
	$.submitButton.Text = "Идет отправка...";
	sendRequest($.sStaffName.Text, $.sClientName.Text, $.sComment.Text);
}

