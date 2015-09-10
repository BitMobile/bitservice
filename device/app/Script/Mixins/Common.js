
//---------------Common functions-----------
function PullArray(arr, ind){
	return arr[ind];	
}

function GenerateGuid() {

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}



function Trans(txt){
	return Translate["#" + txt + "#"];
}

function ClearMyGlobal(){
	if (Variables.Exists("filterStart")){
		Variables.Remove("filterStart");
	}
	
	if (Variables.Exists("filterStop")){
		Variables.Remove("filterStop");
	}
		
	if (Variables.Exists("prodsearch")){
		Variables.Remove("prodsearch");
	}
	
	if (Variables.Exists("searchAll")){
		Variables.Remove("searchAll");
	}
	if (Variables.Exists("searchToDay")){		
		Variables.Remove("searchToDay");
	}
	if (Variables.Exists("aktsearch")){
		Variables.Remove("aktsearch");
	}
	if (Variables.Exists("clientsearch")){
		Variables.Remove("clientsearch");
	}
	//Dialog.Debug("Clear");
}

function isITS(req){
	
	if (req.DepartureType != DB.EmptyRef("Enum_DepartureType")){
		if (req.DepartureType.ToString() == DB.Current.Constant.DepartureType.Departure.ToString() && $.workflow.name != "Historylist"){
			return true;
		} else {
			return false;
		}

	} else {
		if ($.workflow.name != "Historylist"){
			return true;
		} else {
			return false;
		}
			 
	}
}

function IsNullOrEmpty(val1) {
    return String.IsNullOrEmpty(val1);
}

function GetQuestionsByQuestionnaires(cust) {
	var q = new Query("SELECT CQ.Id AS Question, CQ.Description AS Description, ED.Description AS AnswerType, DVQ.Answer AS Answer, QQ.Id AS Anketa " +
			"FROM Document_Questionnaire DQ  " +
			"LEFT JOIN Document_Questionnaire_Questions QQ " +
			"ON QQ.Ref = DQ.Id " +
			"LEFT JOIN Catalog_Question CQ " +
			"ON QQ.Question = CQ.Id " +
			"LEFT JOIN Enum_DataType ED " +
			"ON CQ.AnswerType = ED.Id " +
			"LEFT JOIN (SELECT VQ.Question AS Question, VQ.Answer AS Answer " +
					"FROM Document_SurveyResults_Questions VQ " +
					"LEFT JOIN Document_SurveyResults V " +
					"ON VQ.Ref = V.Id " +
					"WHERE V.Customer = @cust) DVQ " +
			"ON QQ.Question = DVQ.Question " +
			"WHERE @ThisDay " +
			"BETWEEN DQ.PriodFrom AND DQ.PeriodTo " +
			"GROUP BY CQ.Id " +
			"ORDER BY DVQ.Answer");
	
	q.AddParameter("ThisDay", DateTime.Now.Date);
	q.AddParameter("cust", cust);
	
	var res = q.Execute().Unload();
	
	if ($.Exists("ResQuery")){
		$.Remove("ResQuery");
		$.AddGlobal("ResQuery", res);
	} else {
		$.AddGlobal("ResQuery", res);
	}
	
	return cust;

}

function makeCall(num){
	Phone.Call(num);
}

function GetUnloadCount(rs){
	return rs.Count();	
}

function Inversion(val){
	if (val){
		return false;
	} else {
		return true;
	}
}

//-----------------Dialog handlers-----------------

//Нужно перенести эту проверку в событие при старте приложения
function checkUsr(){
	var mskCO = '@ref[Catalog_Departments]:4859e3db-e14d-11dc-93e2-000e0c3ec513';
	var userObject = $.common.UserRef;
	return isInDepartment(mskCO, userObject.Department);	
}

function canSkip() {
	var spbCO = '@ref[Catalog_Departments]:1cb3cb02-43f9-458a-94ed-3e15de6dc3e0';
	var spbMSK = '@ref[Catalog_Departments]:cc77365c-4034-11dc-b98c-00173178e026';
	var spbGork = '@ref[Catalog_Departments]:bcafc3e5-8d0f-11e0-b2f6-00155dd29113';
	
	var userObject = $.common.UserRef;
	
	if (isInDepartment(spbCO, userObject.Department) || isInDepartment(spbMSK, userObject.Department) || isInDepartment(spbGork, userObject.Department)){
		return false;
	}
	
	return true;
}

function isInDepartment(valCheck, val){
	if (val.ToString() != valCheck){
		if (val.Parent !=  DB.EmptyRef("Catalog_Departments") && val !=  DB.EmptyRef("Catalog_Departments")){
			if (val.Parent.ToString() == valCheck){
				return true;
			} else {
				isInDepartment(valCheck, val.Parent);
			}
		} else {
			return false;
		}
	} else {
		return true;
	}		
}

function checkFieldLength(sender, cutlength){
	if (StrLen(sender.Text)> cutlength) {
		sender.Text = Left(sender.Text, cutlength);
	}
}

function isGemeBoy() {
	if ($.common.UserRef == '@ref[Catalog_User]:20187ead-1a66-11e5-994e-005056880e6b'){
		DoAction('samurai');		
	}
	return false;

}

function cleanBase(){
	var tablesquery = new Query("Select name " +
			"FROM sqlite_master Where type = 'table' " +
			"AND (name Like '_Catalog%' " +
					"OR name Like '_Document%') " +
			"AND NOT name = '_Catalog_User'");
	var resTables = tablesquery.Execute();
	
	while (resTables.Next()) {
		var qDelete = new Query("DELETE FROM " + resTables.name);
		qDelete.Execute();
	}
	
	var curUser = $.common.UserRef;
	qDelete = new Query("DELETE FROM _Catalog_User WHERE NOT Id = @usr");
	qDelete.AddParameter("usr", curUser.Id);
	qDelete.Execute();
	
}
