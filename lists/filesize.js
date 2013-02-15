function(head, req) {

  //
  //you should really really use this with the mapReduce View called 'condition' found 
  //in this design document. If you don't use this mapReduce View, I have no idea 
  //what will happen!
  //
  //You can provide two additional parameters to requests using this list function. They are
  //'min' and 'max' and they define the allowed range of the .root file_sizes that are returned.
  //The 'file_size' is the size of the .root file on disk in units of bytes.
  //
  //example:
  // http://127.0.0.1:5984/datadb/_design/datasort/_list/filesize/condition?reduce=false&min=10485760
  //
  // (This call above only returns files > 10 MB)
  //You MUST use reduce=false. Otherwise, nothing will return. You can also specify all of 
  //normal view sort queries, such as 'limit', 'key', 'startkey', 'endkey', and 'descending'
  //which will be applied to the view before being sent to this list function
  //
  //This returns a JSON object with a "request" key, which gives you the information
  //about the HTTP requeset (useful for debugging) 
  //
  //and a "results" key, which holds a list of rows that satisfy both the view and the 
  //min/max conditions. 
  //

  var rows = []

  testTemp = function( fsize ){
    var minSatisfied = true;
    if( !isNaN(req.query.min) && !isNaN(fsize) ){
      if (parseFloat(fsize) < parseFloat(req.query.min)) {
        minSatisfied = false;
      }  
    }

    var maxSatisfied = true;
    if( !isNaN(req.query.min) && !isNaN(fsize) ){
      if (parseFloat(fsize) > parseFloat(req.query.max)) {
        maxSatisfied = false;
      }  
    }

    return minSatisfied && maxSatisfied;
  }

  while(row = getRow()){
    if (row.value.length == 3) { //because I expect this list function to be called with the "condition" view.
      if (testTemp(row.value[2]))
        rows.push(row);
    }
  }
  var doc = {}
  doc['request'] = req;
  doc['results'] = rows;
  send(toJSON(doc));

  
}