function OnLoad() {
	if ($.Exists("map")){
      $.map.AddMarker($.param1.Address, $.param1.Lattitude, $.param1.Longitude, "orange");
  }
}
