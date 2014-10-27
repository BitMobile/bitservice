function DoForward()
{
    Workflow.Forward(arguments.array);
}

function DoBack()
{
    Workflow.Back();
}

function DoCommit()
{
    Workflow.Commit();
}

function DoRollback()
{
	Facade.ClearMyGlobal();
	Workflow.Rollback();
}

function DoAction()
{
    var arr = arguments.array;
    Workflow.Action(arr.shift(), arr);
}

function DoRefresh()
{ 
    Workflow.Refresh(arguments.array);
}

function DoSelect(entity, attribute, control) {
    Global.DoSelect(entity, attribute, control);
    return;
}
function DoBackTo(step){
	ClearMyGlobal();
	Workflow.BackTo(step);
}

function DoBack(){
	Workflow.DoBack();
}

function DoBackAndClear(){
	ClearMyGlobal();
	Workflow.DoBack();
}
