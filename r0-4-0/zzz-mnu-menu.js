// Copyright 2019 pushMe-pullYou authors. MIT License
/* global THREE * /
/* jshint esversion: 6 */


const MNU = { "release": "R13.2", "date": "2019-03-04" };


MNU.description =
	`
		TooToo Menu (MNU) generates standard HTML TooToo menu code and content and code that works on computers, tablets and phones
	`;

////////// currentStatus items are for the question marks in the main HTML document

	MNU.currentStatusMenu =
	`
		<h3>TooToo Menu (MNU) ${ MNU.release} ~ ${ MNU.date }</h3>

		<p>${ MNU.description }</p>

		<p>
			Concept
			<ul>
				<li>Creates default menu header and footer content and code</li>
				<li>Code for hamburger sliding menu</li>
				<li>Code for pop-up window</li>
				<li>Code to add and select and load theme stylesheets</li>
			</ul>

		</p>

		<p>This module is ready for light testing.</p>

		<p><a href="https://pushme-pullyou.github.io/tootoo13/tootoo13.html#cookbook/mnu-menu/README.md" target="_blank" >TooToo Menu Read Me</a></p>

		<details>

			<summary>Change log</summary>

			<ul>
				<li>2019-03-04 ~ 15.0 ~ update github mark</li>
				<li>2019-02-13 ~ Add rate limits popup closer</li>
				<li>2019-02-07 ~ R13/1.0 ~ refactor styles / code cleanup</li>
				<li>2019-01-15 ~ Add MNU.description text content and code</li>
				<li>2019-01-14 ~ Update text content</li>
				<li>2019-01-12 ~ Add MNUdetFooter id and set to open in test HTML</li>
				<li>2019-01-11 ~ Add close button to status pop-up and improve pop-up toggling</li>
				<li>2019-01-09 ~ Content update and minor code fixes</li>
				<li>2019-01-09 ~ Add vars: MNU.descriptionTooToo, MNU.footerUrl, MNU.footerTarget, MNU.footerIssues</li>
				<li>2018-12-29 ~ Add helpItem class</li>
				<li>2018-12-28 ~ Current Status link changed to question mark</li>
				<li>2018-12-28 ~ Content displayed in the Pop-Up</li>
				<li>2018-12-22 ~ Themes added</li>
				<li>2018-12-22 ~ Update subtext</li>
				<!-- <li></li>
				-->
			</ul>

		</details>
	`;


////////// boilerplate for downstream users

MNU.urlSourceCodeImage = "https://pushme-pullyou.github.io/github-mark-64.png";
MNU.urlSourceCodeIcon = `<img src="${ MNU.urlSourceCodeImage }" height=18 style=opacity:0.5 >`;
MNU.urlSourceCode = "https://github.com/pushme-pullyou/tootoo13/tree/master/js-tootoo13-1";


MNU.descriptionTooToo =
	`
		<h3>
			<a href="https://github.com/pushme-pullyou/tootoo13" target="_blank">${ MNU.urlSourceCodeIcon }</a>
			<a href="https://pushme-pullyou.github.io#tootoo13/README.md" target="_blank">
				TooToo13 Read Me
			</a>
		</h3>

		<p>
			<ul>
				<li>TooToo is a collection of JavaScript scripts to help you browse and view the contents of many files on <a href="https://github.com">GitHub</a> with remarkable ease</li>
				<li>View HTML, <a href="https://en.wikipedia.org/wiki/Markdown">Markdown</a>, images and many other file types as rendered web pages or as source code</li>
				<li>Traverse a tree menu, select and display folder and file names in  with single clicks</li>
				<li>Open local files with OS file dialog or by drag and drop and open remote files with a URL</li>
				<li>Access files quickly and then edit and commit changes to source using the GitHub interface</li>
				<li>Web app with sliding menu that works on computer, tablet or phone</li>
				<li>Written in plain-vanilla JavaScript / Uses the <a href="https://developer.github.com/v3/">GitHub Developer API</a> / Hosting with <a href="https://pages.github.com/">GitHub Pages</a> / Simple CSS theme selection</li>
			</ul>
		</p>

		<p>TooToo is is one of several apps in the <a href="https://pushme-pullyou.github.io" target="_blank">pushMe-pullYou</a> GitHub organization</p>
	`;


MNU.currentStatusCore =
	`
		<h3>MNU.currentStatusCore</h3>

		<p>This web page is built with:</p>

		${ MNU.descriptionTooToo }
	`;



MNU.info = "README.md";

// For main menu header
MNU.homeText  = "homeText";
MNU.homeTitle = "homeTitle";
MNU.homeUrl   = "";

MNU.repoText  = "repoText";
MNU.repoTitle = "repoTitle";
MNU.repoUrl   = "";

MNU.appText  = "appText";
MNU.appTitle = "appTitle";
MNU.appUrl   = "";

MNU.footerUrl    = "#";
MNU.footerTarget = ""; //"target=_blank";
MNU.footerIssues = "https://github.com/pushme-pullyou/pushme-pullyou.github.io/issues";



//////////

