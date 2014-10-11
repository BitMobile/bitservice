function OnLoading() { 	  
	 if($.Exists("TempAnswers") == false){
		 $.AddGlobal("TempAnswers", new Dictionary());
	 }
}

function initResQuery(q){
	q.First();
	return q;
}

function onChangeControl(sender,cntrl, isChange){				
	$.TempAnswers[cntrl] = Variables[cntrl].Text;
	$.TempAnswers[isChange] = 1;
}

function onChangeControlInteger(sender,cntrl, isChange){				
	if (!validate(Variables[cntrl].Text, "[0-9]*")){
		Dialog.Message("Разрешен ввод только целых чисел")
	}
	$.TempAnswers[cntrl] = Variables[cntrl].Text;
	$.TempAnswers[isChange] = 1;
}

function RollBackAdnBack(){
	$.Remove("TempAnswers"); 
	//GetQuestionsByQuestionnaires($.cust);
	Workflow.Back();
}



function FillTempAnswers(control, val, quest, ind, isChange){
	//Помечаем все вопросы как измененные
	if ($.TempAnswers.HasValue(isChange) == false){
		$.TempAnswers.Add(isChange, 0);
	}
	//Сохранение ссылки на вопрос
	if ($.TempAnswers.HasValue(ind) == false){
		$.TempAnswers.Add(ind, quest);
	}
	//Сохранение ответов на вопросы
	if ($.TempAnswers.HasValue(control) == true){
		return $.TempAnswers[control];
	} else {
		$.TempAnswers.Add(control, val);
		return $.TempAnswers[control];
	}	
}

function SaveAnswersAndForward(p1, p2){
	//Dialog.Debug($.questions.Count());
	var cnt = "";
	var quest = "";
	var changed = false;
	for (i = 0; i <= $.questions.Count()-1; i++){
		cnt = "control"+ i;
		quest = "q"+ i;
		changed = "isChange" + i;
		if($.TempAnswers[cnt] != null && $.TempAnswers[changed] == 1){
			if (!IsBlankString($.TempAnswers[cnt].toString())){
				InsertAnswer(p2, $.TempAnswers[quest], $.TempAnswers[cnt], p1);
				changed = true;
			}		
		}
	}
	$.Remove("TempAnswers");
	if (changed) {// Если что то записывалость по перевыбираем запрос
		GetQuestionsByQuestionnaires(p2);
	}	
	DoAction("GoForward", p1, p2);
}

function SaveSurveyIntoVisit(refSurvey, refVisit){
	var q = new Query("SELECT Id " +
			"FROM Document_Visit_Questionnaires " +
			"WHERE Ref = @rVisit " +
			"AND Questionnaire = @rSurvey");
	q.AddParameter("rVisit", refVisit);
	q.AddParameter("rSurvey", refSurvey);
	
	var res = q.ExecuteScalar();
	
	if (res == null){
		var obj = DB.Create("Document.Visit_Questionnaires");
		obj.Ref = refVisit;
		obj.Questionnaire = refSurvey;
		obj.Save(false);
	}
	
}

function InsertAnswer(cust,quest, answer, visit){
	// Get SurveyResults
	var qAnkets = new Query("SELECT DQ.Id AS Anketa " +
			"From Document_Questionnaire DQ " +
			"LEFT JOIN Document_Questionnaire_Questions DQQ " +
			"ON DQQ.Ref = DQ.Id " +
			"WHERE DQQ.Question = @quest " +
			"AND datetime('now') BETWEEN datetime(DQ.PriodFrom, 'start of day') AND datetime(DQ.PeriodTo, 'start of day', '+1 days')");
	
	qAnkets.AddParameter("quest", quest);
	
	var res = qAnkets.Execute();
	
	while (res.Next()){
		var refSR = SurveyExists(res.Anketa, cust);
		if (refSR == null){//если ответника нет создаем его
				var objSRres = DB.Create("Document.SurveyResults");
				objSRres.Customer = cust;
				objSRres.Questionnaire = res.Anketa;
				objSRres.Date = CurrentDate();
				objSRres.Save(false);
				
				 //Create answers
				var objQuest = DB.Create("Document.SurveyResults_Questions");
				objQuest.Ref = objSRres.Id;
				objQuest.Question = quest;
				objQuest.Answer = answer;
				objQuest.Save(false);
				SaveSurveyIntoVisit(objSRres.Id, visit);
		} else {
			var obj =  QuestionInSurvey(refSR, quest)
			if (obj == null){
				var objQuest = DB.Create("Document.SurveyResults_Questions");
				objQuest.Ref = refSR;
				objQuest.Question = quest;
				objQuest.Answer = answer;
				objQuest.Save(false);
			} else {
				var objQuest = obj.GetObject();
				objQuest.Ref = refSR;
				objQuest.Question = quest;
				objQuest.Answer = answer;
				objQuest.Save(false);
			}
			SaveSurveyIntoVisit(refSR, visit);
		}
		
	}
	
}

function QuestionInSurvey(srs, quest){
	var q = new Query("SELECT DSRq.Id " +
			"FROM Document_SurveyResults_Questions DSRQ " +
			"WHERE DSRQ.Question = @quest " +
			"AND DSRQ.Ref = @srs");
	q.AddParameter("quest", quest);
	q.AddParameter("srs", srs);
	
	var res = q.ExecuteScalar();
	return res;
}

function SurveyExists(ank, cust){
	var q = new Query("SELECT DSR.Id " +
			"FROM Document_SurveyResults DSR " +
			"WHERE DSR.Questionnaire = @ank " +
			"AND DSR.Customer = @cust");
	q.AddParameter("cust", cust);
	q.AddParameter("ank", ank);
	
	var res = q.ExecuteScalar();
	return res;
}

