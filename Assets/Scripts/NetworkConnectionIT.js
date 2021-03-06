var TOP_SCORES = 10;
var remoteIP: String = "10.0.1.113";
var remotePort: int = 25000;
var DBReady: boolean = false;
var PromptReady: boolean = false;

var newSkin: GUISkin;
var areaWidth : float;
var areaHeight : float;
var backgroundTexture : Texture;
var startBtnTexture: Texture;
var localViewTexture: Texture;
var remoteViewTexture: Texture;

var isPlaying: boolean;
var burnedCalories: float;
var meters: float;
var elapsedTime: float;
var interpreterName:String;
var interpreterID:String;
var topScores:String = "";
var promptsXScreen = 5;

private var ScreenX: float;
private var ScreenY: float;

private var _scoresCount: int;
private var _scoreValues:ArrayList;
private var _scoreNames: ArrayList;
private var _numWalkSteps: int;
private var _numSwimSteps: int;
private var _startTime: float;
private var _metersXWalkSteps:float;
private var _metersXSwimSteps:float;
private var _playerNumber: int;
private var _currentYear:int;
private var _durationGame:int;
private var _showGraphView:boolean;
private var _showSummary:boolean;
private var _goalReached:boolean;
private var _timerReached:boolean;
private var _currentAvg:float;
private var _minYear : int = 0;
private var _defTime : int = 3;
private var _maxYear : int = 2;
private var _serverReady : boolean;
private var _playerName : String;
private var _initialPos : Vector2;
private var _currentPos : Vector2;
private var _displaySeconds: int;
private var _displayMinutes: int;
private var _leftTime:float;
private var _savedAvg: boolean;
private var _savedLog: boolean;
private var _scoresLoaded: boolean;
private var _showInfo:boolean;
private var _showMap:boolean;
private var _showCurrentGraph:boolean;
private var _showInterpreterList:boolean = false;
private var _localPromptIndex:int = -1;
private var _localToRemotePromptIndex:int = -1;
private var _remotePromptIndex:int = -1;
private var _selectedPromptIndex:int = -1;
private var _showSingleView: boolean = true;
private var _getRandomPrompts: boolean = false;

var yearList : int[] = [1975,2010,2045];
private var _yearAgoList : int[]= [-35,0,35];
private var _yearLabels : String[]= ["1975","2010","2045"];
var gameDurationList: int[] = [1,3,5];
private var _DBParameters;
var tapCount: int;
private var _innerController : int;			 
			       
//variable for the heigh of the lable text
private var _labelHeight :float;
			       
//variable for testing different versions of the server
var serverTest:int ; //  0 mouseDown, mouseUp with only 5 prompts at a time
						//  1 mouseDown, mouseUp with buttons to navigate prompts	