MNU.getNavHeader = function() {

	const htm  =
	`
	<div class=navSubMenunn >
		<h3>
			<a href="${ MNU.homeUrl }" title="${ MNU.homeTitle }" target="_top">
				${ MNU.homeText }
			</a>
			${ MNU.homeText ? '&raquo;' : '' }
			<a href="${ MNU.repoUrl }" title="${ MNU.repoTitle }" target="_top">
				${ MNU.repoText }
			</a>
			${ MNU.repoText ? '&raquo;' : '' }
			<a href="${ MNU.appUrl }" title="${ MNU.appTitle }" >
				${ MNU.appText }
			</a>
			${ MNU.appText ? '&raquo;' : '' }
		</h3>

		<h2>
			<a href=${ MNU.urlSourceCode } ${ MNU.footerTarget } title="Source code on GitHub" >
			${ MNU.urlSourceCodeIcon }
			</a>
			<a href="" title="Click to reload this page" >${ document.title } <span id=titleRelease >R${ document.head.querySelector( '[ name=release ]' ).content }</span></a>

			<button class=butHelp id=butTitle onclick="MNU.setPopupShowHide(butTitle,MNU.info);" style=float:right; >?</button>

		</h2>

		<p>
			${ MNU.description }

			<a id=mnuHead class=helpItem href="JavaScript:MNU.setPopupShowHide(mnuHead,MNU.currentStatusMenu);"
				title="Current status" >&nbsp; ? &nbsp;
			</a>
		</p>

	</div>
	`;

	return htm;

};



MNU.getNavFooter = function() {

	const htm  =
	`
		<details id=MNUdetFooter >

			<summary class=sumMenuTitle >Help menu
				<button id=butFoot class=butHelp onclick="MNU.setPopupShowHide(butFoot,MNU.currentStatusMenu);" style=float:right; >?</button>
			</summary>

			<div title='many thanks!' ><a href=${ MNU.footerUrl }pages/about-tootoo.md ${ MNU.footerTarget } >About TooToo</a></div>
			<div title='many thanks!' ><a href=${ MNU.footerUrl }pages/credits.md ${ MNU.footerTarget } >Credits</a></div>
			<div><a href=${ MNU.footerUrl }pages/code-of-conduct.md ${ MNU.footerTarget } >Code of conduct</a></div>
			<div><a href=${ MNU.footerUrl }pages/contributing.md ${ MNU.footerTarget } >Contributing via GitHub</a></div>
			<div><a href=${ MNU.footerUrl }pages/license.md ${ MNU.footerTarget } >MIT License</a></div>
			<div><a href=${ MNU.footerUrl }pages/markdown-help.md ${ MNU.footerTarget } >Markdown help</a></div>
			<div><a href=${ MNU.footerUrl }pages/themes.md ${ MNU.footerTarget } >Themes help</a></div>
			<div>&raquo; <a title='Need help' href=${ MNU.footerIssues } target=_blank >${ MNU.repoText } GitHub Issues</a></div>
			<div><button onclick=MNU.showFps() >Show frames/second statistics</button></div>
			<div><button id=MNUbutRateLimits onclick=MNU.rateLimits(); >View GitHub API rate limits</button>
			<hr>

		</details>
	`;

	return htm;

};

// call using:
//<a id=mnuFoot class=helpItem href="JavaScript:MNU.setPopupShowHide(mnuFoot,MNU.currentStatusMenu);" >&nbsp; ? &nbsp;</a>



MNU.showFps = function(){

	const script = document.body.appendChild( document.createElement('script') );

	script.onload = function() {

		MNU.stats = new Stats();

		document.body.appendChild( MNU.stats.dom );

		loop();

	}

	script.src='https://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';

	function loop(){

		MNU.stats.update();
		requestAnimationFrame( loop );

	}

};



MNU.rateLimits = function() {

	const url = "https://api.github.com/rate_limit";

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.onload = callback;
	xhr.send( null );

	function callback( xhr ) {

		const text =
		`
			<h3>GitHub rate limits status</h3>

			<p>
				Some TooToo scripts use the GitHub Developer API which has rate limits.
			</p>

			<p>See <a href="https://developer.github.com/v3/#rate-limiting" target="_blank">developer.github.com/v3</a>.</p>

			<pre> ${ xhr.target.response } </pre>
		`;

		MNU.setPopupShowHide( MNUbutRateLimits, text );

	}

}



//////////

MNU.setPopupShowHide = function( id, text ) {
	//console.log( 'id', id );

	MNU.popupId = id;

	MNU.popupId.classList.toggle( "active" );

	if ( MNU.popupId.classList.contains( 'active' ) ) {

		navPopup.hidden = false;

		if ( text.toLowerCase().endsWith( ".md" ) ) {

			MNU.requestFile( text, MNUdivPopupData );

		} else {

			MNUdivPopupData.innerHTML = text;

		}

		divContents.addEventListener( 'click', MNU.onClickContainer, false );
		divContents.addEventListener( 'touchstart', MNU.onClickContainer, false );

	} else {

		MNU.onClickContainer();

	}

}



MNU.onClickContainer = function() {

	if ( MNU.popupId.classList.contains( 'active' ) === false ) {

		navPopup.hidden = true;
		MNU.popupId.classList.remove( "active" );
		MNUdivPopupData.innerHTML = "";
		divContents.removeEventListener( 'click', MNU.onClickContainer, false );
		divContents.removeEventListener( 'touchstart', MNU.onClickContainer, false );

	}

}



MNU.requestFile = function( url, target ) {

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	//xhr.onerror = ( xhr ) => console.log( 'error:', xhr  );
	//xhr.onprogress = ( xhr ) => console.log( 'loaded', xhr.loaded );
	xhr.onload = ( xhr ) => MNU.callbackMarkdown( xhr.target.response, target );
	xhr.send( null );

};



MNU.callbackMarkdown = function( markdown, target ) {
	//console.log( '', markdown );

	showdown.setFlavor('github');
	const converter = new showdown.Converter();
	const html = converter.makeHtml( markdown );

	target.innerHTML = html
	//console.log( '', html );

	//window.scrollTo( 0, 0 );

};
