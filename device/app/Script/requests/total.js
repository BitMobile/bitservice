function gamingOnLoad(req){
	obj = req.GetObject();
	//Dialog.Debug('AngryClient:' + obj.AngryClient);
	if (req.AngryClient == true) {
		$.AngryImageFalse.Visible = false;
		$.AngryImageTrue.Visible = true;
		//$.AngryCaption.Text = 'Найден недовольный клиент!';
	} else {
		$.AngryImageTrue.Visible = false;
		$.AngryImageFalse.Visible = true;
		//$.AngryCaption.Text = 'Клиент недоволен?';
		
	}
	//Dialog.Debug('HungryClient:' + obj.HungryClient);
	if (req.HungryClient == true){
		$.HungryImageFalse.Visible = false;
		$.HungryImageTrue.Visible = true;
		//$.HungryCaption.Text = 'Подобрана денежка!';
	} else {
		$.HungryImageTrue.Visible = false;
		$.HungryImageFalse.Visible = true;
		//$.HungryCaption.Text = 'Можно совершить продажу';
	}
	
	$.VisitComment.Text =  req.AHComment;
//	if (isProgress(req.Status)){
//		
//	} else {
//		$.VisitComment.Text =  req.AHComment;
//	}	
}

function isHungry(sender, req){
	obj = req.GetObject();
	if ($.HungryImageFalse.Visible == true){
		$.HungryImageFalse.Visible = false;
		$.HungryImageTrue.Visible = true;
		obj.HungryClient = true;
		obj.Save(false);
		//$.HungryCaption.Text = 'Подобрана денежка!';
	} else {
		$.HungryImageTrue.Visible = false;
		$.HungryImageFalse.Visible = true;
		obj.HungryClient = false;
		obj.Save(false);
		//$.HungryCaption.Text = 'Можно совершить продажу';
	}
	
}

function isAngry(sender, req){
	obj = req.GetObject();
	if ($.AngryImageFalse.Visible == true){
		$.AngryImageFalse.Visible = false;
		$.AngryImageTrue.Visible = true;
		obj.AngryClient = true;
		obj.Save(false);
		//$.AngryCaption.Text = 'Найден недовольный клиент!';
	} else {
		$.AngryImageTrue.Visible = false;
		$.AngryImageFalse.Visible = true;
		obj.AngryClient = true;
		obj.Save(false);
		//$.AngryCaption.Text = 'Клиент недоволен?';
	}
	
}

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
	// Фиксация времени если иного не установлено
	if ($.Exists("faktEnd") == true){
		if ($.faktEnd == null){		
			$.endDate.Text = DoFullDate(DateTime.Now);
			obj.FactEndDataTime = DateTime.Now;
			$.Remove("faktEnd");
			$.Add("faktEnd", DateTime.Now);
		} 
	} 
		else {
			//Dialog.Debug("New!!!");
	if ($.faktEnd == null){		
		$.endDate.Text = DoFullDate(DateTime.Now);
		$.Add("faktEnd", DateTime.Now);
		obj.FactEndDataTime = DateTime.Now;
		}
	}
	
	
	// Фиксация времени начала если иного не установлено
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
	//Dialog.Debug($.refStatus);
	if ($.refStatus == "@ref[Enum_VisitStatus]:a726738c-984b-adc0-4d64-909dd0ababe3" && $.workflow.name != "Historylist"){//DB.Current.Constant.VisitStatus.Completed
		Dialog.Alert("Выполнить синхронизацию?", commitAndSync, [request, fStart, fStop, refStatus], "Да", "Нет", "Отмена");
	} else if (request.Status == "@ref[Enum_VisitStatus]:be6494bc-d2a1-f680-400e-c22c2ab9c87e" && $.workflow.name != "Historylist")  { //DB.Current.Constant.VisitStatus.Expired
		Dialog.Alert("Выполнить синхронизацию?", commitAndSync, [request, fStart, fStop, refStatus], "Да", "Нет", "Отмена");	
	} else if (request.Status == "@ref[Enum_VisitStatus]:88babd68-1d49-88cd-4baf-dc75168a172f" && $.workflow.name != "Historylist") {
		Dialog.Alert("Завершить визит и выполнить синхронизацию?", commitAndSync, [request, fStart, fStop, refStatus], "Да", "Нет", "Отмена");
	} else {
		Workflow.Action("DoCommit", []);
	}
	
	
}

function syncOnly(state, args){
	
	obj = state[0].GetObject();
	if (args.Result == 0){
		obj.FactStartDataTime = $.faktStart;
		if ($.Exists("faktEnd") == true){
			if ($.faktEnd == null){		
				obj.FactEndDataTime = DateTime.Now;
			} else {
				obj.FactEndDataTime = $.faktEnd;
			}
		}		
		obj.Status =  DB.Current.Constant.VisitStatus.Completed;
		obj.AHComment = $.VisitComment.Text;
		obj.Save();	
		DB.Commit();
		$.Remove("refStatus");
		$.Remove("faktEnd");
		$.Remove("faktStart");	
		$.Remove("ResQuery");
		ClearMyGlobal();
		Workflow.Action("DoSync", []);
	} else if (args.Result == 1) {
		obj.FactStartDataTime = $.faktStart;
		obj.FactEndDataTime = $.faktEnd;
		obj.Status = $.refStatus;
		obj.AHComment = $.VisitComment.Text;
		obj.Save();	
		DB.Commit();
		$.Remove("refStatus");
		$.Remove("faktEnd");
		$.Remove("faktStart");	
		$.Remove("ResQuery");
		ClearMyGlobal();
		Workflow.Action("DoCommit", []);
	} 	
}


function commitAndSync(state, args) {
	obj = state[0].GetObject();
	if (args.Result == 0){		
		obj.FactStartDataTime = $.faktStart;
		if ($.Exists("faktEnd") == true){
			if ($.faktEnd == null){		
				obj.FactEndDataTime = DateTime.Now;
			} else {
				obj.FactEndDataTime = $.faktEnd;
			}
		}		
		obj.Status =  DB.Current.Constant.VisitStatus.Completed;
		obj.AHComment = $.VisitComment.Text;
		obj.Save();	
		DB.Commit();
		$.Remove("refStatus");
		$.Remove("faktEnd");
		$.Remove("faktStart");	
		$.Remove("ResQuery");
		ClearMyGlobal();
		Workflow.Action("DoSync", []);
	} else if (args.Result == 1) {
		obj.FactStartDataTime = $.faktStart;
		obj.FactEndDataTime = $.faktEnd;
		obj.Status = $.refStatus;
		obj.AHComment = $.VisitComment.Text;
		obj.Save();	
		DB.Commit();
		$.Remove("refStatus");
		$.Remove("faktEnd");
		$.Remove("faktStart");	
		$.Remove("ResQuery");
		ClearMyGlobal();
		Workflow.Action("DoCommit", []);
	} 	
}

function doOnlyCommit(state, args){
	obj = state[0].GetObject();
	obj.FactStartDataTime = $.faktStart;
	obj.FactEndDataTime = $.faktEnd;
	obj.Status = $.refStatus;
	obj.AHComment = $.VisitComment.Text;
	obj.Save();	
	DB.Commit();
	$.Remove("refStatus");
	$.Remove("faktEnd");
	$.Remove("faktStart");	
	$.Remove("ResQuery");
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

