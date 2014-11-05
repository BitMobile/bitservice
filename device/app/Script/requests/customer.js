function CheckParamsFilling(sender, cust, pr){
	q = new Query("SELECT Id " +
			"FROM Catalog_Customer_KindOfActivity " +
			"WHERE Catalog_Customer_KindOfActivity.Ref == @currentCustomer");
	q.AddParameter("currentCustomer", cust);
	res = q.ExecuteCount();
	if (!isITS(pr)||(res > 0 && cust.FinDirExist != DB.EmptyRef("Enum_LogicType") && cust.DigitPeopleCount > 0)){//&& cust.PeapleCount != DB.EmptyRef("Enum_PeopleCountVarint")
		obj = cust.GetObject();
		obj.Save(false);
		if ($.ResQuery.Count() > 0 && $.workflow.name != "Historylist"){
			Workflow.Action("GoForwardQ",[pr, cust]);
		} else {
			Workflow.Action("GoForward",[pr, cust]);
		}
		
	} else {
		Dialog.Message("Не все параметры заполнены. Необходимо заполнить для продолжения работы");
	}
}

function makeContactCall(contact){
	var tel = contact.PhoneCountryCode + contact.PhoneCityCode + contact.PhoneNumber + contact.PhoneInternalCode;
	Dialog.Question("#call# "+ tel + "?", PhoneCall, tel);	
}

function MoreMakeContactCall(tel){
	Dialog.Question("#call# "+ tel + "?", PhoneCall, tel);
}

function PhoneCall(answ, tel){
	if (answ == DialogResult.Yes) {
		//Console.WriteLine(tel);
		Phone.Call(tel);
	}
}


function numberExists(contact){
	var tel = contact.PhoneCountryCode + contact.PhoneCityCode + contact.PhoneNumber + contact.PhoneInternalCode;
	if (String.IsNullOrEmpty(tel)){
		return false;
	} else {
		return true;
	}
}

function GetVal(t){
	Dialog.Debug(t);
	return t;
}

function SaveCustomerAndBack(){
	obj = $.currentCustomer.GetObject();
	obj.Save(false);
	Workflow.Back();
}

function inintvalues(p){
	if ($.Exists("searchtext") == false){
		$.AddGlobal("searchtext", null);
	} 
	//Dialog.Debug(searchtext);
	return p;
}

function findtext(key,pr){
	$.Remove("searchtext");
	$.AddGlobal("searchtext", key);
	Workflow.Refresh([pr]);
}
function GetCurrentRequest(cust){
	//Dialog.Debug(cust);
	var q = new Query("Select * FROM Document_Visit WHERE Document_Visit.Id == @cst");
	q.AddParameter("cst", cust);
	return q.Execute();
}

function GetContacts(objCust) {
	var q = new Query("Select * FROM Catalog_Contact WHERE Catalog_Contact.Owner == @cust AND Catalog_Contact.Fired == 0 ");
	q.AddParameter("cust", objCust);
	
	var u = q.Execute();
	
	//Dialog.Debug(u.Id);
	return u
}

function GetContact(curContact) {
	//Dialog.Debug(curContact);
	var q = new Query("Select Id FROM Catalog_Contact WHERE Id == @curContact");
	q.AddParameter("curContact", curContact);
	return q.ExecuteScalar();
}

function GetActivities(currentCustomer) {
	//Dialog.Debug(currentCustomer);
	var q = new Query("Select * FROM Catalog_Customer_KindOfActivity WHERE Catalog_Customer_KindOfActivity.Ref == @currentCustomer AND Catalog_Customer_KindOfActivity.DelMark = 0");
		q.AddParameter("currentCustomer", currentCustomer);
	return q.Execute();
	
}

function GetActivitiesCount(currentCustomer) {
	var q = new Query("Select * FROM Catalog_Customer_KindOfActivity WHERE Catalog_Customer_KindOfActivity.Ref == @currentCustomer AND Catalog_Customer_KindOfActivity.DelMark = 0");
	q.AddParameter("currentCustomer", currentCustomer);
	var u = q.ExecuteCount();
	
	//Dialog.Debug(u);
	
	return u;		
}

