function fillValues(ref) {
	var kkm = ref.GetObject();
	$.regnum.Text = kkm.RegNum;
	$.passni.Text = kkm.PasswordNI;
	$.caption.Text = kkm.KKM.Description;
	return ref;
}

function saveChenges(ref) {
	var kkm = ref.GetObject();
	Console.WriteLine('=== $.regnum.Text = ' + $.regnum.Text + '; $.PasswordNI.Text= ' + $.PasswordNI.Text );
	if (StrLen($.regnum.Text) > 12) {
		Dialog.Message("Рег. номер не должен превышать 12-ти символов");
		return; 
	}
	
	if (StrLen($.passni.Text) > 100) {
		Dialog.Message("Пароль НИ не должен превышать 100-ти символов");
		return; 
	}
	
	
	kkm.RegNum = $.regnum.Text;
	kkm.PasswordNI = $.passni.Text;
	kkm.Save(false);
	Workflow.Back();
}