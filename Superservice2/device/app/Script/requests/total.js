	
function FillValue(param){
	//$.beginDate.Text = param.FactStartDataTime;
	$.Add("faktStart", param.FactStartDataTime);
	//$.endDate.Text = param.FactEndDataTime;
	$.Add("faktEnd", param.FactEndDataTime);
	//$.rStatus.Text = Translate["#" + param.Status.Description + "#"];
	$.Add("refStatus", param.Status);
	return param;
}
function SetBeginDate(v) {
	var header = Translate["#enterDateTime#"];
	if($.Exists("faktStart") && $.faktStart != null){
		Dialog.ShowDateTime(header, $.faktStart, SetBeginDateNow,v);
	} else {
		Dialog.ShowDateTime(header, SetBeginDateNow,v);
	}
}

function SetBeginDateNow(key,v) {
	$.beginDate.Text = DoFullDate(key);
	if ($.Exists("faktStart") == true){
		$.Remove("faktStart");
		$.Add("faktStart", key);
	} else {
		Dialog.Debug("New!!!");
		$.Add("faktStart", key);
	}
	obj = v.GetObject();
	obj.FactStartDataTime = key;
	obj.Save();
}

function SetEndDate(v) {
	var header = Translate["#enterDateTime#"];
	if($.Exists("faktEnd") && $.faktEnd != null){
		Dialog.ShowDateTime(header, $.faktEnd, SetEndDateNow,v);
	} else {
		Dialog.ShowDateTime(header, SetEndDateNow,v);
	}
}

function SetEndDateNow(key,v) {
	$.endDate.Text = DoFullDate(key);
	if ($.Exists("faktEnd") == true){
		$.Remove("faktEnd");
		$.Add("faktEnd", key);
	} else {
		Dialog.Debug("New!!!");
		$.Add("faktEnd", key);
	}
	obj = v.GetObject();
	obj.FactEndDataTime = key;
	obj.Save();
}

function DoStatusSelect(v){
	var st = [];
	st.push([DB.Current.Constant.VisitStatus.Completed, Translate["#Completed#"]]);
	st.push([DB.Current.Constant.VisitStatus.Expired, Translate["#Expired#"]]);	
	Dialog.Select("#requeststatus#", st, DoCallBackToBack, v);
}

function  DoCallBackToBack(key,v){
	obj = v.GetObject();
	var st = "#" + key.Description + "#";
	$.rStatus.Text = Translate[st];
	if ($.Exists("refStatus") == true){
		$.Remove("refStatus");
		$.Add("refStatus", key);
	} else {
		//Dialog.Debug("New!!!");
		$.Add("refStatus", key);
	}
	obj.Status = key;
	//Dialog.Debug($.faktEnd);
	// ‘иксаци€ времени если иного не установлено
	if ($.Exists("faktEnd") == true){
		if ($.faktEnd == null){		
			$.endDate.Text = DoFullDate(DateTime.Now);
			obj.FactEndDataTime = DateTime.Now;
			$.Remove("faktEnd");
			$.Add("faktEnd", DateTime.Now);
		} 
	} else {
			//Dialog.Debug("New!!!");
	if ($.faktEnd == null){		
		$.endDate.Text = DoFullDate(DateTime.Now);
		$.Add("faktEnd", DateTime.Now);
		obj.FactEndDataTime = DateTime.Now;
		}
	}
	
	
	// ‘иксаци€ времени начала если иного не установлено
	if ($.Exists("faktStart") == true){
		if ($.faktStart == null){
			$.beginDate.Text = DoFullDate(DateTime.Now);
			obj.FactStartDataTime = DateTime.Now;
			$.Remove("faktStart");
			$.Add("faktStart", DateTime.Now);
		}
	} else {
		if ($.faktStart == null){
			$.beginDate.Text = DoFullDate(DateTime.Now);
			$.Add("faktStart", DateTime.Now);
			obj.FactStartDataTime = DateTime.Now;
		}
	}	
	obj.Save();	
}



function CommitRequest(request, fStart, fStop, refStatus){
	obj = request.GetObject();
	obj.FactStartDataTime = $.faktStart;
	obj.FactEndDataTime = $.faktEnd;
	obj.Status = $.refStatus;
	obj.Save();	
	DB.Commit();
	$.Remove("refStatus");
	$.Remove("faktEnd");
	$.Remove("faktStart");	
	ClearMyGlobal();
	Workflow.Action("DoCommit", []);
}

function DoFullDate(dt){
	if (dt != null){
	return String.Format("{0:dd MMMM yyyy} {0:HH:mm}", DateTime.Parse(dt));
	} else {
		return "";
	}
}

function isProgress(obj){
	//Dialog.Debug(obj);
	if (obj.ToString() == (DB.Current.Constant.VisitStatus.Processing).ToString() || obj.ToString() == (DB.Current.Constant.VisitStatus.Expected).ToString()) {
		return true;
	} else {
		return false;
	}
}

