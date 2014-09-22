function GetCurrentRequest(cust){
	//Dialog.Debug(cust);
	var q = new Query("Select * FROM Document_Visit WHERE Document_Visit.Id == @cst");
	q.AddParameter("cst", cust);
	return q.Execute();
}

function GetContacts(objCust) {
	var q = new Query(
			"Select * FROM Catalog_Contact WHERE Catalog_Contact.Owner == @cust");
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
	var q = new Query("Select * FROM Catalog_Customer_KindOfActivity WHERE Catalog_Customer_KindOfActivity.Ref == @currentCustomer");
		q.AddParameter("currentCustomer", currentCustomer);
	return q.Execute();
	
}

function GetActivitiesCount(currentCustomer) {
	var q = new Query("Select * FROM Catalog_Customer_KindOfActivity WHERE Catalog_Customer_KindOfActivity.Ref == @currentCustomer");
	q.AddParameter("currentCustomer", currentCustomer);
	var u = q.ExecuteCount();
	
	//Dialog.Debug(u);
	
	return u;		
}

function GetAllActivities(customer) {
	var q = new Query("SELECT K.Id, K.Description AS DesAct FROM Catalog_KindOfActivity K LEFT JOIN Catalog_Customer_KindOfActivity C ON K.Id=C.Kind WHERE C.Ref IS NULL OR C.Ref <> @customer ORDER BY DesAct ASC");
	q.AddParameter("customer", customer);
	return q.Execute();
	
}

function GetAllActivitiesCount(customer) {
	var q = new Query("SELECT K.Id, K.Description AS DesAct FROM Catalog_KindOfActivity K LEFT JOIN Catalog_Customer_KindOfActivity C ON K.Id=C.Kind WHERE C.Ref IS NULL OR C.Ref <> @customer ORDER BY DesAct ASC");
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

function DoSelect() {
    var query = new Query();
    query.Text = "SELECT Id, Description FROM Catalog_Position ORDER BY Description ASC";
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
			PhoneCountryCode = Mid(editTel, 1, 2);
			PhoneCityCode = Mid(editTel, 3, 3);
			PhoneNumber = Mid(editTel, 6, 7);
			PhoneInternalCode = Right(editTel, StrLen(editTel) - 12);
		} else {
			PhoneCountryCode = Mid(editTel, 1, 1);
			PhoneCityCode = Mid(editTel, 2, 3);
			PhoneNumber = Mid(editTel, 5, 7);
			PhoneInternalCode = Right(editTel, StrLen(editTel) - 11);
		}
	} else {
		PhoneNumber = editTel;
	}

	// запись
	if (lastName != "" && firstName != ""){
	var contact = DB.Create("Catalog.Contact");
	contact.Owner = customer;
	var descr = String.Format("{0} {1} {2}", lastName, firstName, middleName);
	Dialog.Debug(descr);
	contact.Description = descr;
	//contact.Description = lastName + " " + firstName + " " + middleName; // НАДО ЛИЗАПИСЫВАТЬ ДЕСКРИПШОН????? НАДО!!!
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

	contact.Save(false);
	Workflow.Back();
	} else {
		Dialog.Message(Translate["#nonamecontact#"]);
	}
}

function GetCurPosition(curContact) {
	$.Add("SelectedPosition",curContact.Position);
	//Dialog.Debug($.SelectedPosition);
	return curContact;
}

function EditContact(customer, lastName, firstName_middleName, telFull, position, contact) {
	 if (lastName == "") {
		Dialog.Message("Поле 'Фамилия' не заполнено");
		return;
	}

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
			PhoneCountryCode = Mid(editTel, 1, 2);
			PhoneCityCode = Mid(editTel, 3, 3);
			PhoneNumber = Mid(editTel, 6, 7);
			PhoneInternalCode = Right(editTel, StrLen(editTel) - 12);
		} else {
			PhoneCountryCode = Mid(editTel, 1, 1);
			PhoneCityCode = Mid(editTel, 2, 3);
			PhoneNumber = Mid(editTel, 5, 7);
			PhoneInternalCode = Right(editTel, StrLen(editTel) - 11);
		}
	} else {
		PhoneNumber = editTel;
	}
	//Dialog.Debug(contact);
	// запись
	contactObj = contact.GetObject();
	//contact.Owner = customer;
	//contact.Description = lastName; // lastName + firstName + middleName;
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
}

function GetActivityCaption(cust){
	var count = GetActivitiesCount(cust);
	var rec = GetActivities(cust);
	var resCount = count - 1;
	
	if (rec.Next()){
		return rec.Kind.Description + " и еще " + resCount;		
	} else {
		return "Нет видов деятельности";
	}
}

function AddActivity(curCustomer, act){
	var curAct = DB.Create("Catalog.Customer_KindOfActivity");
	curAct.Ref = curCustomer;
	curAct.Kind = act; 
    
	curAct.Save(false); 
//	Dialog.Debug(curCustomer);
//	Dialog.Debug(act);
	Workflow.Back();
}

function KillContact(contact, objCust){
	 DB.Delete(contact);
	 Workflow.Refresh([objCust]);
}

function KillAct(act, currentCustomer){
	 DB.Delete(act);
	 Workflow.Refresh([currentCustomer]);
}

function DoBackToRecv(){
	Workflow.BackTo("requests");
}