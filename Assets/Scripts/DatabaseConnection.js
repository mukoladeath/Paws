var isCalledFinished = false;

private var secretKey: String="AMIMP"; // Edit this value and make sure it's the same as the one stored on the server
//var addScoreUrl="http://localhost/unity_test/addscore.php?"; //be sure to add a ? to your url
private var hs_get: WWW ;
var dbURL:String = "http://paws.local/";

// Get the scores from the MySQL DB
function GetPrompts() {
  /*  gameObject.guiText.text = "Loading Prompts";
    hs_get = WWW(highscoreUrl);
    yield hs_get;
 
    if(hs_get.error) {
    	print("There was an error getting the prompts: " + hs_get.error);
    } else {
        gameObject.guiText.text = hs_get.text; // this is a GUIText that will display the scores in game.
    }*/
}
function GetInterpreters() {
    
    var hs_get_int: WWW = WWW(dbURL+"getInterpreters.php");
    yield hs_get_int;
 
    if(hs_get_int.error) {
    	print("DatabaseConnection::There was an error getting the interpreters: " + hs_get.error);
    } else {
       GetComponent(Interpreters).interpreters = hs_get_int.text; 
       GetComponent(NetworkConnectionIT).DBReady = true;
	   GetComponent(Interpreters).SetInterpreters();
	   Debug.Log("done interpreters");
    }
}
function GetPawsImages() {
    
    hs_get = WWW(dbURL+"GetPawsImages.php");
    yield hs_get;
 
    if(hs_get.error) {
    	print("DatabaseConnection::There was an error getting the images: " + hs_get.error);
    } else {
       GetComponent(NetworkConnectionIT).DBReady = true;
	   GetComponent(Prompts).countImages = parseInt(hs_get.text); 
	   GetComponent(Prompts).LoadImages();
    }
}

function SaveSession(_parameters: String[]){

 //   Debug.Log("DatabaseConnection::Save data to log..."+dbURL+"SaveSession.php"); 
  
    var session_url:String;
    var session_data: WWWForm = new WWWForm();
    
    session_data.AddField("DateTime",_parameters[0]);
    session_data.AddField("PlayerName",_parameters[1]);
    session_data.AddField("PlayedYear",_parameters[2]);
    session_data.AddField("ReachedGoal",_parameters[3]);
    session_data.AddField("TimeElapsed",_parameters[4]);
    session_data.AddField("WalkSteps",_parameters[5]);
    session_data.AddField("SwimSteps",_parameters[6]);
    session_data.AddField("WalkCalories",_parameters[7]);
    session_data.AddField("SwimCalories",_parameters[8]);
    session_data.AddField("Meters",_parameters[9]);
    session_data.AddField("InterpreterID",_parameters[10]);
    session_data.AddField("TypeGraph",_parameters[11]);    
    session_data.AddField("GameDuration",_parameters[12]);
    session_data.AddField("ServerTest",_parameters[13]);
    
    var web_request:WWW = new WWW(dbURL+"SaveSession.php",session_data);

    yield web_request;
}

