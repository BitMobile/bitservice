function GetUserPhones(UserId) {
	
	q = new Query("SELECT Name, Number " +
						"FROM Catalog_User_PhoneNumbers " +
						"WHERE Ref == @UserId");
	q.AddParameter("UserId", UserId);
	
	return q.Execute();
	
}

function MoreMakeContactCall(tel){
	Dialog.Question("#call# "+ tel + "?", PhoneCall, tel);
}

function PhoneCall(answ, tel){
	if (answ == DialogResult.Yes) {
		Phone.Call(tel);
	}
}