// ------------------------ Application -------------------

function OnApplicationInit() {
    Variables.AddGlobal("lastDataSync", "-");
    Variables.AddGlobal("lastFtpSync", "-");
}

function OnWorkflowStart(name) {
	 if ($.Exists("workflow"))
	  $.Remove("workflow");
	 Variables.AddGlobal("workflow", new Dictionary());

	 Variables["workflow"].Add("name", name);
	 
	}