function GetAllActivities(customer, searchText) {
	 var q = new Query();
	 var qtext = "SELECT  DISTINCT(K.Id) AS Id, K.Description AS DesAct"
		        + " FROM Catalog_KindOfActivity K"
		        + " LEFT JOIN Catalog_Customer_KindOfActivity C ON K.Id = C.Kind AND C.Ref = @customer "
		        + " WHERE (C.Ref IS NULL OR C.DelMark == 1) ";
	 if (searchText != "" && searchText != null) {
			var plus = " AND Contains(K.Description, @st) ";			
			qtext = qtext + plus;
			q.AddParameter("st", searchText);
		}
	// Dialog.Debug(searchText);
	 q.Text = qtext + " ORDER BY K.Description";  
	 q.AddParameter("customer", customer);
	 return q.Execute();
}

function GetAllActivitiesCount(customer) {
	var q = new Query("SELECT K.Id, K.Description AS DesAct " +
			"FROM Catalog_KindOfActivity K " +
			"LEFT JOIN Catalog_Customer_KindOfActivity C " +
			"ON K.Id=C.Kind " +
			"WHERE C.Ref IS NULL OR C.Ref <> @customer OR C.DelMark == 1 " +
			"ORDER BY DesAct ASC");
	q.AddParameter("customer", customer);
	var u = q.ExecuteCount();
	return u;		
}

function ParsLastNameMiddlName(fm){
	var trFM = TrimL(fm);
	var charCount = StrLen(trFM);
	var charPosition = Find(trFM, " ");
	
	if(charPosition > 0){
		var firstName = Left(trFM, charPosition-1);
		var middleName = Right(trFM, charCount - charPosition);
	}else {
		var firstName = trFM;
		var middleName = "";
	}
	
	var someArray = [];
	someArray.push(firstName);
	someArray.push(middleName);
    return someArray;
	
	//Dialog.Debug(firstName);
	//Dialog.Debug(middleName);		
}

function DoSelectPos() {
    var query = new Query();
    query.Text = "SELECT Id, Description FROM Catalog_ContactPosition ORDER BY Description ASC";
    Dialog.Select("#select_answer#", query.Execute(), SetPosition);
    return;
}

function SetPosition(key){
	if ($.Exists("SelectedPosition") == true){
		$.Remove("SelectedPosition");
		$.Add("SelectedPosition", key);
	}else{
		$.Add("SelectedPosition", key);
	} 
	$.position.Text = key.Description;
}

