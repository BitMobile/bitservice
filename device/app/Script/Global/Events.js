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
	 
	
}