function SetDate(cont, isChange) {
	var header = Translate["#enterDateTime#"];
	Dialog.ShowDateTime(header, SetDateNow, [cont, isChange]);	
}

function SetDateNow(key, control, isChange){
	$.TempAnswers[control[0]] = key;
	Variables[control[0]].Text = key;
	$.TempAnswers[control[1]] = 1;
} 

function SetSelection(control, question, isChange){
	
	var q = new Query("SELECT Id, Value " +
			"FROM Catalog_Question_ValueList " +
			"WHERE Ref = @quest");
	
	q.AddParameter("quest", question);	
	var res = q.Execute().Unload();
	
	var arr = [];	
	while (res.Next()){
		arr.push([res.Value, res.Value]);
	}
	Dialog.Select("#SelectAnswer#", arr, SetSelectionNow, [control, isChange]);
}

function SetSelectionNow(key, control, isChange) {
	$.TempAnswers[control[0]] = key;
	Variables[control[0]].Text = key;
	$.TempAnswers[control[1]] = 1;
}

function SetBoolean(control, isChange){
	var Cunt =[];
	Cunt.push(["ДА", "ДА"]);
	Cunt.push(["НЕТ", "НЕТ"]);
	Dialog.Select("#answer#", Cunt, SetBooleanNow, [control, isChange]);
}

function SetBooleanNow(key, control){
	Console.WriteLine("control:" + control[0] + " change " + control[1]);
	$.TempAnswers[control[0]] = key;
	Variables[control[0]].Text = key;
	$.TempAnswers[control[1]] = 1;
}

function ViewAnswers(Questions){
	Dialog.Debug(Questions.Description + " " + Questions.Answer);
}

function FillValueAndtext(vl, control){ //Поставить тикет Саше пытались передать параметры вида: question.Value
	
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

function CreateAnswerQuestionValueIfNotExists(cust, question, an) {	
	
	
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

// +++ MultiList
function MakeChoose(control, variant, parcontrol){
	
	if (Variables[control].Visible == true){
		Variables[control].Visible = false;
		$.TempAnswers[parcontrol] = StrReplace($.TempAnswers[parcontrol], Variables[variant].Text + ";", ""); 
	} else {
		Variables[control].Visible = true;
		$.TempAnswers[parcontrol] = $.TempAnswers[parcontrol] + " " + Variables[variant].Text +";"; 
	}
	
}

function makeVisible(variant) {

	if ($.tempString != null){
		if (Find($.tempString, variant) > 0){
				var rm = StrReplace($.tempString, variant + ";", "");
				$.Remove("tempString");
				$.Add("tempString", rm);
				return true;
			} else {
				return false;
			}
	} else {
		
		return false;
	}
		
}

function makeFreeVisible() {
	if ($.tempString != null){
		if (IsBlankString($.tempString)){
			return false;
		} else {
			return true;
		}
	} else {
		
		return false;
	}
	
}

function OdnoglazayaZmeya(parcontrol) {
	if ($.tempString != null){
		if (IsBlankString($.tempString)){
			return "";
		} else {
			s = $.tempString;			
			$.Remove("tempString");
			$.Add("tempString", $.TempAnswers[parcontrol]);
			ss = TrimAll(StrReplace(s, ";", ""));			
			$.TempAnswers[parcontrol] = StrReplace($.TempAnswers[parcontrol], TrimAll(ss)+";", "");			
			return ss;
		}
	} else {
		
		return "";
	}
	
}

function FreeChoose(parcontrol){
	Console.WriteLine(Variables["Free"].Visible);
	Console.WriteLine($.TempAnswers[parcontrol]);
	Console.WriteLine(Variables["MemoFree"].Text);
	//Console.WriteLine(IsBlankString($.TempAnswers[parcontrol]));
	//Console.WriteLine(IsBlankString(Variables["MemoFree"].Text));
	if (Variables["Free"].Visible == true){
		
		Variables["Free"].Visible = false;
		Variables["FreeField"].Visible = false;
		Variables["MemoFree"].Text = "";
//		if($.TempAnswers[parcontrol] != null  && Variables["MemoFree"].Text != null && $.TempAnswers[parcontrol] != ""  && Variables["MemoFree"].Text != ""){
//			$.TempAnswers[parcontrol] = StrReplace($.TempAnswers[parcontrol], Variables["MemoFree"].Text + ";", "");
//		}
		
	} else {
		Variables["Free"].Visible = true;
		Variables["FreeField"].Visible = true;
		
	}
}


function GetValues(quest, parcontrol){
	$.Add("tempString", $.TempAnswers[parcontrol]);
	$.Add("RollString", $.TempAnswers[parcontrol]);
	var q = new Query("SELECT Id, Value " +
			"FROM Catalog_Question_ValueList " +
			"WHERE Ref = @quest");
	
	q.AddParameter("quest", quest);	
	return q.Execute().Unload();	
}

function SaveValueAndBack(parcontrol, isChange){
	if (Variables.Exists("Free") == true){
		if (Variables["Free"].Visible == true && !IsBlankString(Variables["MemoFree"].Text)){
			$.TempAnswers[parcontrol] = TrimAll($.TempAnswers[parcontrol]) + " " + TrimAll(Variables["MemoFree"].Text)+";";
		} 
	}
	$.TempAnswers[isChange] = 1;
	$.Remove("tempString");
	$.Remove("RollString");
	Workflow.BackTo("Questions");
}
 
function RollBackAndBack(parcontrol) {
	$.TempAnswers[parcontrol] = $.RollString;
	$.Remove("tempString");
	$.Remove("RollString");
	Workflow.BackTo("Questions");
}

