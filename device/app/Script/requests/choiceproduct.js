function GetProducts(objCust, searchString, vRef) {
	//Dialog.Debug(searchString);
	var q = new Query();
	var qt = "SELECT P.Id AS Id, P.Product AS Product, S.Description AS Description FROM Catalog_Customer_Products P LEFT JOIN Catalog_SKU S ON P.Product = S.Id WHERE P.Ref = @cust";
	var qq = new Query();
	var qqt = "SELECT P.Id AS Id, P.Product AS Product, S.Description AS Description FROM Catalog_Customer_Products P LEFT JOIN Catalog_SKU S ON P.Product = S.Id WHERE";
	if (searchString != "" && searchString != null) {
		var plus = " AND  Contains(S.Description, @st)";
		var qplus = " Contains(S.Description, @st) AND";
		qt = qt + plus;
		qqt = qqt + qplus;
		q.AddParameter("st", searchString);
		qq.AddParameter("st", searchString);
	}
	//Dialog.Debug(qt);
	q.Text = qt;
	qq.Text = qqt + " NOT P.Product IN (SELECT SKU FROM Document_Visit_Result WHERE Document_Visit_Result.Ref = @r) LIMIT 150";
	q.AddParameter("cust", objCust);
	if (q.ExecuteCount() > 0){
		q.Text = qt + " AND NOT P.Product IN (SELECT SKU FROM Document_Visit_Result WHERE Document_Visit_Result.Ref = @r)";
		q.AddParameter("r", vRef);
		return q.Execute();	
	} else {
		qq.AddParameter("r", vRef);		
		return qq.Execute();
	}
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
	Workflow.Back();
}

