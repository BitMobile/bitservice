function KKMs(Ref){
	var q = new Query("SELECT KM.Id AS Id, CK.Description AS KKM, KM.RegNum, KM.PasswordNI " +
			"From Document_Visit_KKM KM " +
			"LEFT JOIN Catalog_CustomerKKM CK " +
			"ON KM.KKM = CK.Id " +
			"Where KM.Ref == @Ref");
	q.AddParameter('Ref', Ref);
	return q.Execute();
}