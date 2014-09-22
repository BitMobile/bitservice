// ------------------------ Main screen module ------------------------

function CloseMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}

function OpenMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}

//----------------Begin Info Block Visit---------------------------------
function GetToDayUnDoneRequestsCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query();
	var qtext = "SELECT CUST.Description AS CustName,  ADDRS.Address AS Addr, REQ.PlanStartDataTime AS Start, REQ.PlanEndDataTime AS Stop, REQ.Id AS Ind FROM Document_Visit REQ LEFT JOIN Catalog_Customer CUST ON REQ.Customer = CUST.Id LEFT JOIN Catalog_Outlet ADDRS ON REQ.Outlet = ADDRS.Id WHERE REQ.PlanStartDataTime >= @DateStart AND REQ.PlanStartDataTime < @DateEnd AND REQ.Status <> @StatusComp AND REQ.Status <> @StatusEx";
	q.Text = qtext; 
	q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.VisitStatus.Expired);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));
	return q.ExecuteCount();
	
}

function GetToDayDoneRequestCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query();
	var qtext = "SELECT CUST.Description AS CustName,  ADDRS.Address AS Addr, REQ.PlanStartDataTime AS Start, REQ.PlanEndDataTime AS Stop, REQ.Id AS Ind FROM Document_Visit REQ LEFT JOIN Catalog_Customer CUST ON REQ.Customer = CUST.Id LEFT JOIN Catalog_Outlet ADDRS ON REQ.Outlet = ADDRS.Id WHERE REQ.PlanStartDataTime >= @DateStart AND REQ.PlanStartDataTime < @DateEnd AND REQ.Status == @StatusComp";
	q.Text = qtext;
	q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("DateStart", DateTime.Now.Date);
	q.AddParameter("DateEnd", DateTime.Now.Date.AddDays(1));
	//Dialog.Debug(q.ExecuteCount());
	return q.ExecuteCount();
}

function GetToDayUnDoneRequestsMonthCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query();
	var qtext = "SELECT Id FROM Document_Visit WHERE Document_Visit.PlanStartDataTime >= @DateStart AND Document_Visit.PlanStartDataTime < @DateEnd AND Document_Visit.Status <> @StatusComp AND Document_Visit.Status <> @StatusEx";
	q.Text = qtext; 
	q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("StatusEx", DB.Current.Constant.VisitStatus.Expected);
	q.AddParameter("DateStart", GetBeginOfCurrentMonth());
	q.AddParameter("DateEnd", GetEndOfCurrentMonth());
	//Dialog.Debug(GetBeginOfCurrentMonth() + " - " + GetEndOfCurrentMonth());
	return q.ExecuteCount();
	
}


function GetToDayDoneRequestMonthCount(){//(searchText - строка поиска, getCount - получать ли количество[1-ДА,0-НЕТ])
	var q = new Query();
	var qtext = "SELECT Id FROM Document_Visit WHERE Document_Visit.PlanStartDataTime >= @DateStart AND Document_Visit.PlanStartDataTime < @DateEnd AND Document_Visit.Status == @StatusComp";
	q.Text = qtext;
	q.AddParameter("StatusComp", DB.Current.Constant.VisitStatus.Completed);
	q.AddParameter("DateStart", GetBeginOfCurrentMonth());
	q.AddParameter("DateEnd", GetEndOfCurrentMonth());
	//Dialog.Debug(q.ExecuteCount());
	return q.ExecuteCount();
}

function GetBeginOfCurrentMonth(){
	var mth = "";
	if (DateTime.Now.Month < 10){
		mth = "0"+ DateTime.Now.Month;
	} else {
		mth = DateTime.Now.Month;
	}
	return "01." + mth + "." + DateTime.Now.Year + " 00:00:00";
}

function GetEndOfCurrentMonth(){
	var mth = "";
	if (DateTime.Now.Month < 10){
		mth = "0"+ DateTime.Now.Month;
	} else {
		mth = DateTime.Now.Month;
	}
	return DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month) + "." + mth + "." + DateTime.Now.Year + " 00:00:00";
}
//----------------End Info Block Visit---------------------------------