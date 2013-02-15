function(doc) {
    
  //You can use this view to sort by [doc.Condition, run_name]
  //OR you can sort by [doc.Condition, bolometer name, run_name]
  //where
  //doc.Condition usually is something like 'calibration gamma', 'fond chateau ferme' 'calibration neutron'
  //run_name is something like 'mk23a000_023'
  //bolometer name is 'ID2' or 'FID812'
  //
  //you can also use the reduce function to group and get the available categories.
  //



  function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }

  if(doc.type == "daqdocument" && doc.Condition && doc.Temperature
    && doc['proc1']['file_size'] && doc['proc1']['file'] && doc.run_name && doc.file_number){

    var emitVal = [doc.Temperature, doc['proc1']['file'], doc['proc1']['file_size']]

    emit( [doc.Condition, doc.run_name + "_" + zeroPad(doc.file_number,3)] , emitVal);
  
    if( doc.Detecteurs && doc.Hote){
      var alreadyEmitted = []
      for(var i in doc.Detecteurs){
        var det = doc.Detecteurs[i];
        if (det.bolometer && det["Bolo.hote"] == doc.Hote &&  alreadyEmitted.indexOf(det.bolometer) == -1){
          alreadyEmitted.push(det.bolometer);
          
          emit( [doc.Condition, det.bolometer, doc.run_name + "_" + zeroPad(doc.file_number,3)] , emitVal);

        }
      }
    } 
  }
}