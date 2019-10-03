/* eslint strict: ["error", "global"] */

"use strict";

/* globals performance, MNU, VGC, POP, navDragMove, divDragMoveContent */
// jshint esversion: 6
// jshint loopfunc: true


const FSC = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors",
		"date": "2019-10-02",
		"description": "description",
		"helpFile": "",
		"license": "MIT License",
		"sourceCode": "",
		"version": "0.05.01-0fsc"

	}

};

FSC.sourceFolder = "https://www.ladybug.tools/spider-gbxml-fixer/assets/constructions/";

FSC.sourceFiles = [

	"construction-defaults.txt",
	"construction-uk-building-regs-2010-part-l-2a.txt"

];

FSC.getMenuSelectConstruction = function () {

	const source =
	`
		<a href=${ MNU.urlSourceCode + FSC.script.sourceCode } target=_blank >
		${ MNU.urlSourceCodeIcon } source code</a>
	`;

	const help = ""; //VGC.getHelpButton(
	//	"TMPbutSum", FSC.script.helpFile, POP.footer, source );

	const htm =
		`
		<div>

		<p>Select construction, layer, material and window type to be added if needed to gbXML file</p>
			<select onclick=FSC.fetchConstructionFile(this) size=2 >
				<option selected >Minimum defaults</option>
				<option>UK Building Regulations 2010 England</option>
			<select>

			<p><button onclick=GXF.parseFile(); >Fix file by adding construction data</button></p>
		</div>
		`;

	return htm;

};


FSC.fetchConstructionFile = function ( select ) {

	const timeStart = performance.now();

	const url = FSC.sourceFolder + FSC.sourceFiles[ select.selectedIndex ]

	FSC.fetchFile( url, divConstructionText )

};



FSC.fetchFile = function ( url, target ) {

	fetch( new Request( url ) )
		.then( response => response.text() )
		.then( text => FSC.constructions = text );

};