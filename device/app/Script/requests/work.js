function isProgress(obj){
	//Dialog.Debug(obj);
	if (obj.ToString() == (DB.Current.Constant.VisitStatus.Processing).ToString() || obj.ToString() == (DB.Current.Constant.VisitStatus.Expected).ToString()) {
		return true;
	} else {
		return false;
	}
}

function checkIsNumeric(sender){
	if (!validate(sender.Text, "[0-9]+((\.|\,)[0-9]+)?") && StrLen(sender.Text)> 0){
		//Dialog.Message("Разрешен ввод только цифр");
		sender.Text = Left(sender.Text, StrLen(sender.Text) - 1);
	}
	
	if (StrLen(sender.Text)> 3) {
		sender.Text = Left(sender.Text, 3);
	}
	
}

function checkIsNumericOnWrite(value, length){
	if (!validate(sender.Text, "[0-9]+((\.|\,)[0-9]+)?")){
		Dialog.Message("Разрешен ввод только цифр");
		return false;
	}
	
	if (StrLen(sender.Text)> length) {
		Dialog.Message("Разрешен ввод не более " + length + " цифр");
		return false;
	}
	return true;
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
	
	if (!validate($.hcount.Text, "[0-9]+((\.|\,)[0-9]+)?")){
		Dialog.Message("В поле 'Количество часов' Разрешен ввод только цифр");
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
		if (IsNullOrEmpty(ov)){
			workid.BaseCount = 0;
		} else {
			workid.BaseCount = ov;
		}		
		workid.NewVersion = nv;
		workid.Description = "" + desc;
		if (hcount !="" && hcount != null){
			workid.AmountOfHours = String.Format("{0:F2}", Converter.ToDecimal(hcount));			
		} else {
			workid.AmountOfHours = 0;
		}
		workid.Save(false);
				
	} else {
		ow = workid.GetObject();
		ow.SKU = prod;
		ow.BaseCount = ov;
		ow.NewVersion = nv;
		ow.Description = desc;
		if (hcount !="" && hcount != null){
			ow.AmountOfHours = String.Format("{0:F2}", Converter.ToDecimal(hcount));
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

