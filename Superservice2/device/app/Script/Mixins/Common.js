
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

//-----------------Dialog handlers-----------------

