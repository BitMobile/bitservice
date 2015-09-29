function DoSelect(entity, attribute, control) {
    var tableName = entity[attribute].Metadata().TableName;
    var query = new Query();
    query.Text = "SELECT Id, Description FROM " + tableName;
    Dialog.Select("#select_answer#", query.Execute(), DoSelectCallback1, [entity, attribute, control]);
    return;
}

function DateTimeDialog(entity, attribute, date, control) {
    var header = Translate["#enterDateTime#"];
    Dialog.ShowDateTime(header, date, DoSelectCallback2, [entity, attribute, control]);
}

function checkUsr(){
	var mskCO = '@ref[Catalog_Departments]:4859e3db-e14d-11dc-93e2-000e0c3ec513';
	var userObject = $.common.UserRef;
	return isInDepartment(mskCO, userObject.Department);	
}

function isInDepartment(valCheck, val){
	if (val != valCheck){
		if (val.Parent !=  DB.EmptyRef("Catalog_Departments")){
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

