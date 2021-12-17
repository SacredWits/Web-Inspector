cfg.MUI, cfg.Light


function OnStart()
{
    app.EnableBackKey( false );
    color = MUI.colors.blue
    app.InitializeUIKit(color.blue)
    eruda = app.ReadFile( 'eruda.js' );
    dr = {}
    /*
    //Drawer
    dr.lay = app.CreateLayout( "Linear", "Vertical,FillXY" );
    	dr.lay.SetBackColor( "#303030");
    	app.AddDrawer( dr.lay, "left", 1 );
    	//Top Bar
    	dr.bar = MUI.CreateAppBar("Scripts", "", "apps,code,info");
    		dr.h = 1-dr.bar.GetHeight();
    	//Scroller
    	dr.scr = app.CreateScroller( 1, dr.h, "NoScrollbar" )
    		dr.scr.lay = app.CreateLayout( "Absolute", "FillXY" )
    		dr.scr.AddChild( dr.scr.lay );
    		//Script .Library
    			dr.lib = {}
    			dr.lib.lay = app.CreateLayout( "Linear", "Vertical,FillXY" )
    			dr.lib.list = MUI.CreateListModern(
    				[
    					{title: 'wikipedia', body: 'get all languages list from wikipedia'},
    					{title: 'youtube', body: 'get all languages list from wikipedia'},
    					{title: 'libgen', body: 'get all languages list from wikipedia'}
    				]
    			);
    			dr.lib.lay.AddChild( dr.lib.list );
    		dr.scr.lay.AddChild(dr.lib.lay);
    dr.lay.AddChild( dr.scr );
    dr.lay.AddChild( dr.bar );
    
    //Events
    dr.bar.SetOnControlTouch(function(key){
    	switch( key ){
    		case "apps":
    			dr.bar.SetTitleText( "Scripts" );
    		break;
    		case "code":
    			dr.bar.SetTitleText( "IDE" );
    		break;
    		case "info":
    			dr.bar.SetTitleText("Terminal");
    		break;
    		
    	}
    });
    */
    tabs = [];
    currentTab = -1;
    NewTab();
}

