
function open() {
  var vis = get_vsit();
  script = "document.getElementById('textmessage').innerHTML = '";
  text="";
  for (var i in vis) {
    text +=i.Date;
  }
  script += text +"';";
  $.Push("text_script", script);
//  DB.CreateTable("Filtered_Outlets", ["Id"]);
 return View.TemplateView("visitview.xml");
}
function get_vsit() {
//	var userId = get_user_id();
	var q = DB.CreateCommand();
	q.Text = "SELECT [Date] FROM [Document].[Visit] ";
	//q.AddParameter("userId", userId);
	return q.Select();
}
