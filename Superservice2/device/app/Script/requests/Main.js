// ------------------------ requests screen module ------------------------

function GetTodaysActiveTask(){
	var q = new Query("SELECT * FROM Document_Visit WHERE PlanStartDataTime >= @DateStart AND PlanStartDataTime < @DateEnd AND Status != @StatusComp AND Status != @StatusEx");
	q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.VisitStatus.Expired);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));
	return q.ExecuteCount(); 
}

function GetAllActiveTask(){
	var q = new Query("SELECT * FROM Document_Visit WHERE Status == @StatusProc OR Status == @StatusEx");//
	q.AddParameter("StatusProc", DB.Current.Constant.VisitStatus.Processing);
	q.AddParameter("StatusEx", DB.Current.Constant.VisitStatus.Expected);
	return q.ExecuteCount(); 
}

function GetToDayUnDoneRequestsWithSearch(searchText, getCount){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query();
	var qtext = "SELECT CUST.Description AS CustName,  ADDRS.Address AS Addr, REQ.PlanStartDataTime AS Start, REQ.PlanEndDataTime AS Stop, REQ.Id AS Ind FROM Document_Visit REQ LEFT JOIN Catalog_Customer CUST ON REQ.Customer = CUST.Id LEFT JOIN Catalog_Outlet ADDRS ON REQ.Outlet = ADDRS.Id WHERE (REQ.PlanStartDataTime >= @DateStart AND REQ.PlanStartDataTime < @DateEnd AND REQ.Status != @StatusComp AND REQ.Status != @StatusEx)";
	if (searchText != null && searchText != ""){
		searchtail = " AND  Contains(CUST.Description, @SearchText)";
		q.AddParameter("SearchText", searchText);
		qtext = qtext + searchtail;
	}
	q.Text = qtext + " ORDER BY REQ.PlanStartDataTime"; 
	q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.VisitStatus.Expired);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));
	
	if (getCount == 0) {
		var c = q.Execute();
		return c; 
	} else {
		return q.ExecuteCount();
	}
}

function GetToDayDoneRequestsWithSearch(searchText, getCount){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query();
	var qtext = "SELECT CUST.Description AS CustName,  ADDRS.Address AS Addr, REQ.PlanStartDataTime AS Start, REQ.PlanEndDataTime AS Stop, REQ.Id AS Ind FROM Document_Visit REQ LEFT JOIN Catalog_Customer CUST ON REQ.Customer = CUST.Id LEFT JOIN Catalog_Outlet ADDRS ON REQ.Outlet = ADDRS.Id WHERE (REQ.PlanStartDataTime >= @DateStart AND REQ.PlanStartDataTime < @DateEnd AND REQ.Status == @StatusComp)";
	if (searchText != null && searchText != ""){
		searchtail = "AND  Contains(CUST.Description, @SearchText)";
		//searchtail = " AND CUST.Description LIKE @SearchText";
		//AND  Contains(CUST.Description, @SearchText)
		q.AddParameter("SearchText", searchText);
		qtext = qtext + searchtail;
	}
	q.Text = qtext + "  ORDER BY REQ.PlanStartDataTime";
	q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));
	//Dialog.Debug(q.ExecuteCount());
	if (getCount == 0) {
		var c = q.Execute();
		return c; 
	} else {
		return q.ExecuteCount();
	}
}
	
function SetBeginDate() {
	var header = Translate["#enterDateTime#"];
	if($.Exists("filterStart") && $.filterStart != null){
		Dialog.ShowDateTime(header, $.filterStart, SetBeginDateNow);
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
		Dialog.ShowDateTime(header,  $.filterStop, SetEndDateNow);
	} else {
		Dialog.ShowDateTime(header, SetEndDateNow);
	}
}

function SetEndDateNow(key) {
	$.endDate.Text = filterDate(key);
	$.Remove("filterStop");
	$.AddGlobal("filterStop", EndOfDay(key));
	//Dialog.Debug(BegOfDay(key));
	Workflow.Refresh([]);
}

function GetAllActiveTaskDetails(searchtext, dtstart, dtstop){
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
	
	q.Text = qtext + "  ORDER BY REQ.PlanStartDataTime";
	q.AddParameter("StatusProc", DB.Current.Constant.VisitStatus.Processing);
	q.AddParameter("StatusEx", DB.Current.Constant.VisitStatus.Expected);
	var c = q.Execute();
	//Dialog.Debug(c);
	return c; 
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

function filterDate(dt){
	if (dt != null){
		return String.Format("{0:dd MMMM yyyy}", DateTime.Parse(dt));
	} else {
		return "";
	}
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

function findtodaytext(key){
	$.Remove("searchToDay");
	$.AddGlobal("searchToDay", key);
	Workflow.Refresh([]);
}

function findinalltext(key){
	$.Remove("searchAll");
	$.AddGlobal("searchAll", key);
	Workflow.Refresh([]);
}
//-----------------------------code from Masha----------------------------
      function SetListType() {
    if ($.Exists("visitsType") == false)
        $.AddGlobal("visitsType", "planned");
    else
        return $.visitsType;
}

function ChangeListAndRefresh(control) {
    $.Remove("visitsType");
    $.AddGlobal("visitsType", control);
    Workflow.Refresh([]);
}


