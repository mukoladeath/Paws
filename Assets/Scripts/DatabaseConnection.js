var isCalledFinished = false;

private var secretKey=""; // Edit this value and make sure it's the same as the one stored on the server
//var addScoreUrl="http://localhost/unity_test/addscore.php?"; //be sure to add a ? to your url
private var hs_get;
var getInterpreters ="http://paws.evl.uic.edu/getInterpreters.php"; 

 /* 
function postScore(name, score) {
    //This connects to a server side php script that will add the name and score to a MySQL DB.
    // Supply it with a string representing the players name and the players score.
    var hash=Md5.Md5Sum(name + score + secretKey); 
 
    var highscore_url = addScoreUrl + "name=" + WWW.EscapeURL(name) + "&score=" + score + "&hash=" + hash;
 
    // Post the URL to the site and create a download object to get the result.
    hs_post = WWW(highscore_url);
    yield hs_post; // Wait until the download is done
    if(hs_post.error) {
        print("There was an error posting the high score: " + hs_post.error);
    }
}
 */
 
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

// Mirlanda: Create php(s) that load Interpreters Id and name. (1) order alphabetically (2) order by the last used
function GetInterpreters() {
    
  /*  hs_get = WWW(getInterpreters);
    yield hs_get;
 
    if(hs_get.error) {
    	print("There was an error getting the interpreters: " + hs_get.error);
    } else {
     */
	   // GetComponent(Interpreters).interpreters = hs_get.text; 
	   GetComponent(Interpreters).interpreters = "JohnS:John|CathyH:Cathy";
	   GetComponent(Interpreters).SetInterpreters();
   // }
}

// Mirlanda: Update the database, increased a counter (to monitor use).  Add in the database a field that keep the counter
function UpdateInterpreter(_interpreterID: String){
   Debug.Log("Going to update..."+_interpreterID);
}

//Mirlanda: Create php that save the log (session)
/*
  This is the order of the array
  DateTime.Now, playerName(), year, reachedGoal(), 
  elapsedTime , numberSteps(), meters, burnedCalories, typeGraph
*/
function SaveSession(_parameters: String[]){

  Debug.Log("Save data to log..."+_parameters[4] + " " + _parameters[3]); 
 /*
    var highscore_url = addScoreUrl + "name=" + WWW.EscapeURL(name) + "&score=" + score + "&hash=" + hash;
 
    // Post the URL to the site and create a download object to get the result.
    hs_post = WWW(highscore_url);
    yield hs_post; // Wait until the download is done
    if(hs_post.error) {
        print("There was an error posting the high score: " + hs_post.error);
    }
*/
}

// Mirlanda: Create php that load scores
//_parameters[0] = year , _parameters[1] = number_of_results_to_get
// If you can figure out the way to return an array is better, if not the format of the data 
//should be Name1:time|Name2:time|
function GetScores(_parameters: int[]){

	Debug.Log("Get scores for parameters "+_parameters[0]+" " +_parameters[1]);
	var _scores: String = "JohnS:30|CathyH:60" ;
    
    return _scores;
}
