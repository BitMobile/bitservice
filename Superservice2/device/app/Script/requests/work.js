function isProgress(obj){
	//Dialog.Debug(obj);
	if (obj.ToString() == (DB.Current.Constant.VisitStatus.Processing).ToString() || obj.ToString() == (DB.Current.Constant.VisitStatus.Expected).ToString()) {
		return true;
	} else {
		return false;
	}
}

function CreateIfNotExist(work)
{
	if (work == null){
		work = DB.Create("Document.Visit_Result");
		$.Remove("newwork");
		$.AddGlobal("newwork", true);		
	}
	return work;
}



function WriteWorkOrEdit(request, workid, desc, hcount, prod, ov, nv, isnul){
	//Dialog.Debug(prod.ToString());
	if (prod.ToString() == "@ref[Catalog_SKU]:00000000-0000-0000-0000-000000000000"){
		Dialog.Message(Translate["#errEmptyProduct#"]);
		return;
	}
	
	var qc = new Query("SELECT LineNumber From Document_Visit_Result WHERE Document_Visit_Result.Ref == @r ORDER BY Document_Visit_Result.LineNumber DESC");
	qc.AddParameter("r", request);
	var linesCount = qc.ExecuteScalar();
	//Dialog.Debug(hcount);
	if (isnul != null){		
		workid.Ref = request;
		workid.LineNumber = linesCount + 1;
		workid.SKU = prod;		
		workid.OldVersion = ov;
		workid.NewVersion = nv;
		workid.Description = "" + desc;
		if (hcount !="" && hcount != null){
			workid.AmountOfHours = parseFloat(hcount);			
		} else {
			workid.AmountOfHours = 0;
		}
		workid.Save(false);
				
	} else {
		ow = workid.GetObject();
		ow.SKU = prod;
		ow.OldVersion = ov;
		ow.NewVersion = nv;
		ow.Description = desc;
		if (hcount !="" && hcount != null){
			ow.AmountOfHours = parseFloat(hcount);
		}
		ow.Save(false);
	}
	//Workflow.Back([request]);
	$.Remove("newwork");
	Workflow.Action("CMT", [request]);	
}

function DoCancel(step){
	if (!$.newwork){
		$.curwork.LoadObject();
	}
	$.Remove("newwork");
	Workflow.BackTo(step);
}

