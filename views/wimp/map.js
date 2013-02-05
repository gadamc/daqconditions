function(doc) {
  if(doc.type == "daqdocument" && doc.proc0){
   emit(doc._id, 1);
  }
}