function Tab(){
	var self = this;
	self.lay = MUI.CreateLayout("Linear", "Vertical,FillXY")
    
    //BottomBar
	self.barBottom = MUI.CreateAppBar("Tab "+(tabs.length+1), "link", "close,settings,arrow_back,arrow_forward")
	self.barBottom.SetOnMenuTouch( function(){
        self.urlInput.SetText( self.web.GetUrl() );
        self.urlModal.Show();
    } );
    
    //Main WebView
	self.barH = self.barBottom.GetHeight()
	self.webScr = app.CreateScroller( 1, 1-(self.barH) );
	self.webLay = app.CreateLayout( "Linear", "FillXY" );
	self.webScr.AddChild( self.webLay );
	self.lay.AddChild( self.webScr );
	self.web = app.CreateWebView( 1, 1-(self.barH), "AllowZoom", .1 );
	self.web.SetScale( 1, 1 );
    self.webLay.AddChild(self.web)
    
    self.lay.AddChild(self.barBottom)
    
    self.urlModal = MUI.CreateModal( "WEBSITE URL", "", "GO", "CANCEL", false );
    self.urlModalLay = self.urlModal.GetLayout();
    self.urlModalLay.SetBackColor( "#eeeeee" );
    self.urlModal.SetOnTouch(function(isOk){
      if(isOk){
      	var url = self.urlInput.GetText();
  		self.url = url.trim();
  		if( self.url ){
      		self.web.SetOnProgress( function( progress ){
      		    if( progress==100 ){
      	            self.barBottom.SetTitleText( "Tab " + (currentTab+1) );
      	            app.ShowPopup( "Press the settings button to enable launch inspector" );
      		    }else
          			self.barBottom.SetTitleText( "Loading " + progress + '%' );
      		} );
      		self.web.LoadUrl( self.url );
  		}
      }
    });
    self.url = "";
    self.urlModalProto = app.CreateLayout( "Linear", "Horizontal,FillXY" );
    self.urlModalLay.AddChild( self.urlModalProto );
    
    self.urlModalHttp = app.CreateButton( "[fa-globe] http://", -1, -1, "FontAwesome" );
    self.urlModalProto.AddChild(self.urlModalHttp);
    self.urlModalHttp.SetOnTouch( function(){
        self.urlInput.SetText( "http://" );
    } );
    
    self.urlModalHttps = app.CreateButton( "[fa-lock] https://", -1, -1, "FontAwesome" );
    self.urlModalProto.AddChild(self.urlModalHttps);
    self.urlModalHttps.SetOnTouch( function(){
        self.urlInput.SetText( "https://" );
    } );
    
    self.urlInput = MUI.CreateTextEditSearch( 0.9, "Left", "Enter URL" );
    self.urlInput.SetMargins( 0, 0.0, 0, 0.03 );
    self.urlModalLay.AddChild( self.urlInput );
    
    self.urlModalList = MUI.CreateList( ["//sacredwits.com:https:[fa-globe]","//google.com:https:[fa-globe]"], 0.8, 0.2 );
    self.urlModalList.SetOnTouch( function( title, body ){
        self.web.LoadUrl( body + ":" + title );
        self.urlModal.Hide();
    } );
    self.urlModalLay.AddChild( self.urlModalList );
    
    self.webSize = 100
    self.urlModalSliderVal = MUI.CreateTextSecondary( "Viewport Size : " + self.webSize + "%", 0.9, -1 );
    self.urlModalSliderVal.SetPadding( 0.02, 0.0, 0.0, 0.0 );
    self.urlModalLay.AddChild( self.urlModalSliderVal );
    self.urlModalSlider = MUI.CreateSeekBar( self.webSize, 1000, 0.9 );
    self.urlModalSlider.SetOnTouch( function( val ){
        self.urlModalSliderVal.SetText( "Viewport Size : " + val + "%" );
        self.web.SetSize( val/100, 1-(self.barH) );
    } );
    self.urlModalLay.AddChild( self.urlModalSlider );
    
    self.userAgentText = MUI.CreateTextSecondary( "User Agent", 0.9 , -1, "" );
    self.userAgentText.SetPadding( 0.02, 0.02, 0.0, 0.0 );
    self.urlModalLay.AddChild( self.userAgentText );
    self.userAgentVal = MUI.CreateTextParagraph( navigator.userAgent, 0.9, -1, "Multiline,Monospace,Left" );
    self.userAgentVal.SetTextColor( "#999999" );
    self.userAgentVal.SetPadding( 0.02, 0.01 ,0.0 ,0.0 );
    self.urlModalLay.AddChild( self.userAgentVal );
    self.userAgentLay = app.CreateLayout( "Linear", "Horizontal,FillX,Left" );
    self.userAgentLay.SetPadding( 0.02, 0.0 ,0.0 ,0.0 );
    self.urlModalLay.AddChild( self.userAgentLay );
    self.userAgentEdit = MUI.CreateButtonRaised( "Change [fa-pencil]" );
    self.userAgentEdit.SetTextSize( "10" );
    self.userAgentEdit.SetOnTouch( function(){
        var newUserAgent = prompt( "Paste User Agent" );
        newUserAgent = newUserAgent ? newUserAgent : navigator.userAgent;
        self.web.SetUserAgent( newUserAgent );
        self.userAgentVal.SetText( newUserAgent );
        app.ShowPopup( "User agent changed" );
    } );
    self.userAgentLay.AddChild( self.userAgentEdit );
    self.userAgentSite = MUI.CreateButtonFlat( "View all" );
    self.userAgentSite.SetTextSize( "10" );
    self.userAgentSite.SetOnTouch( function(){
        self.web.LoadUrl( "http://useragentstring.com/pages/useragentstring.php" );
        self.urlModal.Hide();
    } );
    self.userAgentLay.AddChild( self.userAgentSite );
    
    
    
    self.barBottom.SetOnControlTouch(function(menu){
        switch(menu){
            case "arrow_forward":
                NextTab();
            break;
            case "arrow_back":
                PrevTab();
            break;
            case "settings":
                if( self.web.GetUrl().trim().length>0 )
                    self.web.Execute( `(
                        function () {
                            if( typeof eruda !== 'undefined' ){
                                if(eruda._shadowRoot.querySelector(".eruda-dev-tools").style.display=='none'){
                                    eruda.show();
                                    return
                                }else{
                                    eruda.hide();
                                    return;
                                }
                            }
                            try{
	                            `+eruda+`
                                eruda.init()
                                eruda._entryBtn.hide();
                                eruda.show();
                              }catch(e){
                              	alert(e);
                              }
                        })();` );
                else
                    app.ShowPopup( "Visit a website first" );
            break;
            case "link":
                self.urlInput.SetText( self.web.GetUrl() );
                self.urlModal.Show();
            break;
            case "close":
                if( tabs.length==1 ){
                    if( confirm("Close tab and exit app?") ){
                        app.DestroyLayout(tabs[currentTab].lay);
                        app.Exit();
                    }
                }else{
                    app.DestroyLayout(tabs[currentTab].lay);
                    tabs.splice( currentTab,1 );
                    if(tabs.length>currentTab){
                        currentTab = currentTab-1
                        NextTab();
                    }else{
                        PrevTab();
                    }
                }
            break;
        }
    });
    self.web.SetOnError( function( err ){
        //app.ShowPopup( err );
    } );
}

function NextTab(){
	if(currentTab==(tabs.length-1)){
		NewTab();
	}else{
		if(tabs[currentTab])
			tabs[currentTab].lay.Animate( "SlideToLeft" );
		currentTab++;
		tabs[currentTab].lay.Animate( "SlideFromRight" );
	}
}

function PrevTab(){
	if(currentTab==0){
		app.ShowPopup( "No Previous Tab" );
	}else{
	    if( tabs[currentTab] )
    		tabs[currentTab].lay.Animate( "SlideToRight" );
    	currentTab--;
		tabs[currentTab].lay.Animate( "SlideFromLeft" );
	}
}

function NewTab(){
		var ln = tabs.length;
    tabs[ln] = new Tab();
		app.AddLayout(tabs[ln].lay);
		if( ln>0 ){
			tabs[currentTab].lay.Animate( "SlideToLeft" );
			tabs[ln].lay.Animate( "SlideFromRight" );
		}
		currentTab++;
}


function OnBack()
{
    if( tabs.length>0 ){
        var web = tabs[currentTab];
        if( web.web.CanGoBack() ){
            web.web.Back();
            return;
        }
    }
    var yesNo = app.CreateYesNoDialog( "Exit App?" );
    yesNo.SetOnTouch( yesNo_OnTouch );
    yesNo.Show();
}

function yesNo_OnTouch( result )
{
    if( result=="Yes" ) app.Exit();
}