var NoPanel:int = 1; // 0 - 1 panel; 1 - 2 panel (default)
function Start(){
 
  StartScene();
}
function StartScene(){
    ScreenX = ((Screen.width * 0.5) - (areaWidth * 0.5));
    ScreenY = ((Screen.height * 0.5) - (areaHeight * 0.5));
	
	_labelHeight = areaHeight*0.04;
	
    GetComponent(BurnedCaloriesGraph).posX = areaWidth*0.12;       
	GetComponent(BurnedCaloriesGraph).posY = areaHeight*0.15;
	GetComponent(BurnedCaloriesGraph).width = areaWidth*0.7;       
	GetComponent(BurnedCaloriesGraph).height = areaHeight*0.55;
	
	GetComponent(CurrentPosInMap).posX = areaWidth*0.15;
	GetComponent(CurrentPosInMap).posY = areaHeight*0.27;
	GetComponent(CurrentPosInMap).mapWidth = areaWidth*0.7;
	GetComponent(CurrentPosInMap).mapHeight = areaHeight*0.65;
	
	GetComponent(SummaryGraph).posX = areaWidth*0.12;
	GetComponent(SummaryGraph).posY = areaHeight*0.15;
	GetComponent(SummaryGraph).height = areaHeight*0.55;
	GetComponent(SummaryGraph).width = areaWidth*0.7;
	GetComponent(SummaryGraph).numYears = yearList.Length;

    GetComponent(InfoPolarBear).posX = areaWidth*0.1;
	GetComponent(InfoPolarBear).posY = areaHeight*0.1;
	GetComponent(InfoPolarBear).infoWidth = areaWidth*0.8;
	GetComponent(InfoPolarBear).infoHeight = areaHeight*0.8;

	GetComponent(GameParameters).labelHeight = _labelHeight;
	GetComponent(GameParameters).posX = areaWidth*0.52;       
	GetComponent(GameParameters).posY = areaHeight*0.10;
	ConnectToDataServers();
    Initialize();
    
}
function ConnectToDataServers(){
    GetComponent(DatabaseConnection).GetInterpreters();
    GetComponent(DatabaseConnection).GetPawsImages();
}
function Initialize(){
	_scoreValues = new ArrayList();
	_scoreNames = new ArrayList();
	interpreterName = "Interpreter...";
	interpreterID = "1";
    _displayMinutes = 0;
    elapsedTime = 0;
    _leftTime = 0;
	_currentYear = _minYear;
	_showGraphView = false;
	SendMessage("ShowSummaryGraph",false); 
	isPlaying = false;
	_innerController = 1;
	_serverReady = false;	
	_numSwimSteps = _numWalkSteps = _playerNumber = 0;
	burnedCalories = meters = _displaySeconds = _displayMinutes = 0;
	_playerName = "name ...";
	_goalReached = false;
	_timerReached = false;
	_initialPos = new Vector2(0.0,0.0);
	_currentPos = new Vector2(0.0,0.0);
    _savedAvg = false;
    _savedLog = false;
    topScores = "";
    _remotePromptIndex = -1;
    _localPromptIndex = -1;
    _localToRemotePromptIndex = -1;
    _getRandomPrompts = false;
    _showMap = false;
    _showCurrentGraph = false;

    
	var  _map : Texture2D = Resources.Load("Images/"+yearList[_currentYear].ToString()+"_Location_Map", typeof(Texture2D));
	GetComponent(CurrentPosInMap).mapImage = _map;
	GetComponent(CurrentPosInMap).InitializeMap();
	GetComponent(BurnedCaloriesGraph).DestroyLines();
	GetComponent(Prompts).ResetPrompts();
	GetComponent(SummaryGraph).SetParameters(_currentYear,_defTime);
	GetComponent(SummaryGraph).UpdateAverageValues();
	LoadScores();
}

function StartGame(){
	_currentYear = GetComponent(GameParameters).getCurrentYearIndex();
	_durationGame = GetComponent(GameParameters).getDurationGameIndex();
	_startTime = Time.realtimeSinceStartup;
	GetComponent(SummaryGraph).SetParameters(_currentYear,gameDurationList[_durationGame]);
	GetComponent(SummaryGraph).UpdateAverageValues();
	GetComponent(SummaryGraph).GetHistoricalAverageValues();
	
	GetComponent(CurrentPosInMap).SetCurrentYear(_currentYear);
	GetComponent(BurnedCaloriesGraph).maxXAxisValue = (gameDurationList[_durationGame]) * 70;
    GetComponent(BurnedCaloriesGraph).maxBurnedCalories = (gameDurationList[_durationGame]==1?400:(gameDurationList[_durationGame]==3?500:700));
    GetComponent(BurnedCaloriesGraph).xInterval = 10;
    GetComponent(BurnedCaloriesGraph).DrawCaloriesGraph();
	GetComponent(BurnedCaloriesGraph).HideBurnedCaloriesGraph();
    isPlaying = true;
    GetComponent.<NetworkView>().RPC ("LoadLevelInClient", RPCMode.Others, _currentYear.ToString()+":"+_yearAgoList[_currentYear].ToString()+":"+_durationGame.ToString());  
}

function OnConnectedToServer () {
    Debug.Log("Connected to Server... ");
    
  
	// Notify our objects that the level and the network are ready
	for (var go : GameObject in FindObjectsOfType(GameObject))
		go.SendMessage("OnNetworkLoadedLevel", SendMessageOptions.DontRequireReceiver);
}

function DoubleTapView(){
	
}

function Update(){
	if (isPlaying && !_goalReached && !_timerReached)
	{
	  if (_displayMinutes < gameDurationList[_durationGame]){
	    burnedCalories =  (_numWalkSteps * 0.4445) + (_numSwimSteps * 1.15583174);
   //     Debug.Log("Current pos: " +_currentPos + " initial pos: " + _initialPos);
		meters = Vector2.Distance(_initialPos,_currentPos);

		elapsedTime =  Time.realtimeSinceStartup - _startTime;
		_leftTime = gameDurationList[_durationGame]*60-elapsedTime;
	  }			
	}
	
	if(Input.GetKeyDown(KeyCode.H))  // Hide Polar Bear Info.
			GetComponent(InfoPolarBear).ShowInfo(false);
	else if(Input.GetKeyDown(KeyCode.S))
			GetComponent(InfoPolarBear).ShowInfo(true);	
			
    if (Network.peerType == NetworkPeerType.Disconnected){
    	 _serverReady = false;
    }
	else{
	   _serverReady = true;
	  // ipaddress = Network.player.ipAddress;
		//port = Network.player.port.ToString();
    }
}

