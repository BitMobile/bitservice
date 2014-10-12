function GetAllCompleteTaskDetails(searchtext, dtstart, dtstop){
	var q = new Query();
	var qtext = "SELECT CUST.Description AS CustName,  ADDRS.Address AS Addr, REQ.PlanStartDataTime AS Start, REQ.PlanEndDataTime AS Stop, REQ.Id AS Ind FROM Document_Visit REQ LEFT JOIN Catalog_Customer CUST ON REQ.Customer = CUST.Id LEFT JOIN Catalog_Outlet ADDRS ON REQ.Outlet = ADDRS.Id WHERE (Status == @StatusProc OR Status == @StatusEx)";
	
	if (searchtext != null && searchtext != ""){
		var searchtail = " AND  Contains(CUST.Description, @SearchText)";
		q.AddParameter("SearchText", searchtext);
		qtext = qtext + searchtail;
	}
	
	if (dtstart != null){
		var starttail = " AND REQ.PlanStartDataTime >= @DateStart";//AND REQ.PlanStartDataTime < @DateEnd
		q.AddParameter("DateStart", dtstart);
		qtext = qtext + starttail;
		
	}
	
	if (dtstop != null){
		var stoptail = " AND REQ.PlanStartDataTime < @DateEnd";//AND REQ.PlanStartDataTime < @DateEnd
		q.AddParameter("DateEnd", dtstop);
		qtext = qtext + stoptail;
	}
	
	q.Text = qtext + " ORDER BY REQ.PlanStartDataTime";
	q.AddParameter("StatusProc", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.VisitStatus.Expired);
	var c = q.Execute();
	//Dialog.Debug(c);
	return c; 
}

function SetBeginDate() {
	var header = Translate["#enterDateTime#"];
    if($.Exists("filterStart") && $.filterStart != null){
    	Dialog.ShowDateTime(header,  $.filterStart, SetBeginDateNow);
    } else {
    	Dialog.ShowDateTime(header, SetBeginDateNow);
    }
	
}

function SetBeginDateNow(key) {
	$.beginDate.Text = filterDate(key);
	$.Remove("filterStart");
	$.AddGlobal("filterStart", BegOfDay(key));
	Workflow.Refresh([]);
}

function SetEndDate() {
	var header = Translate["#enterDateTime#"];
	 if($.Exists("filterStop") && $.filterStop != null){
		 Dialog.ShowDateTime(header, $.filterStop, SetEndDateNow);
	 } else {
		 Dialog.ShowDateTime(header, SetEndDateNow);
	 }
}

function SetEndDateNow(key) {
	$.endDate.Text = filterDate(key);
	$.Remove("filterStop");
	$.AddGlobal("filterStop", EndOfDay(key));
	Workflow.Refresh([]);
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