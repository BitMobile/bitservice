function GetMetro(outlet, searchString) {
	var q = new Query("SELECT M.Id, M.Description FROM Catalog_Metro M");
	if (!IsNullOrEmpty(searchString)) {
		q.Text = q.Text + " WHERE Contains(M.Description, @searchString)"; 
		q.AddParameter("searchString", searchString);
	}
	
	return q.Execute().Unload();
}

function MetroSelect(outlet, cust, metroRef){
    Dialog.Debug(cust);
    Dialog.Debug(metroRef);  
    if (outlet == "@ref[Catalog_Outlet]:00000000-0000-0000-0000-000000000000"){
				var obj = DB.Create("Catalog.Outlet");
				obj.Owner = cust;
				obj.Description = "Основная территория";
				obj.Metro = metroRef;
				obj.Save(false);		
				
				var visits_q = new Query("SELECT DV.Id AS Id " +
						"FROM Document_Visit DV " +
						"WHERE DV.Outlet = '@ref[Catalog_Outlet]:00000000-0000-0000-0000-000000000000' " +
						"AND DV.Customer = @Customer");
				
			    visits_q.AddParameter("Customer", cust);				
				visits = visits_q.Execute();				
				while (visits.Next()){
					visit = visits.Id.GetObject();
					visit.Outlet = obj.Id;
					visit.Save(false);					
				}				
			} else {
				var obj = outlet.GetObject();
				obj.Metro = metroRef;
				obj.Save(false);
			}
			DoBack();
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

