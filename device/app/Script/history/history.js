function MakeFilterSettingsBackUp(){
	
	if ($.Exists("BUFilterCopy") == true){
		$.Remove("BUFilterCopy");
		$.Add("BUFilterCopy", new Dictionary());
		$.BUFilterCopy.Add("Start", historyStart);
		$.BUFilterCopy.Add("Stop", historyStop);
	} else {
		$.Add("BUFilterCopy", new Dictionary());
		$.BUFilterCopy.Add("Start", historyStart);
		$.BUFilterCopy.Add("Stop", historyStop);
	}
	
}



function RollBackAndBack(){
	historyStart = $.BUFilterCopy.Start;
	historyStop = $.BUFilterCopy.Stop;
	Workflow.Back();
	
}

function clearmyfilter(){
	$.beginDate.Text = "";
	historyStart = undefined;
	$.endDate.Text = "";
	historyStop = undefined;
}
function ClearFilter(){
	historyStart = undefined;
	historyStop = undefined;
	Workflow.Refresh([]);
}

function PeriodTime(dateStart, dateStop){

	if (!IsNullOrEmpty(dateStop)){
		var p = String.Format("{0:dd.MM.} {0:HH:mm} - {1:HH:mm}", DateTime.Parse(dateStart), DateTime.Parse(dateStop));
		//String.Format("{0:dd.MM. 0:hh:mm - 1:hh:mm}", DateTime.Parse(dateStart), DateTime.Parse(dateStop));
	} else {
		var p = String.Format("{0:dd.MM.} {0:HH:mm}", DateTime.Parse(dateStart));
	}	
	return p;
}

function filterDate(dt){
	if (dt != null){
		return String.Format("{0:dd MMMM yyyy}", DateTime.Parse(dt));
	} else {
		return "";
	}
}

function filterDateCaption(dt){
	if (dt != null){
		return String.Format("{0:dd.MM.yyyy}", DateTime.Parse(dt));
	} else {
		return "";
	}
}

function GetAllCompleteTaskDetails(searchtext){
	var q = new Query();
	var qtext = "SELECT CUST.Description AS CustName,  ADDRS.Address AS Addr, REQ.FactStartDataTime AS Start, REQ.FactEndDataTime AS Stop, REQ.Id AS Ind FROM Document_Visit REQ LEFT JOIN Catalog_Customer CUST ON REQ.Customer = CUST.Id LEFT JOIN Catalog_Outlet ADDRS ON REQ.Outlet = ADDRS.Id WHERE (Status == @StatusProc OR Status == @StatusEx)";
	
	if (searchtext != null && searchtext != ""){
		var searchtail = " AND  Contains(CUST.Description, @SearchText)";
		q.AddParameter("SearchText", searchtext);
		qtext = qtext + searchtail;
	}
	
	if (historyStart != undefined){
		var starttail = " AND REQ.FactStartDataTime >= @DateStart";//AND REQ.PlanStartDataTime < @DateEnd
		q.AddParameter("DateStart", historyStart);
		qtext = qtext + starttail;
		
	}
	
	if (historyStop != undefined){
		var stoptail = " AND REQ.FactStartDataTime < @DateEnd";//AND REQ.PlanStartDataTime < @DateEnd
		q.AddParameter("DateEnd", historyStop);
		qtext = qtext + stoptail;
	}
	
	q.Text = qtext + " ORDER BY REQ.FactStartDataTime";
	q.AddParameter("StatusProc", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.VisitStatus.Expired);
	var c = q.Execute();
	//Dialog.Debug(c);
	return c.Unload(); 
}

function SetBeginDate() {
	var header = Translate["#enterDateTime#"];
	//Console.WriteLine(historyStart);
	if(historyStart != undefined){
		Dialog.ShowDateTime(header, historyStart, SetBeginDateNow);
	} else {
		Dialog.ShowDateTime(header, SetBeginDateNow);
	}
}

function SetBeginDateNow(key) {
	$.beginDate.Text = filterDate(key);
	historyStart = BegOfDay(key);
	//Workflow.Refresh([]);
}

function SetEndDate() {
	var header = Translate["#enterDateTime#"];
	if(historyStop != undefined){
		Dialog.ShowDateTime(header, historyStop, SetEndDateNow);
	} else {
		Dialog.ShowDateTime(header, SetEndDateNow);
	}
}

function SetEndDateNow(key) {
	$.endDate.Text = filterDate(key);
	historyStop = EndOfDay(key);
	//Dialog.Debug(BegOfDay(key));
	//Workflow.Refresh([]);
}

function initvalues(){ // Инициализация переменных фильтра
	if ($.Exists("searchToDay") == false){
		$.AddGlobal("searchToDay", null);
	} 
	
	if ($.Exists("searchAll") == false){
		$.AddGlobal("searchAll", null);
	} 
	
	if ($.Exists("filterStart") == false){
		$.AddGlobal("filterStart", null);
	} 
	
	if ($.Exists("filterStop") == false){
		$.AddGlobal("filterStop", null);
	}
	
//	Dialog.Debug("SaerchAll" + $.searchAll);
//	Dialog.Debug("search to day" + $.searchToDay);
//	Dialog.Debug("Start" + $.filterStart);
//	Dialog.Debug("Stop" + $.filterStop);
}

function filterDate(dt){
	if (dt != null){
		return String.Format("{0:dd MMMM yyyy}", DateTime.Parse(dt));
	} else {
		return "";
	}
}

function PeriodTime(dateStart, dateStop){

	if (dateStop != NULL){
		var p = String.Format("{0:dd.MM.} {0:HH:mm} - {1:HH:mm}", DateTime.Parse(dateStart), DateTime.Parse(dateStop));
		//String.Format("{0:dd.MM. 0:hh:mm - 1:hh:mm}", DateTime.Parse(dateStart), DateTime.Parse(dateStop));
	} else {
		var p = String.Format("{0:dd.MM.} {0:HH:mm}", DateTime.Parse(dateStart));
	}	
	return p;
}

function findinalltext(key){
	$.Remove("searchAll");
	$.AddGlobal("searchAll", key);
	Workflow.Refresh([]);
}