function CreateContact(customer, lastName, firstName_middleName, telFull, position) {

	var firstName = "";  
	var middleName = "";
	var PhoneNumber = "";
	// парсинг ИмяОтчество
	if (firstName_middleName != "" && firstName_middleName != null){
		var parsfirstName_middleName = ParsLastNameMiddlName(firstName_middleName);
		var firstName = parsfirstName_middleName[0];
		var middleName = parsfirstName_middleName[1];
	}
	
/////////////////////////////////////////////////////////
	// парсинг номера телефона
	// var res = StrReplace("Str",[^0-9],"");
	if (telFull != "" && telFull != null) {
			var PhoneCountryCode = "";
			var PhoneCityCode = "";
			var PhoneNumber = "";
			var PhoneInternalCode = "";
		
			var editTel = "";
			var plusFind = 0;
			var telFullCharCount = StrLen(telFull);
		
			for (var tChar = 1; tChar <= telFullCharCount; tChar++) {
				var nextChar = Mid(telFull, tChar, 1);
				if ((nextChar == "+" && plusFind == 0) || nextChar == "0"
						|| nextChar == "1" || nextChar == "2" || nextChar == "3"
						|| nextChar == "4" || nextChar == "5" || nextChar == "6"
						|| nextChar == "7" || nextChar == "8" || nextChar == "9") {
					editTel = editTel + nextChar;
					if (nextChar == "+") {
						plusFind = 1;
					}
				}
			}
		
			// Dialog.Debug(plusFind);
		
			if (StrLen(editTel) >= 11 || (StrLen(editTel) >= 12 && plusFind == 1)) {
				if (plusFind == 1) {
					if (StrLen(editTel) >= 12){
						PhoneCountryCode = Mid(editTel, 1, 2);
						PhoneCityCode = Mid(editTel, 3, 3);
						PhoneNumber = Mid(editTel, 6, 7);
						PhoneInternalCode = Right(editTel, StrLen(editTel) - 12);
					} else{
						PhoneCountryCode = Mid(editTel, 1, 1);
						PhoneCityCode = Mid(editTel, 2, 3);
						PhoneNumber = Mid(editTel, 5, 7);
						PhoneInternalCode = Right(editTel, StrLen(editTel) - 11);
					}
				} else {
					PhoneCountryCode = Mid(editTel, 1, 1);
					PhoneCityCode = Mid(editTel, 2, 3);
					PhoneNumber = Mid(editTel, 5, 7);
					PhoneInternalCode = Right(editTel, StrLen(editTel) - 11);
				}
			} else {
				PhoneNumber = editTel;
			}
	}
//////////////////////////////
	// запись
	
	
	if ((lastName != null && lastName != "") || (firstName != null && firstName != "")){
		var contact = DB.Create("Catalog.Contact");
		contact.Owner = customer;
		contact.Description = String.Format("{0} {1} {2}", lastName, firstName, middleName); // НАДО ЛИЗАПИСЫВАТЬ ДЕСКРИПШОН?????
		contact.LastName = lastName;
		contact.FirstName = firstName;
		contact.MiddleName = middleName;
		
		if ($.SelectedPosition != null){	
			contact.Position = $.SelectedPosition;
		}
		
		contact.PhoneCountryCode = PhoneCountryCode;
		contact.PhoneCityCode = PhoneCityCode;
		contact.PhoneNumber = PhoneNumber;
		contact.PhoneInternalCode = PhoneInternalCode;
		contact.MainContact = 0;
	
		contact.Save(false);
	
		Workflow.Back();
	} else{		
		Dialog.Message(Translate["#nonamecontact#"]);
	}

}

function GetCurPosition(curContact) {
	$.Add("SelectedPosition",curContact.Position);
	//Dialog.Debug($.SelectedPosition);
	return curContact;
}

function EditContact(customer, lastName, firstName_middleName, telFull, position, contact) {
	//Dialog.Debug(IsBlankString(lastName));
	// парсинг ИмяОтчество
	var parsfirstName_middleName = ParsLastNameMiddlName(firstName_middleName);
	var firstName = parsfirstName_middleName[0];
	var middleName = parsfirstName_middleName[1];

	// парсинг номера телефона
	// var res = StrReplace("Str",[^0-9],"");
	var PhoneCountryCode = "";
	var PhoneCityCode = "";
	var PhoneNumber = "";
	var PhoneInternalCode = "";

	var editTel = "";
	var plusFind = 0;
	var telFullCharCount = StrLen(telFull);

	for (var tChar = 1; tChar <= telFullCharCount; tChar++) {
		var nextChar = Mid(telFull, tChar, 1);
		if ((nextChar == "+" && plusFind == 0) || nextChar == "0"
				|| nextChar == "1" || nextChar == "2" || nextChar == "3"
				|| nextChar == "4" || nextChar == "5" || nextChar == "6"
				|| nextChar == "7" || nextChar == "8" || nextChar == "9") {
			editTel = editTel + nextChar;
			if (nextChar == "+") {
				plusFind = 1;
			}
		}
	}

	// Dialog.Debug(plusFind);

	if (StrLen(editTel) >= 11 || (StrLen(editTel) >= 12 && plusFind == 1)) {
		if (plusFind == 1) {
			if (StrLen(editTel) >= 12){
				PhoneCountryCode = Mid(editTel, 1, 2);
				PhoneCityCode = Mid(editTel, 3, 3);
				PhoneNumber = Mid(editTel, 6, 7);
				PhoneInternalCode = Right(editTel, StrLen(editTel) - 12);
			} else{
				PhoneCountryCode = Mid(editTel, 1, 1);
				PhoneCityCode = Mid(editTel, 2, 3);
				PhoneNumber = Mid(editTel, 5, 7);
				PhoneInternalCode = Right(editTel, StrLen(editTel) - 11);
			}
			
		} else {
			PhoneCountryCode = Mid(editTel, 1, 1);
			PhoneCityCode = Mid(editTel, 2, 3);
			PhoneNumber = Mid(editTel, 5, 7);
			PhoneInternalCode = Right(editTel, StrLen(editTel) - 11);
		}
	} else {
		PhoneNumber = editTel;
	}
	//Dialog.Debug(IsBlankString(lastName));
	// запись
	if ((lastName != null && lastName != "") || (firstName != null && firstName != "")){
	contactObj = contact.GetObject();
	//contact.Owner = customer;
	contact.Description = String.Format("{0} {1} {2}", lastName, firstName, middleName); // lastName + firstName + middleName;
	contactObj.LastName = lastName;
	contactObj.FirstName = firstName;
	contactObj.MiddleName = middleName;
	contactObj.Position = $.SelectedPosition;
	contactObj.PhoneCountryCode = PhoneCountryCode;
	contactObj.PhoneCityCode = PhoneCityCode;
	contactObj.PhoneNumber = PhoneNumber;
	contactObj.PhoneInternalCode = PhoneInternalCode;

	contactObj.Save(false);
	Workflow.Back();
	} else {
		Dialog.Message(Translate["#nonamecontact#"]);
	}
}

