//Copyright 2019 Ladybug Tools authors. MIT License
/* globals FIL, divContents, GGD, GCS, OCV, GBXh1FileName, */
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const GBX = { release: "0.4.0", date: "2019-04-22" };

GBX.description = `Run basic checks on gbXML files to identify, report and fix issues`;


GBX.xxxxcurrentStatus =
	`
		<h3>Get Spider gbXM Fixer (GBX) ${ GBX.release } status ${ GBX.date }</h3>

		<p>${ GBX.description }</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/r2/spider-gbxml-fixer-core.js" target="_blank">
			spider-gbxml-fixer-core.js source code</a>
		</p>
		<details>
			<summary>Wish List / To Do</summary>
			<ul>
				<li></li>
			</ul>
		</details>
		<details>
			<summary>Change log</summary>
			<ul>
  				<li>2019-04-22 ~ F - First commit</li>
			</ul>
		</details>
	`;


GBX.divFixThings =
	`
		<br><br>

		<h2 id=GBXh1FileName >Check file: <script>decodeURI( FIL.name ) </script></h2>

		<iframe id=GBXifr style=height:300px;width:600px; ></iframe><br>

		<i>Preview model is for visual verification only and is not connected to fixer</i>

		<p>
			<button onclick=GBX.runAll(); >Run all checks</button>

			<button onclick=GBX.closeAll(); >Close all checks</button>

		</p>

		<p>
			<input type=checkbox id=GBXinpIgnoreAirSurfaceType > Ignore Air surface type
		</p>

		<div id=GGDdivGetGbxmlData ></div>

		<div id=GCSdivGetCheckStrings ></div>

		<div id=GCOdivGetCheckOffset ></div>

		<div id=OCVdivGetOpeningsCheckVertices ></div>

		<div id=FXAdivGetFixAttributes ></div>

		<div id=FXSTIdivGetSurfaceTypeInvalid ></div>

		<div id=FSTNdivGetSurfaceTypeName ></div>

		<div id=FETSdivGetFixExposedToSun ></div>

		<div id=FDPCdivGetDuplicatePlanar ></div>

		<div id=FASSTdivSpacesWrongType ></div>

		<div id=FASEdivSpaceExtra ></div>

		<div id=FASDdivSpaceDuplicate ></div>

		<div id=FASAdivFixAirSingleAdjacent ></div>

		<div id=FCIMdivGetCadIdMissing ></div>

		<div id=GBXdivGetTemplate ></div>

		<hr>

		<center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > <img src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" height=24 > </a></center>

	`;



GBX.colorsDefault = {

	InteriorWall: 0x008000,
	ExteriorWall: 0xFFB400,
	Roof: 0x800000,
	InteriorFloor: 0x80FFFF,
	ExposedFloor: 0x40B4FF,
	Shade: 0xFFCE9D,
	UndergroundWall: 0xA55200,
	UndergroundSlab: 0x804000,
	Ceiling: 0xFF8080,
	Air: 0xFFFF00,
	UndergroundCeiling: 0x408080,
	RaisedFloor: 0x4B417D,
	SlabOnGrade: 0x804000,
	FreestandingColumn: 0x808080,
	EmbeddedColumn: 0x80806E,
	Undefined: 0x88888888

};

GBX.colors = Object.assign( {}, GBX.colorsDefault ); // create working copy of default colors

GBX.surfaceTypes = Object.keys( GBX.colors );

GBX.viewer = "../spider-gbxml-tools/spider-gbxml-viewer/r15/spider-gbxml-viewer15.html";



GBX.init = function() {

	divContents.innerHTML = GBX.divFixThings;

	GBXh1FileName.innerHTML = `File: ${ decodeURI( FIL.name ) }`;

	GGD.getData( FIL.text );

	GGDdivGetGbxmlData.innerHTML = GGD.getGbxmlData( FIL.text );


	GCSdivGetCheckStrings.innerHTML = GCS.getCheckStrings();

	GCOdivGetCheckOffset.innerHTML = GCO.getCheckOffset();

	OCVdivGetOpeningsCheckVertices.innerHTML = OCV.getOpeningsCheckVertices();

	FXAdivGetFixAttributes.innerHTML = FXA.getFixAttributes();

	FSTNdivGetSurfaceTypeName.innerHTML = FSTN.getMenuSurfaceTypeName();

	FETSdivGetFixExposedToSun.innerHTML = FETS.getSurfaceExposedToSun()

	FDPCdivGetDuplicatePlanar.innerHTML = FDPC.getFixDuplicatePlanarCoordinates();

	FASSTdivSpacesWrongType.innerHTML = FASST.getMenuFASST();

	FASEdivSpaceExtra.innerHTML = FASE.getFixAdjacentSpaceExtra();

	FASDdivSpaceDuplicate.innerHTML = FASD.getFixAdjacentSpaceDuplicate();

	FASAdivFixAirSingleAdjacent.innerHTML = FASA.getMenuAirSingleAdjacent();

	FCIMdivGetCadIdMissing.innerHTML = FCIM.getCadIdMissing();



	const url = location.hash ? location.hash : "#" + FIL.urlDefaultFile;

	if ( !FIL.files ) {

		console.log( 'url', url );

		GBXifr.src = `${ GBX.viewer }${ url }`;

	} else {

		//GBXifr.src = "";

		url2 = "#https://cdn.jsdelivr.net/gh/ladybug-tools/spider-gbxml-fixer@master/test-samples/one-room-original.xml";

		GBXifr.src = `${ GBX.viewer }${ url2 }`;


		GBXifr.onload = function() {

			//console.log( 'IL.reader.result', FIL.reader.result );
			GBXifr.contentWindow.GBX.parseFile( FIL.reader.result );

		}

	}


};



////////// utilities


GBX.runAll = function(){

	const details = divContents.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

	for ( let item of details ) { item.open = true; }

};



GBX.closeAll = function(){

	const details = divContents.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

};

