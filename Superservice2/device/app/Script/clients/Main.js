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
	
	var q = new Query("SELECT CUST.Description AS CustName,  ADDRS.Address AS Addr, REQ.PlanStartDataTime AS Start, REQ.PlanEndDataTime AS Stop, REQ.Id AS Ind FROM Document_Visit REQ LEFT JOIN Catalog_Customer CUST ON REQ.Customer = CUST.Id LEFT JOIN Catalog_Outlet ADDRS ON REQ.Outlet = ADDRS.Id WHERE REQ.PlanStartDataTime >= @DateStart AND REQ.PlanStartDataTime < @DateEnd AND REQ.Status != @StatusComp AND REQ.Status != @StatusEx");
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
	var q = new Query("SELECT CUST.Description AS CustName,  ADDRS.Address AS Addr, REQ.PlanStartDataTime AS Start, REQ.PlanEndDataTime AS Stop, REQ.Id AS Ind FROM Document_Visit REQ LEFT JOIN Catalog_Customer CUST ON REQ.Customer = CUST.Id LEFT JOIN Catalog_Outlet ADDRS ON REQ.Outlet = ADDRS.Id WHERE REQ.PlanStartDataTime >= @DateStart AND REQ.PlanStartDataTime < @DateEnd AND REQ.Status == @StatusComp");
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
    Dialog.ShowDateTime(header, SetBeginDateNow);
}

function SetBeginDateNow(key) {
	$.beginDate.Text = key;
}

function SetEndDate() {
	var header = Translate["#enterDateTime#"];
    Dialog.ShowDateTime(header, SetEndDateNow);
}

function SetEndDateNow(key) {
	$.endDate.Text = key;
}

function GetAllActiveTaskDetails(){
	var q = new Query("SELECT CUST.Description AS CustName,  ADDRS.Address AS Addr, REQ.PlanStartDataTime AS Start, REQ.PlanEndDataTime AS Stop, REQ.Id AS Ind FROM Document_Visit REQ LEFT JOIN Catalog_Customer CUST ON REQ.Customer = CUST.Id LEFT JOIN Catalog_Outlet ADDRS ON REQ.Outlet = ADDRS.Id WHERE Status == @StatusProc OR Status == @StatusEx");
	q.AddParameter("StatusProc", DB.Current.Constant.VisitStatus.Processing);
	q.AddParameter("StatusEx", DB.Current.Constant.VisitStatus.Expected);
	var c = q.Execute();
	//Dialog.Debug(c);
	return c; 
}



function PeriodTime(dateStart, dateStop){

	if (dateStop != NULL){
		var p = String.Format("{0:dd.MM 0:hh:mm - 1:hh:mm}", DateTime.Parse(dateStart), DateTime.Parse(dateStop));
	} else {
		var p = String.Format("{0:dd.MM 0:hh:mm}", DateTime.Parse(dateStart));
	}	
	return p;
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


function GetUncommitedScheduledVisits(searchText, getCount) {
    //var q = new Query("SELECT DISTINCT VP.Outlet FROM Document_VisitPlan_Outlets VP LEFT JOIN Document_Visit V ON VP.Outlet=V.Outlet JOIN Catalog_Outlet O ON O.Id = VP.Outlet WHERE  V.Date=@date ORDER BY O.Description LIMIT 100"); //V.Id IS NULL AND
    var q = new Query("SELECT DISTINCT VP.Outlet FROM Document_VisitPlan_Outlets VP JOIN Catalog_Outlet O ON O.Id = VP.Outlet LEFT JOIN Document_Visit V ON VP.Outlet=V.Outlet AND V.Date >= @today AND V.Date < @tomorrow WHERE VP.Date=@date AND V.Id IS NULL ORDER BY O.Description LIMIT 100"); //V.Id IS NULL AND
    q.AddParameter("date", DateTime.Now.Date);
    q.AddParameter("today", DateTime.Now.Date);
    q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
    if (getCount == "1")
        return q.ExecuteCount();
    else {
        var c = q.Execute();
        return c;

    }

}

function GetScheduledVisitsCount() {
    //   return DB.Current.Document.VisitPlan_Outlets.SelectBy("Date", DateTime.Now.Date).Distinct("Outlet").Count();
    var q = new Query("SELECT COUNT(*) FROM Document_VisitPlan_Outlets WHERE Date=@date");
    q.AddParameter("date", DateTime.Now.Date);
    var cnt = q.ExecuteScalar();
    if (cnt == null)
        return 0;
    else
        return cnt;
}

function GetCommitedScheduledVisits(searchText, getCount) {
    //return DB.Current.Document.Visit.SelectBy("Outlet", planOutlets).Where("Date.Date == @p1", [DateTime.Now.Date]).Top(100).OrderBy("OutletAsObject.Description");
    var q = new Query("SELECT DISTINCT VP.Outlet FROM Document_Visit V JOIN Document_VisitPlan_Outlets VP ON VP.Outlet=V.Outlet JOIN Catalog_Outlet O ON O.Id = VP.Outlet WHERE V.Date >= @today AND V.Date < @tomorrow ORDER BY O.Description LIMIT 100");
    q.AddParameter("today", DateTime.Now.Date);
    q.AddParameter("tomorrow", DateTime.Now.Date.AddDays(1));
    if (getCount == "1")
        return q.ExecuteCount();
    else {
        var c = q.Execute();
        return c;
    }

}

function GetOutletsQty() {
    //return DB.Current.Catalog.Territory_Outlets.Select().Distinct("OutletAsObject").Count();
    var q = new Query("SELECT COUNT(*) FROM Catalog_Territory_Outlets");
    var cnt = q.ExecuteScalar();
    if (cnt == null)
        return 0;
    else
        return cnt;
}

function ChangeListAndRefresh(control) {
    $.Remove("visitsType");
    $.AddGlobal("visitsType", control);
    Workflow.Refresh([]);
}

function GetOutlets() {
    //return DB.Current.Catalog.Territory_Outlets.Select().Top(500).OrderBy("OutletAsObject.Description").Distinct("OutletAsObject");
    var q = new Query("SELECT T.Outlet, O.Description, O.Address FROM Catalog_Territory_Outlets T JOIN Catalog_Outlet O ON O.Id=T.Outlet ORDER BY O.Description LIMIT 500");
    return q.Execute();
}
 
function test(p){
	
	 //Dialog.Debug("Yes");
	 return p;
}
