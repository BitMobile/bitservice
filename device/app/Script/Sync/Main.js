function OnLoad() {
	DrawDataReport();

	DrawFtpReport();
}

// -------------------- Sync Data ------------
function SyncData() {
	 $.dataSyncReport.Visible = false;
	 $.dataSyncError.Visible = false;
	 $.dataSyncLayout.Visible = true;
	 $.dataSyncIndicator.Start();
	 MarkVisits();
	 DB.Sync(SyncDataFinish);
	}

	function SyncDataFinish() {
	 $.dataSyncIndicator.Stop();
	 $.dataSyncLayout.Visible = false;
	 
	 DrawDataReport();
	}

	function DrawDataReport() {
	 var at = Translate["#at#"];
	 var date = DB.LastSyncTime.ToString("dd.MM.yy ");
	 var time = DB.LastSyncTime.ToString(" HH:mm");

	 if (DB.SuccessSync) {
	  $.dataSyncReport.Text = date + at + time;
	  $.dataSyncReport.Visible = true;
	  $.dataSyncError.Visible = false;
	  $.buttonSendLog.Visible = false;
	 } else {
	  RollBackMark(); 
	  $.dataSyncError.Text = Translate["#error#"] + ": " + date + at + time;
	  $.dataSyncError.Visible = true;
	  $.dataSyncReport.Visible = false;
	  $.buttonSendLog.Visible = true;
	 }
	}

	
	function MarkVisits(){
		q = new Query("Select DV.Id As Id " +
				"FROM Document_Visit DV " +
				"Where DV.IsDirty == 1 AND DV.Status == '@ref[Enum_VisitStatus]:a726738c-984b-adc0-4d64-909dd0ababe3'");
		//q.AddParameter("st", DB.Current.Constans.VisitStatus.Completed);
		
		res = q.Execute().Unload();		
		$.Add("forrollback", res);
		while(res.Next()){
			obj = res.Id.GetObject();
			obj.SyncDateTime = DateTime.Now;
			obj.Save(false);		
		}
		
		
	}
	
	function RollBackMark(){
			if ($.Exists("forrollback") == true){
				resroll = $.forrollback;
				resroll.First();
				while (resroll.Next()){			
					obj = resroll.Id.GetObject();
					obj.SyncDateTime = null;
					obj.Save(false);			
			}
				$.Remove("forrollback");
		}
		
	}
// -------------------- Sync Ftp ------------

function SyncFtp() {
	$.ftpSyncReport.Visible = false;
	$.ftpSyncError.Visible = false;
	$.ftpSyncLayout.Visible = true;
	$.ftpSyncIndicator.Start();

	FileSystem.UploadPrivate(UploadPrivateCallback);
}

function UploadPrivateCallback(args) {
	if (args.Result) {
		FileSystem.SyncShared(SyncSharedCallback);
	} else {
		FileSystem.HandleLastError();
		SyncFtpFinish();
	}
}

function SyncSharedCallback(args) {
	if (!args.Result) {
		FileSystem.HandleLastError();
	}

	SyncFtpFinish();
}

function SyncFtpFinish() {
	$.ftpSyncIndicator.Stop();
	$.ftpSyncLayout.Visible = false;
	$.Remove("lastFtpSync");
	$.AddGlobal("lastFtpSync", DateTime.Now.ToString("dd MMM HH:mm"));
	$.Remove("ftpSyncSuccess");
	$.AddGlobal("ftpSyncSuccess", FileSystem.LastError == null);

	DrawFtpReport();
}

function DrawFtpReport() {
	if ($.ftpSyncSuccess) {
		$.ftpSyncReport.Text = $.lastFtpSync;
		$.ftpSyncReport.Visible = true;
		$.ftpSyncError.Visible = false;
	} else {		
		$.ftpSyncError.Text = Translate["#error#"] + ": " + $.lastFtpSync;
		$.ftpSyncError.Visible = true;
		$.ftpSyncReport.Visible = false;
	}
}

function SendLog() {
	var result = Application.SendDatabase();

	if (result)
		Dialog.Message("Отправлено");
	else
		Dialog.Message("Произошла ошибка во время отправки. Данные не отправлены");

}