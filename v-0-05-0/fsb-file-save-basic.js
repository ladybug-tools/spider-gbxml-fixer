"use strict";

/* globals JSZip*/
// jshint esversion: 6
// jshint loopfunc: true


const FSB = {

	"script": {

		"copyright": "Copyright 2019 pushMe pullYou authors",
		"date": "2019-09-07",
		"description": "Save data to text file or compressed in a ZIP file using the file save dialog box. Uses pkZip.js.",
		"license": "MIT License",
		"title": "File save basic FSB",
		"urlHelpFile":
"https://pushme-pullyou.github.io/tootoo14/js-14-07/fsb-file-save-basic/fsb-file-save-basic.md",
		"urlSourceCode":
"https://github.com/pushme-pullyou/tootoo14/blob/master/js-14-07/fsb-file-save-basic/fsb-file-save-basic.js",
		"version": "0.14.07-1fSb"

	}

};



FSB.initializeMenuHtml = function() {

	const htm =
	`
	<details>

		<summary>Save data to file</summary>

		<button id=FSBbutHelp class=butHelp onclick="FSB.getHelp();" >?</button>

		<p>
			<button onclick=FSB.butSaveFile(); >Save to file</button>
		</p>

		<p>
			<button onclick=FSB.butSaveFileZip(); >Save data to a ZIP file</button>
		</p>

	</details>

	`;

	return htm;

};



FSB.getMenuFileSaveBasic = function() {

	if ( !FSB.zip ) {

		FSB.zip = document.body.appendChild( document.createElement( 'script' ) );
		FSB.zip.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js";

	}

	return FSB.initializeMenuHtml();

};



FSB.getHelp = function() {

	const htm =
	`
		<h3>${ FSB.script.title }</h3>

		<p>${ FSB.script.description }</p>

	`;

	// <p>${ FSB.script.copyright }. ${ FSB.script.license }.</p>

	//FSB.target.innerHTML = htm;

	const info = `${ "source code".link( FSB.script.urlSourceCode ) } - v${ FSB.script.version } - ${ FSB.script.date }`;

	POP.setPopupShowHide( FSBbutHelp,`${ FSB.script.urlHelpFile }`, POP.footer, info );

};



FSB.butSaveFile = function() {

	//FSB.fileName = window.FOB && FOB.fileName ? FOB.fileName : "test.txt";

	//console.log( 'save FOB.text', FOB.text.length );

	//FSB.text = window.FOB && FOB.text ? FOB.text : "Hello, World!";

	const blob = new Blob( [ FSB.text ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );

	a.download = FSB.fileName;
	a.click();
	a = null;

};



FSB.butSaveFileZip = function( text ) {

	FSB.fileName = window.FOB && FOB.fileName ? FOB.fileName : "test.txt";

	FSB.text = window.FOB && FOB.text ? FOB.text : "Hello, World!";

	const name = FSB.fileName.replace( /\.[0-9a-z]+$/i, ".zip" );

	const zip = new JSZip();

	zip.file( FSB.fileName, FSB.text );

	zip.generateAsync( { type:"blob", compression: "DEFLATE" } )

		.then( function( blob ) {

			let a = document.body.appendChild( document.createElement( 'a' ) );
			a.href = window.URL.createObjectURL( blob );
			a.download = name;
			a.click();
			a = null;

	} );

};