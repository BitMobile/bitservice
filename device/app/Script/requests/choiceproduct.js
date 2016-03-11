function OnLoading(){
	SetListType();
}

 function SetListType() {
    if ($.Exists("listType") == false){
        $.AddGlobal("listType", 1);
      }
      return $.listType;
}

function isCustProd() {
	if ( $.listType == 1) {
		return true;
	} else {
		return false;
	}

}

function GetProducts(objCust, searchString, vRef) {
	//Dialog.Debug(searchString);
	var q = new Query();
	var qt = "SELECT P.Id AS Id, P.Product AS Product, S.Description AS Description FROM Catalog_Customer_Products P LEFT JOIN Catalog_SKU S ON P.Product = S.Id WHERE P.Ref = @cust";
	if (searchString != "" && searchString != null) {
		var plus = " AND  Contains(S.Description, @st)";
		qt = qt + plus;
		q.AddParameter("st", searchString);
	}
	//Dialog.Debug(qt);
	q.Text = qt;
	q.AddParameter("cust", objCust);
	if (q.ExecuteCount() > 0){
		q.Text = qt;
		q.AddParameter("r", vRef);
	}
	return q.Execute();
}

function GetAllProducts(searchString, vRef) {
	//Dialog.Debug(searchString);
	var q = new Query();
	var qt = "SELECT S.Id AS Id, S.Description AS Description FROM Catalog_SKU S ";

	if (searchString != "" && searchString != null) {
		var plus = " WHERE Contains(S.Description, @st)";
		qt = qt + plus;
		q.AddParameter("st", searchString);
		q.AddParameter("r", vRef);
	} else {
		//var plus = " WHERE NOT S.Id IN (SELECT SKU FROM Document_Visit_Result WHERE Document_Visit_Result.Ref = @r)";
		qt = qt + plus;
		q.AddParameter("st", searchString);
		q.AddParameter("r", vRef);
	}
	//Dialog.Debug(qt);
	q.Text = qt;
	//q.AddParameter("cust", objCust);

	return q.Execute();

}

function GetDirections(objCust, searchString, vRef) {
	//Dialog.Debug(searchString);
	var q = new Query();
	var qt = "SELECT DT.Id, DT.Description As Descr FROM Catalog_DepartureTypes DT WHERE DT.Parent = @Parent";
	if (searchString != "" && searchString != null) {
		var plus = " AND  Contains(DT.Description, @st)";
		qt = qt + plus;
		q.AddParameter("st", searchString);
	}

	q.Text = qt;

	q.AddParameter("Parent", vRef.DirectionOfAppeal);
	return q.Execute();

}

//function SetProduct(cw, p){
//	cw.SKU = p;
//	Workflow.Back();
//	// $Workflow.DoAction(DoSelect,$param1, $param2, $product.Product, 1, $param3)
//}

function initsearch() {
	if ($.Exists("prodsearch") == false){
	//	Dialog.Debug("Init");
		$.AddGlobal("prodsearch", null);
	}
}

function DoSearch(srchstr, p1, p2, p3){
	$.Remove("prodsearch");
	//Dialog.Debug(srchstr);
	if (srchstr != "" || srchstr != null){
		$.AddGlobal("prodsearch", srchstr);
	} else {
		$.AddGlobal("prodsearch", null);
	}
	Workflow.Refresh([p1,p2,p3]);
}

function DoBackAndClean(){
	$.Remove("prodsearch");
	$.Remove("listType");
	Workflow.BackTo("Work");
}

function doSelectDirection (dir) {
	if ($.Exists("workType")) {
		$.Remove("workType");
		$.AddGlobal("workType", dir);
	} else {
		$.AddGlobal("workType", dir);
	}
	DoBack();
}

function ChangeListAndRefresh(control) {
    $.Remove("listType");
    $.AddGlobal("listType", control);
    Workflow.Refresh([$.param1, $.param2, $.param3]);
}
