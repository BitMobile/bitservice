﻿function GetQuestionsByQuestionnaires(cust) {
	var q = new Query("SELECT CQ.Id AS Question, CQ.Description AS Description, ED.Description AS AnswerType, DVQ.Answer AS Answer " +
			"FROM Document_Questionnaire_Questions QQ " +
			"INNER JOIN Document_Questionnaire DQ " +
			"ON QQ.Ref = DQ.Id " +
			"INNER JOIN Catalog_Question CQ " +
			"ON QQ.Question = CQ.Id " +
			"INNER JOIN Enum_DataType ED " +
			"ON CQ.AnswerType = ED.Id " +
			"LEFT JOIN (SELECT VQ.Question AS Question, VQ.Answer AS Answer FROM Document_Visit_Questions VQ INNER JOIN Document_Visit V ON VQ.Ref = V.Id WHERE V.Customer = @cust) DVQ " +
			"ON QQ.Question = DVQ.Question " +
			"WHERE @ThisDay " +
			"BETWEEN DQ.PriodFrom AND DQ.PeriodTo " +
			"ORDER BY DVQ.Answer");
	
	q.AddParameter("ThisDay", DateTime.Now.Date);
	q.AddParameter("cust", cust);
	return q.Execute();
}


function ViewAnswers(Questions){
	Dialog.Debug(Questions.Description + " " + Questions.Answer);
}

function FillValueAndtext(vl, control){ //Поставить тикет Саше пытались передать параметры вида: question.Value
	Dialog.Debug(control);
	//Variables[control].Text = vl;
	return vl;
}

function EmptyString(vl){
	if(vl == null || vl == "" ){
		return true;
	}else 
		return false;
}

function test(){
	Dialog.Debug("Yeap!!!")
}

function CreateVisitQuestionValueIfNotExists(cust, question) {	
	var query = new Query("SELECT DVQ.Id " +
			"FROM Document_Visit_Questions DVQ " +
			"INNER JOIN Document_Visit DV" +
			"ON DVQ.Ref = DV.Id " +
			"WHERE DV.Customer == @cust " +
			"AND DVQ.Question == @Question ");
	query.AddParameter("cust", cust);
	query.AddParameter("Question", question);
	var result = query.ExecuteScalar();
	if (result == null) {
		var p = DB.Create("Document.Visit_Questions");
		p.Ref = visit;
		p.Question = question;
		p.Answer = "";
		p.Save();
		result = p.Id;
	}
	return result;

}