// Mirlanda: Create php that load scores
//_parameters[0] = year , _parameters[1] = number_of_results_to_get
// If you can figure out the way to return an array is better, if not the format of the data 
//should be Name1:time|Name2:time|
function GetScores(_parameters: int[]){
  //  Debug.Log("DatabaseConnection::Get scores for parameters "+_parameters[0]+" " +_parameters[1]);
    var _url = "getTopScores.php" + "?year=" + _parameters[0] + "&top="+_parameters[1];
    var hs_get = WWW(dbURL+_url);
    yield hs_get; // Wait until the download is done
    if(hs_get.error) {
        print("DatabaseConnection::There was an error getting the scores: " + hs_get.error);
    }
    else{
	    if (hs_get.text.Length > 0){
	      //Debug.Log("DatabaseConnection::Get scores for parameters "+_parameters[0]+" " +_parameters[1] + "--"+ hs_get.text);
			GetComponent(NetworkConnectionIT).topScores = hs_get.text;
			GetComponent(NetworkConnectionIT).SetScores();
		}
	}
}
function GetAVGCalories(_parameters: int){
    var _url = "getAvgCalories.php" + "?game_duration=" + _parameters;
    var hs_get = WWW(dbURL+_url);
  
    yield hs_get; // Wait until the download is done
 
    if(hs_get.error) {
        print("DatabaseConnection::There was an error getting the avg calories value: " + hs_get.error);
    }
    else{
	    if (hs_get.text.Length > 0){
	     //   Debug.Log("DatabaseConnection::GetAVGCalories "+_parameters + "--"+ hs_get.text);
			GetComponent(SummaryGraph).avgCalories = hs_get.text;
			GetComponent(SummaryGraph).SetAVGCalories();
		}
	}
}
function GetHistoricalValues(_parameter1: int, _parameter2:int){

    var _url = "getHistoryGraph.php" + "?game_duration=" + _parameter2 + "&year="+"1975";
    var hs_get = WWW(dbURL+_url);
    yield hs_get; // Wait until the download is done

    if(hs_get.error) {
        print("DatabaseConnection::There was an error getting the historical calories value: " + hs_get.error);
    }
    else{
	    if (hs_get.text.Length > 0){
	     // Debug.Log("DatabaseConnection::GetHistoricalValues "+_parameter1+" " +_parameter2 + "--"+ hs_get.text);
			GetComponent(SummaryGraph).historicalValues1 = hs_get.text;
			GetComponent(SummaryGraph).SetHistoricalValues("1975");
		}
	}
	_url = "getHistoryGraph.php" + "?game_duration=" + _parameter2 + "&year="+"2010";
    hs_get = WWW(dbURL+_url);
    yield hs_get; // Wait until the download is done
    Debug.Log(dbURL+_url);
    if(hs_get.error) {
        print("DatabaseConnection::There was an error getting the historical calories value: " + hs_get.error);
    }
    else{
	    if (hs_get.text.Length > 0){
	      //Debug.Log("DatabaseConnection::GetHistoricalValues "+_parameter1+" " +_parameter2 + "--"+ hs_get.text);
			GetComponent(SummaryGraph).historicalValues2 = hs_get.text;
			GetComponent(SummaryGraph).SetHistoricalValues("2010");
		}
	}
	_url = "getHistoryGraph.php" + "?game_duration=" + _parameter2 + "&year="+"2045";
    hs_get = WWW(dbURL+_url);
    yield hs_get; // Wait until the download is done
    Debug.Log(dbURL+_url);
    if(hs_get.error) {
        print("DatabaseConnection::There was an error getting the historical calories value: " + hs_get.error);
    }
    else{
	    if (hs_get.text.Length > 0){
	     // Debug.Log("DatabaseConnection::GetHistoricalValues "+_parameter1+" " +_parameter2 + "--"+ hs_get.text);
			GetComponent(SummaryGraph).historicalValues3 = hs_get.text;
			GetComponent(SummaryGraph).SetHistoricalValues("2045");
		}
	}
}
function AppendDataToUILog(_parameter1:String,_parameter2:int,_parameter3:String,_parameter4:boolean,_parameter5:String){

 //   Debug.Log("DatabaseConnection::Save data to UI log..."+dbURL+"SaveUILog.php "+_parameter1+ " " +_parameter2+ " "+_parameter3+ " "+_parameter4+" - " +GetComponent(NetworkConnectionIT).interpreterID); 
//    message = ""+dbURL+"SaveUILog.php "+_parameter1+ " " +_parameter2+ " "+_parameter3+ " "+_parameter4+ " " + GetComponent(NetworkConnectionIT).interpreterID;
  
    var session_url:String;
    var session_data: WWWForm = new WWWForm();
    
    session_data.AddField("ui_type",_parameter1);
    session_data.AddField("interaction",_parameter2); // 0 down, 1 up
    session_data.AddField("observation",_parameter3);
    session_data.AddField("isPlaying",(_parameter4?1:0));
    session_data.AddField("date_time",_parameter5);
 	session_data.AddField("interpreter",GetComponent(NetworkConnectionIT).interpreterID);
 	
    var web_request2:WWW = new WWW(dbURL+"SaveUILog.php",session_data);

    yield web_request2;
}
