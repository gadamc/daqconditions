function(head, req) {

  //
  //you should really really use this with the mapReduce View called 'condition' found 
  //in this design document. If you don't use this mapReduce View, I have no idea 
  //what will happen! This is why the name of this list function is called "conditionfilter"
  //
  //This list function acts like a filter. It filters the resulting rows produced by the 'condition'
  //view. The value of each row from the 'condition' view is a list
  // [temperature, "/path/to/sambafile.root", file_size]
  //
  //You must choose which value you want to filter. You can specify either "temperature"
  //OR "file_size". Any other value will return an empty result. (This list function ONLY supports either 
  //temperature or file_size, but not both. Sorry.. if there are enough request for this, then it could be rewritten.)
  //
  //You can provide two additional parameters to requests using this list function. They are
  //'min' and 'max' and they define the allowed range of the .root file_sizes that are returned.
  //You should provide at least one of them! Otherwise, nothing will be filtered.
  //
  //example:
  // http://127.0.0.1:5984/datadb/_design/datasort/_list/conditionfilter/condition?reduce=false&file_size=1&min=10485760
  //
  // This call above only returns files > 10 MB
  //
  //example:
  // http://127.0.0.1:5984/datadb/_design/datasort/_list/conditionfilter/condition?reduce=false&temperature=1&min=0.018&max=0.020
  //
  // This call above only returns run docs where temperature recorded in the Samba header was between 18 and 20 mK [18, 20)
  //
  //
  //You MUST use reduce=false. 
  //Otherwise, nothing will return. You can also specify all of 
  //normal view sort queries, such as 'limit', 'key', 'startkey', 'endkey', and 'descending'
  //which will be applied to the view before being sent to this list function. CouchDB view keywords are well documented
  //online and on the CouchDB wiki.
  //
  //This list function returns a JSON object with a "request" key, which gives you the information
  //about the HTTP requeset (useful for debugging) 
  //and a "results" key, which holds a list of rows that satisfy both the view and the 
  //min/max conditions. 
  //
  //The data that you want will be in the "results" key and will look exactly like each row 
  //of the results returned by the "condition" view. 
  //

  var rows = []

  testTemp = function( theValue ){
    var minSatisfied = true;
    if( !isNaN(req.query.min) && !isNaN(theValue) ){
      if (parseFloat(theValue) < parseFloat(req.query.min)) {
        minSatisfied = false;
      }  
    }

    var maxSatisfied = true;
    if( !isNaN(req.query.min) && !isNaN(theValue) ){
      if (parseFloat(theValue) > parseFloat(req.query.max)) {
        maxSatisfied = false;
      }  
    }

    return minSatisfied && maxSatisfied;
  }

  if(req.query.temperature && req.query.file_size){
    var doc = {}
    doc['request'] = req;
    doc['error'] = 'this list only supports either temperature or file_size, but not both. sorry.'
    send(toJSON(doc));
  }

  else{
    while(row = getRow()){
      if (row.value.length == 3) { //because I expect this list function to be called with the "condition" view.
        if(req.query.temperature){
          if (testTemp(row.value[0]))
            rows.push(row);
        }
        else if (req.query.file_size){
          if (testTemp(row.value[2]))
            rows.push(row);
        }
      }
    }

    var doc = {}
    doc['request'] = req;
    doc['results'] = rows;
    send(toJSON(doc));
  }
  

  
}