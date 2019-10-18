/* globals */
// jshint esversion: 6
// jshint loopfunc: true

//"use strict";

var GXF = {
	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-09-11",
		description: "Parse gbXML surfaces",
		helpFile: "../js-gbxml/gxf-gbxml-fixer.md",
		license: "MIT License",
		urlSourceCode: "../js-gbxml/gxf-gbxml-fixer.js",
		version: "0.05.00-3gxfx"
	}

};




GXF.init = function( target ) {

	FOB.xhr.addEventListener( 'load', GXF.onXhrResponse, false );
	FOB.reader.addEventListener( 'load', GXF.onReaderResult, false );
	document.body.addEventListener( 'FOBonZipFileLoad', GXF.onFileZipLoad, false );
	document.body.addEventListener( 'onZipFileParse', GXF.onFileZipLoad, false );

	FOBdet.open = true;

};



// GXF.onXhrResponse = function( event ) { GXF.parseFile( event.target.response ); };

// GXF.onReaderResult = function() { GXF.parseFile( FOB.reader.result ); };

// GXF.onFileZipLoad = function() { GXF.parseFile( FOB.text ); };


GXF.onXhrResponse = function( event ) { GXF.gbXML = event.target.response; };

GXF.onReaderResult = function () { GXF.gbXML = FOB.reader.result; };

GXF.onFileZipLoad = function () { GXF.gbXML = FOB.text; };


GXF.parseFile = function () {


	let gbxml = GXF.gbXML;
	console.log( '',  GXF.gbXML );

	if ( !gbxml || gbxml.includes( "xmlns" ) === false ) { return; }

	divContents.innerHTML = `Working on ${ FOB.name }`;

	console.log( 'bytes', gbxml.length );

	gbxml = gbxml.charAt( 0 ) === "<" ? gbxml : gbxml.slice( 1 );

	//console.log( 'gbxml', gbxml.slice( 0, 200 ) );

	GXF.gbxml = gbxml;
	//console.log( 'gbxml', gbxml );

	GXF.timeStart = performance.now();

	GXF.openings = GXF.gbxml.match( /<Opening(.*?)<\/Opening>/gis );

	GXF.openingsUpdated = 0;

	if ( GXF.openings ) {

		GXF.openings.forEach( opening => {

			const openingType = opening.match( /openingType="(.*?)"/i );

			const idRef = opening.match( /windowTypeIdRef="(.*?)"/i );

			if ( !idRef ) {

				const txt = `${ openingType[ 0 ] } windowTypeIdRef="${ openingType[ 1 ] }"`;
				//console.log( 'txt', txt );

				const newOpening = opening.replace( openingType[ 0 ], txt );
				//console.log( 'newOpening', newOpening );

				GXF.gbxml = GXF.gbxml.replace( opening, newOpening );
				//console.log( 'surface', surface );

				GXF.openingsUpdated ++;

			}

		} );
	}



	GXF.surfaces = GXF.gbxml.match( /<Surface(.*?)<\/Surface>/gis );

	GXF.surfacesUpdated = 0;

	GXF.surfaces.forEach( surface => {

		const type = surface.match( /surfaceType="(.*?)"/i );

		if ( type[ 1 ] !== "Air" && type[ 1 ] !== "Shade") {

			const construction = surface.match( /\<surface(.*?)constructionIdRef="(.*?)"(.*?)\r/i );

			if ( !construction ) {

				//console.log( 'construction', construction );

				const txt = `${ type[ 0 ] } constructionIdRef="${ type[ 1 ] }"`

				//console.log( 'txt', txt );

				const newSurface = surface.replace( type[ 0 ], txt )

				GXF.gbxml = GXF.gbxml.replace( surface, newSurface );

				GXF.surfacesUpdated ++;

			} else {

				console.log( { construction } );
			}

		} else {

			//console.log( '', type );

		}

	} );

	GXF.gbxml = GXF.gbxml.replace( /<\/Campus>/i, `</Campus> ${ FSC.constructions }` );

	GXF.gbxml = GXF.gbxml.replace( /encoding="UTF-16"/i, `encoding="UTF-8"` );


	divContents.innerHTML =
	`
		<h3>Construction data added</h3>

		<p>${ GXF.gbxml.length.toLocaleString() } bytes processed</p>

		<p>Openings found: ${ GXF.openings.length } - updated: ${ GXF.openingsUpdated }</p>

		<p>Surfaces found: ${ GXF.surfaces.length } - updated: ${ GXF.surfacesUpdated }</p>

		<p>File size: ${ GXF.gbxml.length.toLocaleString() }</p>

		<p>Ready to save. File menu » 'Save data to file' » Click 'Save to file' </p>


		<p>Happy simulating!</p>
	`;

	FSB.text = GXF.gbxml;

	console.log( 'FOB.text', FOB.text.length );

	FSB.fileName = FOB.fileName;

};

