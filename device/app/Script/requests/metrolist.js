function GetMetro(outlet, searchString) {
	var q = new Query("SELECT M.Id, M.Description FROM Catalog_Metro M");
	if (!IsNullOrEmpty(searchString)) {
		q.Text = q.Text + " WHERE Contains(M.Description, @searchString)"; 
		q.AddParameter("searchString", searchString);
	}
	
	return q.Execute().Unload();
}


function initsearch() {
	if ($.Exists("metrosearch") == false){
	//	Dialog.Debug("Init");
		$.AddGlobal("metrosearch", null);		
	}
}

function DoSearch(srchstr, p1, p2, p3){
	$.Remove("metrosearch");
	//Dialog.Debug(srchstr);
	if (srchstr != "" || srchstr != null){
		$.AddGlobal("metrosearch", srchstr);
	} else {
		$.AddGlobal("metrosearch", null);
	}
	Workflow.Refresh([p1,p2,p3]);	
}

function DoBackAndClean(){
	$.Remove("metrosearch");
	Workflow.Back();
}

