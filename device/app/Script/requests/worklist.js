var swipedItem = undefined;

function GetWorkList(vs){//(vs -передается id визита,gc - 0: вывести результат запроса; 1: Вывести только количество записей в результате)
	var q = new Query("SELECT * FROM Document_Visit_Result WHERE Document_Visit_Result.Ref == @visit");
	q.AddParameter("visit", vs);	
	var rs = q.Execute().Unload();	
	var arr = [];
	arr.push(rs);
	arr.push(rs.Count());	
	return arr;	
}
//+++ For hide swiped
function HideOtherSwiped(sender) {
	if (swipedItem != sender){
		HideSwiped();
		swipedItem = sender;			
	}	
}

function HideSwiped(){
	if (swipedItem != undefined){
		swipedItem.Index = 0;
	}
}
//--- For hide swiped

function KillWork(work_id, param){
	DB.Delete(work_id);
	Workflow.Refresh([param]);
}

function isProgress(obj){
	//Dialog.Debug(obj);
	if (obj.ToString() == (DB.Current.Constant.VisitStatus.Processing).ToString() || obj.ToString() == (DB.Current.Constant.VisitStatus.Expected).ToString()) {
		return true;
	} else {
		return false;
	}
}

function GetWorkDescription(w){
	var h = "";
	var d = "";
	 
	if (w.Description != "null"){
		 d = " - " + w.Description;
	 }
	 
	 if (w.AmountOfHours != 0){
		 h = w.AmountOfHours + Trans("shorthour");
	 }
	 
	 return h + d;
}

function DoBackToQuestionOrNot(){
	if ($.ResQuery.Count() > 0 && $.workflow.name != "Historylist"){
		Workflow.BackTo("Questions");
	} else {
		if (checkUsr()){
			Workflow.BackTo("Customer");
		} else {
			Workflow.BackTo("Parameters");
		}
		}
}