function OnGUI () {
     DrawViews();
     GetComponent(MessageBox).ShowOnGUI();
}

function DrawConnectionLabels(){
  
    if (!(DBReady && PromptReady)){

		GUILayout.BeginArea (Rect (areaWidth*0.05, areaHeight*0.96, _labelHeight, _labelHeight));
		if (GUILayout.Button("Go")){	
			ConnectToDataServers();
		}
	    GUILayout.EndArea();
	}
	
	if (!DBReady){	
		GUILayout.BeginArea (Rect (areaWidth*0.12, areaHeight*0.92, _labelHeight*20, _labelHeight));
     	GUILayout.Label("Database url:");
	    GUILayout.EndArea();
    	GUILayout.BeginArea (Rect (areaWidth*0.12, areaHeight*0.96, areaWidth*0.25, _labelHeight+areaHeight*0.01));
		GetComponent(DatabaseConnection).dbURL = GUILayout.TextField(GetComponent(DatabaseConnection).dbURL,30);
		GUILayout.EndArea();
	}
	if (!PromptReady){
        GUILayout.BeginArea (Rect (areaWidth*0.40, areaHeight*0.92, _labelHeight*20, _labelHeight));
     	GUILayout.Label("Prompts url:");
	    GUILayout.EndArea();
    	GUILayout.BeginArea (Rect (areaWidth*0.40, areaHeight*0.96, areaWidth*0.25, _labelHeight+areaHeight*0.01));
		GetComponent(Prompts).url = GUILayout.TextField(GetComponent(Prompts).url,50);
		GUILayout.EndArea();
	}
	if (!_serverReady){
	    GUILayout.BeginArea (Rect (areaWidth*0.75, areaHeight*0.92, areaWidth*0.20, _labelHeight));
		if (GUILayout.Button("Connect to Exhibit")){	
			// If server not connected - iPad Connect to Exhibit
			Network.Connect(remoteIP, remotePort);
		}
	    GUILayout.EndArea();
		GUILayout.BeginArea (Rect (areaWidth*0.75, areaHeight*0.96, areaWidth*0.20, _labelHeight+areaHeight*0.01));
		remoteIP = GUILayout.TextField(remoteIP,15);
		GUILayout.EndArea();

		_numSwimSteps = _numWalkSteps = _playerNumber = 0;
		burnedCalories = 0;
		// Notify our objects that the level and the network is ready
		for (var go : GameObject in FindObjectsOfType(GameObject)){
			go.SendMessage("OnNetworkLoadedLevel", SendMessageOptions.DontRequireReceiver);
		}
	}
}
function DrawViews(){
	
  	GUI.skin = newSkin;
  	GUI.depth = 0;	
	    
	GUILayout.BeginArea(Rect(ScreenX,ScreenY, areaWidth, areaHeight));
  	GUI.DrawTexture (Rect (0, 0, areaWidth, areaHeight), backgroundTexture);
    		
   
	// Draw the main view.
/*	GUILayout.BeginArea (Rect (areaWidth*0.02, areaHeight*0.22, _labelHeight, _labelHeight));
	if (GUILayout.Button((serverTest%3).ToString())){	
		serverTest++;
	}
    GUILayout.EndArea();*/

    
    DrawConnectionLabels();
			
   if (!_showMap && !_showCurrentGraph && !_showGraphView){   
   
       // 1 Panel or 2 Panel
	    GUILayout.BeginArea (Rect (areaWidth*0.75, areaHeight*0.18, areaWidth*0.21, _labelHeight));
	    
		if (GUILayout.Button(("Switch to " + ((NoPanel%2)+1).ToString() + "-panel(s)"))){	
			NoPanel++;
		}
	    GUILayout.EndArea();
	    // Show Prompts
	    // Draw Prompts View
	    if ((NoPanel%2) == 0 ){
		    GUILayout.BeginArea(Rect (areaWidth*0.03, areaHeight*0.28, areaWidth*0.45, areaHeight*0.45));
		    if (_localPromptIndex >=0){
		        GUILayout.Box(GetComponent(Prompts).prompts[_localPromptIndex]);
		       
		        }
		    else
		  	    GUILayout.Box(localViewTexture);
		    if (_selectedPromptIndex >=0 && Event.current.type == EventType.MouseUp && GUILayoutUtility.GetLastRect().Contains(Event.current.mousePosition))
		    {
		       _localPromptIndex = _selectedPromptIndex;
		       GetComponent(DatabaseConnection).AppendDataToUILog('L',1,_localPromptIndex.ToString(),isPlaying,DateTime.Now.ToString());
		       _selectedPromptIndex = -1;
		       _localToRemotePromptIndex = -1;
		    }
		    if (_localPromptIndex >=0 && Event.current.type == EventType.MouseDown && GUILayoutUtility.GetLastRect().Contains(Event.current.mousePosition))
			  {
			   // Debug.Log("logging down "+ GetComponent(Prompts).promptCurrentList[_p]);
			    _localToRemotePromptIndex = _localPromptIndex;
			     _selectedPromptIndex = -1;
			    GetComponent(DatabaseConnection).AppendDataToUILog('B',0,_localToRemotePromptIndex.ToString(),isPlaying,DateTime.Now.ToString());
			  }
		    GUILayout.EndArea();
	 
		    GUILayout.BeginArea(Rect (areaWidth*0.53, areaHeight*0.28, areaWidth*0.45, areaHeight*0.45));
		      if (_remotePromptIndex >=0){
		        GUILayout.Box(GetComponent(Prompts).prompts[_remotePromptIndex]);
		       
		        }
		    else
		  	    GUILayout.Box(remoteViewTexture);
			if ((_selectedPromptIndex >=0 || _localToRemotePromptIndex>=0) && Event.current.type == EventType.MouseUp && GUILayoutUtility.GetLastRect().Contains(Event.current.mousePosition))
		    {
		        if (_selectedPromptIndex >=0)
		       		 _remotePromptIndex = _selectedPromptIndex;
		        else
		        	_remotePromptIndex = _localToRemotePromptIndex;
		        	
		         GetComponent(DatabaseConnection).AppendDataToUILog('R',1,_remotePromptIndex.ToString(),isPlaying,DateTime.Now.ToString());
		         _selectedPromptIndex = -1;
		         _localToRemotePromptIndex = -1;
		    }
		    GUILayout.EndArea();
	    }
	    else{ //Show only one prompt
	      GUILayout.BeginArea(Rect (areaWidth*0.25, areaHeight*0.25, areaWidth*0.52, areaHeight*0.50));
		    if (_localPromptIndex >=0){
		        GUILayout.Box(GetComponent(Prompts).prompts[_localPromptIndex]);
		       
		        }
		    else
		  	    GUILayout.Box(localViewTexture);
		    if (_selectedPromptIndex >=0 && Event.current.type == EventType.MouseUp && GUILayoutUtility.GetLastRect().Contains(Event.current.mousePosition))
		    {
		       _localPromptIndex = _selectedPromptIndex;
		       GetComponent(DatabaseConnection).AppendDataToUILog('L',1,_localPromptIndex.ToString(),isPlaying,DateTime.Now.ToString());
		       _selectedPromptIndex = -1;
		       _localToRemotePromptIndex = -1;
		    }
		    if (_localPromptIndex >=0 && Event.current.type == EventType.MouseDown && GUILayoutUtility.GetLastRect().Contains(Event.current.mousePosition))
			  {
			   // Debug.Log("logging down "+ GetComponent(Prompts).promptCurrentList[_p]);
			    _localToRemotePromptIndex = _localPromptIndex;
			     _selectedPromptIndex = -1;
			    GetComponent(DatabaseConnection).AppendDataToUILog('B',0,_localToRemotePromptIndex.ToString(),isPlaying,DateTime.Now.ToString());
			  }
		    GUILayout.EndArea();
	    }
	    	///Show prompts - resources
	      if (GetComponent(Prompts).countImages > 0){
	          if (GetComponent(Prompts).countImages < promptsXScreen)
	          		promptsXScreen = GetComponent(Prompts).countImages;
	          		
			  for (var _p:int = 0; _p < promptsXScreen; _p++){
			    GUILayout.BeginArea (Rect (areaWidth*0.16*_p+areaWidth*0.1, areaHeight*0.77, areaWidth*0.15, areaHeight*0.15));
			
				  GUILayout.Box(GetComponent(Prompts).prompts[GetComponent(Prompts).promptCurrentList[_p]],GUILayout.ExpandHeight(true));
				  if (Event.current.type == EventType.MouseDown && GUILayoutUtility.GetLastRect().Contains(Event.current.mousePosition))
				  {
				   // Debug.Log("logging down "+ GetComponent(Prompts).promptCurrentList[_p]);
				    _selectedPromptIndex = GetComponent(Prompts).promptCurrentList[_p];
				    _localToRemotePromptIndex = -1;
				    GetComponent(DatabaseConnection).AppendDataToUILog('P',0,_selectedPromptIndex.ToString(),isPlaying,DateTime.Now.ToString());
				  }
				GUILayout.EndArea();	
			  }	
		  }
		  
  
   }
   if (serverTest%3 == 1 && !(_showMap || _showCurrentGraph || _showGraphView))
   {
   
   	    _getRandomPrompts = false;
   		
        GUILayout.BeginArea (Rect (areaWidth*0.05, areaHeight*0.79, _labelHeight, _labelHeight*3));
   		if (GUILayout.Button("\n<\n")){
   		    //Debug.Log("Past");
		    GetComponent(Prompts).GetPrompts(-1);
		    GetComponent(DatabaseConnection).AppendDataToUILog('B',0,"<",isPlaying,DateTime.Now.ToString());
		     _showInterpreterList = false;
		     GetComponent(GameParameters).showGameParameters(false);
	    }
	    GUILayout.EndArea();  
	    GUILayout.BeginArea (Rect (areaWidth*0.9, areaHeight*0.79, _labelHeight, _labelHeight*3));
	    if (GUILayout.Button("\n>\n")){
	        // Debug.Log("Future");
		     GetComponent(Prompts).GetPrompts(1);
		     GetComponent(DatabaseConnection).AppendDataToUILog('B',0,">",isPlaying,DateTime.Now.ToString());
		      _showInterpreterList = false;
		      GetComponent(GameParameters).showGameParameters(false);
	    }
	    GUILayout.EndArea(); 
	
   }
   else if (serverTest%3 == 0)
   {
   		if ((_displaySeconds == 30 || _displaySeconds == 0) && !_getRandomPrompts)
   		{
   		    _getRandomPrompts = true;
   			GetComponent(Prompts).GetPrompts(1);
   		}
   		else if (_displaySeconds != 30 && _displaySeconds != 0 )
   		{
   	     	_getRandomPrompts = false;
   		}
   }	

			_scoresLoaded = false;
		
			// Show Historical values
			GUILayout.BeginArea (Rect (areaWidth*0.75, areaHeight*0.12, _labelHeight*7, _labelHeight));
			if (_showGraphView){
			    if (GUILayout.Button("<< Back")){	
					 _showGraphView = false;
					 _showInterpreterList = false;
		             GetComponent(GameParameters).showGameParameters(false);
					 SendMessage("ShowSummaryGraph",false); 
					}
			}
			else{
			   if (GUILayout.Button("Historical Graph")){	
		     	  	GetComponent(SummaryGraph).UpdateAverageValues();
	                GetComponent(SummaryGraph).GetHistoricalAverageValues();
				    _showGraphView = true;
					_showCurrentGraph = false;
					_showMap = false;
					 _showInterpreterList = false;
		            GetComponent(GameParameters).showGameParameters(false);
					SendMessage("PrintSummaryGraph"); 
		            SendMessage("ShowSummaryGraph",true); 
				}
			}
			GUILayout.EndArea();
		  	    
			if (!isPlaying){
				
				// Area rendering the UI elements 
				GUILayout.BeginArea (Rect (areaWidth*0.1, areaHeight*0.05, areaWidth*0.15, _labelHeight+areaHeight*0.01));
				_playerName = GUILayout.TextField(_playerName,12);
				GUILayout.EndArea();
		     	
		     	GUILayout.BeginArea (Rect (areaWidth*0.32, areaHeight*0.05, areaWidth*0.15, areaHeight*0.05));
			    if (GUILayout.Button(interpreterName)){
					
    				_showInterpreterList = !_showInterpreterList;
    			
   			    }
   			    GUILayout.EndArea();
   	
   			    if (_showInterpreterList){
   			        GetComponent(GameParameters).showGameParameters(false);
				 	for (var cnt:int  = 1; cnt < GetComponent(Interpreters).interpreterNames.Count; cnt++){		 
				 	   GUILayout.BeginArea (Rect (areaWidth*0.32, areaHeight*0.05+_labelHeight*(cnt), areaWidth*0.15, _labelHeight));
				 	   if (GUILayout.Button((GetComponent(Interpreters).interpreterNames[cnt].ToString()))){
				 	   		interpreterName = GetComponent(Interpreters).interpreterNames[cnt];
				 	   		interpreterID = GetComponent(Interpreters).interpreterIDs[cnt];
				 	   		_showInterpreterList = !_showInterpreterList;
		                    
				 	   } 
				 	   GUILayout.EndArea();
				    }
			    }
			  //  Debug.Log("Positions main screen settings"+areaWidth*0.5+" " +areaHeight*0.12);
			    GUILayout.BeginArea (Rect (areaWidth*0.52, areaHeight*0.05, areaWidth*0.1, _labelHeight));
				if (GUILayout.Button("Settings")){	// Game Parameters
				     GetComponent(GameParameters).showGameParameters(true);
				      _showInterpreterList = false;
				}
				GUILayout.EndArea();
				 
			}
			else{
		
				GUILayout.BeginArea (Rect (areaWidth*0.1, areaHeight*0.05, areaWidth*0.20, _labelHeight));
				GUILayout.Label("Player: " +_playerName);
				GUILayout.EndArea();
				
				GUILayout.BeginArea (Rect (areaWidth*0.3, areaHeight*0.05, areaWidth*0.15, areaHeight*0.05));
			    if (GUILayout.Button(interpreterName)){
					
    				_showInterpreterList = !_showInterpreterList;
    			
   			    }
   			    GUILayout.EndArea();
				if (_showInterpreterList){
	
				 	for (cnt  = 1; cnt < GetComponent(Interpreters).interpreterNames.Count; cnt++){
				 
				 	   GUILayout.BeginArea (Rect (areaWidth*0.3, areaHeight*0.05+_labelHeight*(cnt), areaWidth*0.15, _labelHeight));
				 	   if (GUILayout.Button((GetComponent(Interpreters).interpreterNames[cnt].ToString()))){
				 	   		interpreterName = GetComponent(Interpreters).interpreterNames[cnt];
				 	   		interpreterID = GetComponent(Interpreters).interpreterIDs[cnt];
				 	   		_showInterpreterList = !_showInterpreterList;
				 	   } 
				 	   GUILayout.EndArea();
				    }
				}
			   
		     	GUILayout.BeginArea (Rect (areaWidth*0.5, areaHeight*0.05, areaWidth*0.3, _labelHeight));				
				GUILayout.Label("Year: "+yearList[_currentYear].ToString() + " - " + gameDurationList[_durationGame]+" min.");
				GUILayout.EndArea();

				// Draw the main view.
				GUILayout.BeginArea (Rect (areaWidth*0.3, areaHeight*0.18, areaWidth*0.4, _labelHeight));
				GUILayout.Label("Bear calories burned: " + (Mathf.Round(burnedCalories*100)/100) + " Calories");  
			    GUILayout.EndArea();
			    
				//Disntance in meters
				//GUILayout.Label("Distance covered: "+ (Mathf.Round(meters*100)/100) + " meters");
				//Distance in feet
			
			    GUILayout.BeginArea (Rect (areaWidth*0.1, areaHeight*0.22, areaWidth*0.4, _labelHeight));
			    GUILayout.Label("Distance covered: "+ (Mathf.Round(meters*3.2808*100)/100) + " Ft.");
				GUILayout.EndArea();
				
				_displaySeconds = Mathf.CeilToInt(elapsedTime)%60;
				_displayMinutes = Mathf.CeilToInt(elapsedTime)/60;		
			
				GUILayout.BeginArea (Rect (areaWidth*0.55, areaHeight*0.22, areaWidth*0.4, _labelHeight));
	  		    //GUILayout.Label("Elapsed time: "+ _displayMinutes.ToString("00") + " min "+ _displaySeconds.ToString("00") + " sec");
				GUILayout.Label("Remaining time: "+ (Mathf.FloorToInt(_leftTime)/60).ToString("00") + " min "+ (Mathf.FloorToInt(_leftTime)%60).ToString("00") + " sec");
				GUILayout.EndArea ();
				
			   GUILayout.BeginArea (Rect (areaWidth*0.8, areaHeight*0.05, areaWidth*0.15, _labelHeight));
		       if (_goalReached || _timerReached ){
		       		Debug.Log("Reached the max time");
			       if (GUILayout.Button("Play Again")){
					 isPlaying = false;  
					 GetComponent(InfoPolarBear).ShowInfo(false);
				     Initialize();    
				   }	   
		       }
		       else if (GUILayout.Button("Cancel Game")){
		         GetComponent(InfoPolarBear).ShowInfo(false);
				 isPlaying = false;  
				 GetComponent(AppendToLog).AppendDataToLog();
			     GetComponent.<NetworkView>().RPC ("StopGame", RPCMode.Others,burnedCalories); 
			     Initialize();    
			   }
			   GUILayout.EndArea();  
				   
				// show map Button
			    GUILayout.BeginArea (Rect (areaWidth*0.03, areaHeight*0.12, _labelHeight*7, _labelHeight));
				if (_showMap){
				    if (GUILayout.Button("<< Back")){	
						_showMap = false;
						_showGraphView = false;
						 _showInterpreterList = false;
		                 GetComponent(GameParameters).showGameParameters(false);
						}
				}
				else{
				 if (GUILayout.Button("Bird's eye view")){	
						_showMap = true;
						_showGraphView = false;
						 SendMessage("ShowSummaryGraph",false); 
						_showCurrentGraph = false;
						 _showInterpreterList = false;
		                 GetComponent(GameParameters).showGameParameters(false);
						}
				}
				GUILayout.EndArea();
				
				// Show current Calories graph Button
				GUILayout.BeginArea (Rect (areaWidth*0.35, areaHeight*0.12, _labelHeight*8, _labelHeight));
				if (_showCurrentGraph){
				    if (GUILayout.Button("<< Back")){	
				     _showInterpreterList = false;
		             GetComponent(GameParameters).showGameParameters(false);
						_showCurrentGraph = false;
						}
				}
				else{
				 if (GUILayout.Button("Current Calories Graph")){	
						_showCurrentGraph = true;
						_showMap = false;
						_showGraphView = false;
						 _showInterpreterList = false;
		                GetComponent(GameParameters).showGameParameters(false);
					    SendMessage("ShowSummaryGraph",false); 
						}
				}
				GUILayout.EndArea();
				      
				if (_showMap){	
					// Area rendering the map and it's labels
				//	GUILayout.BeginArea (Rect (GetComponent(CurrentPosInMap).posX,GetComponent(CurrentPosInMap).posY,GetComponent(CurrentPosInMap).mapWidth,GetComponent(CurrentPosInMap).mapHeight));
			        //Game Parameters
					GetComponent(CurrentPosInMap).DrawMap();
				//	GUILayout.EndArea();
				}
				if (_showCurrentGraph){
					GetComponent(BurnedCaloriesGraph).PrintBurnedCaloriesGraph();
				}
				else{
					GetComponent(BurnedCaloriesGraph).HideBurnedCaloriesGraph();
				}
				if (_showGraphView){
					SendMessage("PrintSummaryGraph"); 
		            SendMessage("ShowSummaryGraph",true); 
		        }
				
		    }  

		//Return to main view button
		// GUILayout.BeginArea(Rect (areaWidth*0.8, areaHeight*0.85, areaWidth*0.15, _labelHeight));
	     
	 /*
	    GUILayout.BeginArea (Rect (areaWidth*0.65, areaHeight*0.2, areaWidth*0.3, _labelHeight));
	  	GUILayout.Label("Top 10 - Year " + yearList[_currentYear]);  
	    GUILayout.EndArea();
	    
	    GUILayout.BeginArea (Rect (areaWidth*0.65, areaHeight*0.25, areaWidth*0.3, areaHeight*0.50));
	    GUILayout.BeginVertical(GUI.skin.box, GUILayout.Height(areaHeight*0.50), GUILayout.Width(areaWidth*0.3));

	    
	    for (var i:int = 0; i < 10 ; i++){
	       if (_scoresCount > 0 && i<_scoresCount){
	        var name : String = _scoreNames[i].ToString().Trim();
	        var min : int = Mathf.CeilToInt(float.Parse(_scoreValues[i]))/60;
	    	var sec : int = Mathf.CeilToInt(float.Parse(_scoreValues[i]))%60;
	    	GUILayout.Label( (i + 1).ToString().PadLeft(2) +". " + name.PadRight(13) + 
	    	min.ToString("00") + ":"+
	    	sec.ToString("00") + " min","ScoreStyle"); 
	    	}
	    	else
	    		GUILayout.Label("   " );
	    }
	    
	    GUILayout.EndVertical();
		GUILayout.EndArea();
		*/	
  	  	
  	//End Area for the entire GUI
    GUILayout.EndArea();
  
	///  Game will stop when reach timer    
    if ((isPlaying && _displayMinutes == gameDurationList[_durationGame]) || _goalReached ){
    	if (_goalReached){
    	    GetComponent.<NetworkView>().RPC ("FinishGame", RPCMode.Others,burnedCalories);  
    	}
    	else {
    	    GetComponent.<NetworkView>().RPC ("StopGameTimeOut", RPCMode.Others,burnedCalories);  
    	}
   
       _timerReached = true; 
       if (!_savedLog){
 	    GetComponent(AppendToLog).AppendDataToLog();
 	    GetComponent(SummaryGraph).UpdateAverageValues();
 	    _savedLog = true;
       }
	}
	GetComponent(GameParameters).ShowOnGUI();
	
	if (Event.current.type == EventType.MouseUp && serverTest%3 != 2){
		_selectedPromptIndex = -1;
	}
	
}