function GetActivityCaption(cust){
	var count = GetActivitiesCount(cust);
	var rec = GetActivities(cust);
	var resCount = count - 1;
	
	if (rec.Next()){
		if (resCount > 0){
			if (StrLen(rec.Kind.Description) > 15){
				return Mid(rec.Kind.Description, 1, 15) + "... и еще " + resCount;
			} else {
				return rec.Kind.Description + " и еще " + resCount;				
			}
			
		} else{
			return Mid(rec.Kind.Description, 1, 20);
		}
				
	} else {
		return "Нет видов деятельности";
	}
}

function AddActivity(curCustomer, act){
	var tq = new Query("SELECT KA.Id AS LineID FROM Catalog_Customer_KindOfActivity KA WHERE KA.Kind == @act AND KA.Ref = @cust");
	tq.AddParameter("cust", curCustomer);
	tq.AddParameter("act", act);
	rtq = tq.ExecuteScalar();
	
	if(rtq != null){
		obj = rtq.GetObject();
		obj.DelMark = 0;
		obj.Save(false);
	} else {	
		var q = new Query("SELECT LineNumber FROM Catalog_Customer_KindOfActivity WHERE Catalog_Customer_KindOfActivity.Ref == @curCust ORDER BY Catalog_Customer_KindOfActivity.LineNumber DESC");
		q.AddParameter("curCust",curCustomer);
		count = q.ExecuteScalar();
		
		var curAct = DB.Create("Catalog.Customer_KindOfActivity");
		curAct.Ref = curCustomer;
		curAct.LineNumber = count + 1;
		//curAct.LineId = GenerateGuid();
		curAct.Kind = act;
		curAct.DelMark = false;
	    
		curAct.Save(false);
	}
//	Dialog.Debug(curCustomer);
//	Dialog.Debug(act);
	Workflow.Back();
}

function KillContact(contact, objCust){
	obj = contact.GetObject();
	obj.Fired = true;
	obj.Save(false);
	
	// DB.Delete(contact);
	 Workflow.Refresh([objCust]);
}

function KillAct(act, currentCustomer){
	obj = act.GetObject();
	obj.DelMark = true;
	obj.Save(false);
	//DB.Delete(act);
	 Workflow.Refresh([currentCustomer]);
}


function DoBackToRecv(){
	Workflow.BackTo("requests");
}

function DoBackAndClean(){
	$.Remove("refStatus");
	$.Remove("faktEnd");
	$.Remove("faktStart");
	$.Remove("ResQuery");
	ClearMyGlobal();
	Workflow.Back();
	DB.Rollback();
}

