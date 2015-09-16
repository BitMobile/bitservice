function fillValues(ref) {
	var kkm = ref.GetObject();
	$.regnum.Text = kkm.RegNum;
	$.passni.Text = kkm.PasswordNI;
	return ref;
}

function saveChenges(ref) {
	var kkm = ref.GetObject();
	kkm.RegNum = $.regnum.Text;
	kkm.PasswordNI = $.passni.Text;
	kkm.Save(false);
	Workflow.Back();
}