function OnPlayerConnected(newPlayer: NetworkPlayer){
	
    //Called on the server only
     _playerNumber = int.Parse (newPlayer.ToString());
               
}

function LoadScores(){
    
	_scoreValues.Clear();
 	_scoreNames.Clear();
 	_scoresCount = 0;
 	
	_DBParameters = [yearList[_currentYear],TOP_SCORES];
    GetComponent(DatabaseConnection).GetScores(_DBParameters);
}

function SetScores(){

	_scoreValues.Clear();
 	_scoreNames.Clear();
 	_scoresCount = 0;
 	
    var topScoresEntries = topScores.Split('|'[0]);
	_scoresCount = topScoresEntries.length-1;

	for (var entry in topScoresEntries)
	{
	   var scoreData : String[]= entry.Split(':'[0]);
	   if (scoreData.Length > 1){
		   _scoreNames.Add(scoreData[ 0 ]);
		   _scoreValues.Add(scoreData[ 1 ]);
	   }
	}
	//Debug.Log("NetworkConnectionServer::Scores count"+_scoresCount);
}


public function playerName(){
    return _playerName;
}

public function reachedGoal(){
      return _goalReached;
}

public function timeElapsed(){
      return "00:"+_displayMinutes.ToString("00") + ":"+ _displaySeconds.ToString("00");
}

