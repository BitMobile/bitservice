function GetCustomerList(searchText){
	var	q = new Query();
	var qt = "SELECT Id FROM Catalog_Customer";
	if (searchText != null && searchText != ""){
		searchtail = " WHERE Contains(Catalog_Customer.Description, @SearchText)";
		q.AddParameter("SearchText",  searchText);
		qt = qt + searchtail;
	}
	q.Text = qt + " ORDER BY Catalog_Customer.Description";
	
	return q.Execute();
}

function initsearch() {
	if ($.Exists("clientsearch") == false){
		//Dialog.Debug("Init");
		$.AddGlobal("clientsearch", null);		
	}
}

function DoSearch(s){	
	$.Remove("clientsearch");
	$.AddGlobal("clientsearch", s);
	Workflow.Refresh([]);
}