function initsearch() {
	if ($.Exists("aktsearch") == false){
		//Dialog.Debug("Init");
		$.AddGlobal("aktsearch", null);		
	}
}

function DoSearch(srchstr, p1){
	$.Remove("aktsearch");
	//Dialog.Debug(srchstr);
	if (srchstr != "" || srchstr != null){
		$.AddGlobal("aktsearch", srchstr);
	} else {
		$.AddGlobal("aktsearch", null);
	}
	Workflow.Refresh([p1]);	
}


function GetPeapleCount(request){
	
	var q = new Query("SELECT PC.Description " +
			"FROM  Catalog_Customer C " +
			"JOIN Enum_PeopleCountVarint PC ON C.PeapleCount = PC.Id " +
			"WHERE C.Id == @Cust");
	q.AddParameter("Cust", request);
	c = q.ExecuteScalar();
	if (c == null){
		return " - ";
	} else {
		return Translate["#" + c + "#"];
	}
		
}
function SetDialogPeapleCount(request){
	var Cnt =[];
	Cnt.push([DB.Current.Constant.PeopleCountVarint.from0to50, "0-50"]);
	Cnt.push([DB.Current.Constant.PeopleCountVarint.from51to100, "51-100"]);
	Cnt.push([DB.Current.Constant.PeopleCountVarint.from101to200, "101-200"]);
	Cnt.push([DB.Current.Constant.PeopleCountVarint.from201to1000, "201-1000"]);
	Cnt.push([DB.Current.Constant.PeopleCountVarint.more1000, Translate["#more1000#"]]);
	Dialog.Select("#CountPeaple#", Cnt, SetPeapleCount, request);
}

function SetPeapleCount(Key, request){
	$.PeopleCountField.Text = Translate["#" + Key.Description + "#"];
	obj = request.GetObject();
	obj.PeapleCount = Key;
	obj.Save(false);	
}
//////////////////////////////////////////////////////////////////////////////////
function GetFinDir(request){
	var q = new Query("SELECT LT.Description " +
			"FROM Catalog_Customer C JOIN Enum_Logic3 LT ON C.FinDirExist = LT.Id  " +
			"WHERE C.Id == @Cust");
	q.AddParameter("Cust", request);
	c = q.ExecuteScalar();
	if (c == null){
		return " - ";
	} else {
		return Translate["#" + c + "#"];
	}
		
}
function SetDialogFinDirExist(request){
	var Cunt =[];
	Cunt.push([DB.Current.Constant.Logic3.Yes, "ДА"]);
	Cunt.push([DB.Current.Constant.Logic3.No, "НЕТ"]);
	Cunt.push([DB.Current.Constant.Logic3.NoAnswer, "Отказ"]);
	Cunt.push([DB.EmptyRef("Enum.Logic3"), "Пустое значение"]);
	Dialog.Select("#answer#", Cunt, SetFinDirExist, request);
}

function SetFinDirExist(Key, request){
	var DescKey = "-";
	//Dialog.Debug(Key.Description);
	if (Key.Description != "Description"){
		DescKey = Translate["#" + Key.Description + "#"];
	}
	$.FinDirExist.Text = DescKey;
	
	if (Key == "@ref[Enum_Logic3]:8b052e18-38dc-cdf9-456d-2e7a155dd06d"){
		$.CauseOfFailure.Visible = true;
	} else {
		$.CauseOfFailure.Visible  = false;
	}
	
	obj = request.GetObject();
	obj.FinDirExist = Key;
	obj.Save(false);	
}

function FinDirFailure(Key){
	if (Key == "@ref[Enum_Logic3]:8b052e18-38dc-cdf9-456d-2e7a155dd06d"){
		return true;
	} else {
		return false;
	}
}
	
function DoBackAndCleanAct(){
	$.Remove("aktsearch");
	Workflow.Back();
}

function CheckPeopleCount(){
	if (!validate(Variables["PeopleCountField"].Text, "[0-9]*")){
		Dialog.Message("Разрешен ввод только целых чисел");
	}
	
}