public function numberSteps(){
      return _numSwimSteps.ToString() +"|"+ _numWalkSteps.ToString();
}

public function swimSteps(){
	 return _numSwimSteps.ToString();
}

public function walkSteps(){
	return _numWalkSteps.ToString();
}
public function swimCalories(){
//_numSwimSteps
	return (_numSwimSteps* 1.15583174).ToString();
}
public function walkCalories(){
//_numWalkSteps
	return (_numWalkSteps * 0.4445).ToString();
}
public function currentYear(){
     return yearList[_currentYear];
}
public function currentGameDuration(){
    Debug.Log("Current Game duration"+gameDurationList[_durationGame].ToString());
	return gameDurationList[_durationGame].ToString();
}
@RPC
function ReceivedMovementInput (_steps: String ,  info : NetworkMessageInfo)
{
    //Called on the server only
    if (isPlaying){
	    //Called on the server
	    var values = _steps.Split(":"[0]);
	    if (values.length == 4 ){
		    
		    if (parseInt(values[0]) != _numWalkSteps){
		        _numWalkSteps = parseInt(values[0]);
		    }
		    if (parseInt(values[1]) != _numSwimSteps){
		        _numSwimSteps = parseInt(values[1]);
		    }
			GetComponent(CurrentPosInMap).UpdateCurrentPosition(_steps);
			_currentPos = new Vector2(0,parseFloat(values[3]));
	   }
   }
}
@RPC
function SendEventId (_id: int)
{
	 //Called on the server only
	Debug.Log("imagen actual: " + _id);	 
   GetComponent(InfoPolarBear).SetCurrentInfo(_id);
}

