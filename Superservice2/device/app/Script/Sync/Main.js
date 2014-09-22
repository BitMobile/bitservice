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
	 } else {
	  $.dataSyncError.Text = Translate["#error#"] + ": " + date + at + time;
	  $.dataSyncError.Visible = true;
	  $.dataSyncReport.Visible = false;
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