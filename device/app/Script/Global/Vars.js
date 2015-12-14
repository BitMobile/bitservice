var recvStartPeriod = undefined;
var recvStopPeriod = undefined;
var historyStart = undefined;
var historyStop = undefined;

var isNewWork;

function setNewWork(state) {
  isNewWork = state;
}

function getNewWork(){
  return isNewWork;
}