@RPC
function ReceivedFinishedLevel (_steps: String ,  info : NetworkMessageInfo)
{
	 //Called on the server only
    _goalReached = true;
    //Commented out for iPad demo
    
    if (!_savedLog){
	    GetComponent(AppendToLog).AppendDataToLog(); 	
	    GetComponent(SummaryGraph).UpdateAverageValues();
	    GetComponent(SummaryGraph).GetHistoricalAverageValues();
	    _savedLog = true;
    }
}

@RPC
function SetGoalBearInMap (_xyValues: String, info : NetworkMessageInfo)
{
	 //Called on the server only
     GetComponent(CurrentPosInMap).SetGoalBearInMap(_xyValues);
     
     var values = _xyValues.Split(":"[0]);
     var _x = parseFloat(values[2]);
     var _z = parseFloat(values[3]);
     _initialPos = new Vector2(0,_z);  
     _currentPos = new Vector2(0,_z);   
}

@RPC
function ShowInfoPolarBear (_value: int, info : NetworkMessageInfo)
{
	 //Called on the server only
     GetComponent(InfoPolarBear).SetCurrentInfo(_value);
     
}
@RPC
function SaveLogDocent (_level: String)
{
	 //Called on the Clients
}
@RPC
function LoadLevelInClient (_level: String)
{
	 //Called on the Clients
}
@RPC
function FinishGame (_calories: float ,  info : NetworkMessageInfo)
{
	 //Called on the Clients
}
@RPC
function StopGame (_calories: float ,  info : NetworkMessageInfo)
{
	 //Called on the Clients
}
@RPC
function StopGameTimeOut (_calories: float ,  info : NetworkMessageInfo)
{
	 //Called on the Clients
}