///+++ Mary Code +++
//function CreateArray() {
//	return [];
//}
//
//function GetQuesttionaire(outlet, scale) {
//
//	var q1 = new Query(
//			"SELECT Id FROM Document_Questionnaire WHERE OutletType=@type AND OutletClass=@class AND Scale=@scale ORDER BY Date desc");
//	q1.AddParameter("type", outlet.Type);
//	q1.AddParameter("class", outlet.Class);
//	q1.AddParameter("scale", scale);
//
//	return q1.ExecuteScalar();
//
//}
//
//function GetQuestionsByQuestionnaires(outlet) {
//
//	var regionQuest = GetQuesttionaire(outlet,
//			DB.Current.Constant.QuestionnaireScale.Region);
//	var territoryQuest = GetQuesttionaire(outlet,
//			DB.Current.Constant.QuestionnaireScale.Territory);
//	var query = new Query(GetQuestionsQueryText());
//	query.AddParameter("ref1", regionQuest);
//	query.AddParameter("ref2", territoryQuest);
//	Variables.Add("workflow.questions_qty", query.ExecuteCount());
//	return query.Execute();
//}
//
//function GetQuestionsQueryText() {
//	return "SELECT DQQ.LineNumber, DQQ.Question, CQ.Description, ED.Description AS AnswerType, 1 AS T1 FROM Document_Questionnaire_Questions DQQ JOIN Catalog_Question CQ ON DQQ.Question=CQ.Id JOIN Enum_DataType ED ON CQ.AnswerType=ED.Id WHERE Ref=@ref1 UNION ALL SELECT q1.LineNumber, q1.Question, CQ.Description, ED.Description AS AnswerType, 2 AS T1 FROM Document_Questionnaire_Questions q1 LEFT JOIN Document_Questionnaire_Questions q2 ON q2.Question=q1.Question and q2.ref=@ref1 JOIN Catalog_Question CQ ON q1.Question=CQ.Id JOIN Enum_DataType ED ON CQ.AnswerType=ED.Id WHERE q1.Ref =@ref2  and q2.Id is null ORDER BY T1, LineNumber"
//}
//
//function CreateVisitQuestionValueIfNotExists(visit, question, questionValue) {
//
//	var query = new Query(
//			"SELECT Id FROM Document_Visit_Questions WHERE Ref == @Visit AND Question == @Question");
//	query.AddParameter("Visit", visit);
//	query.AddParameter("Question", question);
//	var result = query.ExecuteScalar();
//	if (result == null) {
//		var p = DB.Create("Document.Visit_Questions");
//		p.Ref = visit;
//		p.Question = question;
//		p.Answer = "";
//		p.Save();
//		result = p.Id;
//	}
//	return result;
//
//}
//
//function GetSnapshotText(text) {
//	if (String.IsNullOrEmpty(text))
//		return Translate["#noSnapshot#"];
//	else
//		return Translate["#snapshotAttached#"];
//}
//
//function GoToQuestionAction(answerType, question, visit, control, questionItem) {
//	if (answerType == "ValueList") {
//		var q = new Query();
//		q.Text = "SELECT Value, Value FROM Catalog_Question_ValueList WHERE Ref=@ref";
//		q.AddParameter("ref", questionItem);
//		Global.ValueListSelect(question, "Answer", q.Execute(),
//				Variables[control]);
//	}
//
//	if (answerType == "Snapshot") {
//		GetCameraObject(visit);
//		Camera.MakeSnapshot(SaveAtVisit, [ question, control ]);
//	}
//
//	if (answerType == "DateTime") {
//		if (IsNullOrEmpty(question.Answer))
//			var date = DateTime.Now;
//		else
//			var date = DateTime.Parse(question.Answer);
//		Global.DateTimeDialog(question, "Answer", date, Variables[control]);
//	}
//
//	if (answerType == "Boolean") {
//		Global.BooleanDialogSelect(question, "Answer", Variables[control]);
//	}
//
//}
//
//function SaveAtVisit(arr) {
//	var question = arr[0];
//	var control = arr[1];
//	question = question.GetObject();
//	question.Answer = Variables["guid"];
//	question.Save();
//	Variables[control].Text = Translate["#snapshotAttached#"];
//
//}
//
///*function SaveValue(control, questionValue){
//	questionValue = questionValue.GetObject();
//	questionValue.Save();
//}*/
//
//function GetCameraObject(entity) {
//	FileSystem.CreateDirectory("/private/Document.Visit");
//	var guid = Global.GenerateGuid();
//	Variables.Add("guid", guid);
//	var path = String.Format("/private/Document.Visit/{0}/{1}.jpg", entity.Id,
//			guid);
//	Camera.Size = 300;
//	Camera.Path = path;
//}
//
//function CheckEmptyQuestionsAndForward(visit) {
//
//	var qr = new Query(
//			"SELECT Id FROM Document_Visit_Questions WHERE Answer IS NULL  OR Answer=''");
//	var res = qr.Execute();
//
//	while (res.Next()) {
//		DB.Delete(res.Id);
//	}
//
//	Workflow.Forward([]);
//}
//
//function GetActionAndBack() {
//	if ($.workflow.skipTasks) {
//		Workflow.BackTo("Outlet");
//	} else
//		Workflow.Back();
//}