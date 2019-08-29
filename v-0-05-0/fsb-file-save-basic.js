"use strict";

/* globals JSZip*/
// jshint esversion: 6
// jshint loopfunc: true


const FSB = {

	"copyright": "Copyright 2019 pushMe pullYou authors",
	"date": "2019-08-12",
	"description": "Save data to text file or compressed in a ZIP file using the file save dialog box. Uses pkZip.js.",
	"helpFile": "https://pushme-pullyou.github.io/tootoo14/js-14-07/fSb-file-open-basic/README.md",
	"license": "MIT License",
	"title": "Fils save basic FSB",
	"urlSourceCode": "https://github.com/pushme-pullyou/tootoo14/blob/master/js-14-07/fSb-file-open-basic/fSb-file-open-basic.js",
	"version": "0.14.07-0fSb"

};

FSB.name = "test.txt";



FSB.getMenuFileSaveBasic = function( sourceContents, targetHelpFile ) {

	if ( !FSB.zip ) {

		FSB.zip = document.body.appendChild( document.createElement( 'script' ) );
		FSB.zip.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js";

	}

	FSB.sourceContents = sourceContents;

	FSB.target = targetHelpFile || document.body.appendChild( document.createElement( 'div' ) );

	const htm =
	`
	<details>

		<summary>Save data to file</summary>

		<button id=butFILSave class=butHelp onclick="FSB.getHelp();" >?</button>

		<p>
			<button onclick=FSB.butSaveFile(FSB.sourceContents); >Save file as XML</button>
		</p>

		<p>
			<button onclick=FSB.butSaveFileZip(FSB.sourceContents); >Save file as gbXML in ZIP</button>
		</p>

	</details>

	`;

	return htm;

};



FSB.getHelp = function() {

	const htm =
	`
		<h3>${ FSB.title }</h3>

		<p>${ FSB.description }</p>

		<p>${ FSB.copyright }. ${ FSB.license }.</p>

		<p>${ "source code".link( FSB.urlSourceCode ) } - v${ FSB.version } - ${ FSB.date }</p>
	`;



	FSB.target.innerHTML = htm;

	navDragMove.hidden = false;
};



FSB.butSaveFile = function( text ) {

	//console.log( 'text', text );

	const blob = new Blob( [ text ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );

	a.download = FSB.name;
	a.click();
	a = null;

};



FSB.butSaveFileZip = function( text ) {

	const name = FSB.name.replace( /\.xml/i, ".zip" );
	const zip = new JSZip();

	zip.file( FSB.name, text );

	zip.generateAsync( { type:"blob", compression: "DEFLATE" } )

		.then( function( blob ) {

			let a = document.body.appendChild( document.createElement( 'a' ) );
			a.href = window.URL.createObjectURL( blob );
			a.download = name;
			a.click();
			a = null;

	} );

};