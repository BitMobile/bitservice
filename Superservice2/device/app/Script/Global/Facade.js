
//---------------Common functions-----------

function SetDateTime(entity, attribute) {
    var NewDateTime = DateTime.Parse(entity[attribute]);
    var Header = Translate["#enterDateTime#"];
    Dialog.ShowDateTime(Header, NewDateTime, DateTimeDialog, entity);
}

function DateTimeDialog(entity, dateTime) {
    entity.DeliveryDate = dateTime;
    Variables["deliveryDate"].Text = dateTime; //refactoring is needed
}

function GenerateGuid() {

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}



//-----------------Main-------------------------------

function OpenMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}

function CloseMenu() {
    var sl = Variables["swipe_layout"];
    if (sl.Index == 1) {
        sl.Index = 0;
    }
    else if (sl.Index == 0) {
        sl.Index = 1;
    }
}




//---------------------------------------------Sync--------------------------------

function Sync() {

    //Variables["dbIndicator"].Start();
    DB.Sync();//StopIndicator);
}

function StopIndicator() {
    Variables["dbIndicator"].Stop();
}

function SyncFTP() {
    Variables["fotoIndicator"].Start();
    FileSystem.UploadPrivate(UploadPrivateCallback);
}

function UploadPrivateCallback(args) {
    if (args.Result) {
        FileSystem.SyncShared(SyncSharedCallback);
    }
    else
        FileSystem.HandleLastError();
    Variables["fotoIndicator"].Stop();
}

function SyncSharedCallback(args) {
    if (!args.Result) {
        FileSystem.HandleLastError();
    }
}


function ShowBarrel() {

    var items = [];
    for (var i = 0; i < 3; i++) {
        var row = [];
        row.push(i);
        row.push(i);
        items.push(row);
    }

    Dialog.Select("Hohohoh", items, Haha);

}

function Haha(item, state) {
}

function ClearMyGlobal(){
	if (Variables.Exists("filterStart")){
		Variables.Remove("filterStart");
	}
	
	if (Variables.Exists("filterStop")){
		Variables.Remove("filterStop");
	}
		
	if (Variables.Exists("prodsearch")){
		Variables.Remove("prodsearch");
	}
	
	if (Variables.Exists("searchAll")){
		Variables.Remove("searchAll");
	}
	if (Variables.Exists("searchToDay")){		
		Variables.Remove("searchToDay");
	}
	if (Variables.Exists("aktsearch")){
		Variables.Remove("aktsearch");
	}
	if (Variables.Exists("clientsearch")){
		Variables.Remove("clientsearch");
	}
	//Dialog.Debug("Clear");
}
