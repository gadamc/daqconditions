function(head, req) {

  //
  //you should really really use this with the mapReduce View called 'condition' found 
  //in this design document. If you don't use this mapReduce View, I have no idea 
  //what will happen!
  //
  //You can provide two additional parameters to requests using this list function. They are
  //'min' and 'max' and they define the allowed range of temperatures that are returned.
  //The 'temperature' is the Temperature reported in the Samba header file at the start of each
  //run partition(file). 
  //
  //example:
  // http://127.0.0.1:5984/datadb/_design/datasort/_list/temperature/condition?reduce=false&min=0.015&max=0.017
  //
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

  testTemp = function( aTemp ){
    var minSatisfied = true;
    if( !isNaN(req.query.min) && !isNaN(aTemp) ){
      if (parseFloat(aTemp) < parseFloat(req.query.min)) {
        minSatisfied = false;
      }  
    }

    var maxSatisfied = true;
    if( !isNaN(req.query.min) && !isNaN(aTemp) ){
      if (parseFloat(aTemp) > parseFloat(req.query.max)) {
        maxSatisfied = false;
      }  
    }

    return minSatisfied && maxSatisfied;
  }

  while(row = getRow()){
    if (row.value.length == 3) { //because I expect this list function to be called with the "condition" view.
      if (testTemp(row.value[0]))
        rows.push(row);
    }
  }
  var doc = {}
  doc['request'] = req;
  doc['results'] = rows;
  send(toJSON(doc));

  
}