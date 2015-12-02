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
	if ($.Exists("currentWork")){
		work = $.currentWork;
	} else {
		if (work == null){
				work = DB.Create("Document.Visit_Result");
				$.Remove("newwork");
				$.AddGlobal("newwork", true);
				work.Save();
				work = work.Id;
				$.AddGlobal("currentWork", work);		
			}		
	}
	
	return work;
}



function WriteWorkOrEdit(request, workid, desc, hcount, prod, ov, nv, isnul){
	//Dialog.Debug(prod.ToString());
	workid = workid.GetObject();
	if (prod.ToString() == "@ref[Catalog_SKU]:00000000-0000-0000-0000-000000000000"){
		Dialog.Message(Translate["#errEmptyProduct#"]);
		return;
	}
	
	if (!validate($.hcount.Text, "[0-9]+((\.|\,)[0-9]+)?")){
		Dialog.Message("В поле 'Количество часов' Разрешен ввод только цифр");
		return;
	}
	
	if (StrLen($.desc.Text) > 1000){
		Dialog.Message("Описание работ не может превышать 1000 символов.");
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

		if ($.Exists("workType")) {
			workid.WorkType = $.workType;
			$.Remove("workType");
		}
		workid.Save(false);
				
	} else {
		ow = workid;
		ow.SKU = prod;
		
		if (IsNullOrEmpty(ov)){
			ow.BaseCount = 0;
		} else {
			ow.BaseCount = ov;
		}
			
		
		ow.NewVersion = nv;
		ow.Description = desc;
		if (hcount !="" && hcount != null){
			ow.AmountOfHours = String.Format("{0:F2}", Converter.ToDecimal(hcount));
		}
		if ($.Exists("workType")) {
			ow.WorkType = $.workType;
			$.Remove("workType");
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
	$.Remove("workType");
	$.Remove("currentWork");
	Workflow.BackTo(step);
}


function getWorkType(val) {
	if ($.Exists("workType")) {
		return $.workType;
	} else {
		return val;
	}
}

function writeDescription(){
	//Dialog.Debug($.curwork.Id);
	obj = $.curwork.GetObject();
	obj.Description = $.desc.Text;
	obj.Save();
}

function writeHCount(){
	//Dialog.Debug($.curwork.Id);
	obj = $.curwork.GetObject();
	obj.AmountOfHours = $.hcount.Text;
	obj.Save();
}

function writeOv(){
	//Dialog.Debug($.curwork.Id);
	obj = $.curwork.GetObject();
	obj.BaseCount = $.ov.Text;
	obj.Save();
}

function writeNv(){
	//Dialog.Debug($.curwork.Id);
	obj = $.curwork.GetObject();
	obj.NewVersion = $.nv.Text;
	obj.Save();
}