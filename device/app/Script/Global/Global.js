function DoSelect(entity, attribute, control) {
    var tableName = entity[attribute].Metadata().TableName;
    var query = new Query();
    query.Text = "SELECT Id, Description FROM " + tableName;
    Dialog.Select("#select_answer#", query.Execute(), DoSelectCallback1, [entity, attribute, control]);
    return;
}

function DateTimeDialog(entity, attribute, date, control) {
    var header = Translate["#enterDateTime#"];
    Dialog.ShowDateTime(header, date, DoSelectCallback2, [entity, attribute, control]);
}