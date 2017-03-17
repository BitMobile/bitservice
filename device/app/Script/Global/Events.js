// ------------------------ Application -------------------

function OnApplicationInit() {
    Variables.AddGlobal("lastDataSync", "-");
    Variables.AddGlobal("lastFtpSync", "-");
    //Когда будет возможность обратиться к глобальному модулю
 // if ($.Exists("appStatuses"))
	//	 $.Remove("appStatuses");
	//	 Variables.AddGlobal("appStatuses", new Dictionary());
	//	 Variables["appStatuses"].Add("UserInMskCO", Global.checkUsr());
}

function OnWorkflowStart(name) {
	 if ($.Exists("workflow"))
		  $.Remove("workflow");
	 Variables.AddGlobal("workflow", new Dictionary());
	 Variables["workflow"].Add("name", name);

	 if(name == "requests"){
	 	GPS.StartTracking(-1);
	 }

}

function OnApplicationBackground(workflow) {
	 	GPS.StopTracking();
}


function OnApplicationRestore(workflow) {
     if($.Exists("onGPS")){
	 	GPS.StartTracking(-1);
	 }
}
function OnWorkflowForwarding(workflowName, lastStep, nextStep, parameters) {
	if (nextStep == "DirtyHack") {
		sendRequest($.sStaffName.Text, $.sClientName.Text, $.sComment.Text);
		if ($.Exists("sent")){
			$.Remove("sent");
			$.AddGlobal("sent", true);
		} else {
			$.AddGlobal("sent", true);
		}


		$.submitButton.Text = "Отправить запрос";
		$.sClientName.Text = "";
		$.sComment.Text = "";
		setCookie($.sStaffName.Text, "", "");
		Workflow.Refresh([]);

		return false;

	}

	if (nextStep == "DirtyHackClient") {
		if (sendClientRequest($.phone.Text, $.sClientName.Text, $.sComment.Text, $.contact.Text)) {
			if ($.Exists("sent")){
				$.Remove("sent");
				$.AddGlobal("sent", true);
			} else {
				$.AddGlobal("sent", true);
			}

			$.sClientName.Text = "";
			$.sComment.Text = "";
			$.contact.Text = "";
			$.phone.Text = "";
			//setCookie($.sStaffName.Text, "", "");
			Workflow.Refresh([]);
		} else {
			$.submitButton.Text = "Отправить запрос";
			Workflow.Refresh([]);
		}
		return false;

	}

	//Dialog.Debug("workflowName = "+workflowName+", lastStep = "+lastStep+", nextStep = "+nextStep);

	 if ((nextStep == "requests" && lastStep == "null") || (nextStep == "Customer" && lastStep == "requests")) {
	 	if (!$.Exists("onGPS")){
	 		$.AddGlobal("onGPS", null);
	 		GPS.StartTracking(-1);
	 	}
	 } else {
	 	if ($.Exists("onGPS")){
	 		$.Remove("onGPS");
	 		GPS.StopTracking();
	 	}
	 }

	return true;
}

function OnWorkflowBack(workflow, lastStep, nextStep) {
	//Dialog.Debug("workflowName = "+workflow+", lastStep = "+lastStep+", nextStep = "+nextStep);

	 if (nextStep == "Customer") {
	 	if (!$.Exists("onGPS")){
	 		$.AddGlobal("onGPS", null);
	 		GPS.StartTracking(-1);
	 	}
	 }
	 return true;
}

function sendRequest(staffName, clientName, comment){
	//var req = new HttpRequest("http://192.168.104.24"); //develop
	var req = new HttpRequest("http://web-server.ru.com:30015"); //production
	if (!IsNullOrEmpty(staffName) && !IsNullOrEmpty(clientName) && !IsNullOrEmpty(comment)){
		setCookie(staffName, clientName, comment);
		try {
			//req.Post("/leadmarketing/hs/sending", 'from=' + staffName + '&client=' + clientName + '&comment=' + comment); //develop
			req.Post("/samurai1/hs/sending", 'from=' + staffName + '&client=' + clientName + '&comment=' + comment); //production
		} catch (e){
			Dialog.Message("Запрос не отправлен. Попробуйте повторить отправку позже.");
			setCookie(staffName, clientName, comment);
		}
	} else {
		Dialog.Message("Пожалуйста заполните все поля.");
	}
}

function sendClientRequest(staffName, clientName, comment, contact){
	//var req = new HttpRequest("http://bitmobile2.bt"); //develop
	var req = new HttpRequest("http://web-server.ru.com:40018"); //production
	if (!IsNullOrEmpty(clientName)){
		//setCookie(staffName, clientName, comment);
		try {
			var curUser = $.common.UserRef;
			//req.Post("/superservice/hs/sending/" + curUser.Id, 'contact='+ contact +'&phone=' + staffName + '&client=' + clientName + '&comment=' + comment); //develop
			req.Post("/hs/sending/" + curUser.Id, 'contact='+ contact +'&phone=' + staffName + '&client=' + clientName + '&comment=' + comment); //production
			return true
		} catch (e){
			//Dialog.Debug(e);
			//Dialog.Debug(e.StatusCode);
			Dialog.Message("Запрос не отправлен. Попробуйте повторить отправку позже.");
			//setCookie(staffName, clientName, comment);
			return false
		}
	} else {
		Dialog.Message("Пожалуйста заполните поле 'Наименование клиента'");
		return false
	}
}

function IsNullOrEmpty(val1) {
    return String.IsNullOrEmpty(val1);
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
