
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

//����� ��������� ��� �������� � ������� ��� ������ ����������
function checkUsr(){
	var mskCO = '@ref[Catalog_Departments]:4859e3db-e14d-11dc-93e2-000e0c3ec513';
	var userObject = $.common.UserRef;
	return isInDepartment(mskCO, userObject.Department);	
}

function isInDepartment(valCheck, val){
	Console.WriteLine("valCheck " + valCheck);
	Console.WriteLine("val " + val);
	if (val != valCheck){
		if (val.Parent !=  DB.EmptyRef("Catalog_Departments") && val !=  DB.EmptyRef("Catalog_Departments")){
			if (val.Parent == valCheck){
				return true;
			} else {
				isInDepartment(valCheck, val.Parent);
			}
		} else {
			return false;
		}
	} else{
		return true;
	}		
}
