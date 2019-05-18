/* globals FIL, divContents, GGD, GCS, OCV, GBXh1FileName, */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const GBX = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-17",
	"description": "Creates the GBX object. Creates the template for the main contents and more",
	"helpFile": "./r0-4-0/README.md",
	"release": "0.1.2",

};

GBX.viewer = "../spider-gbxml-tools/spider-gbxml-viewer/r15/spider-gbxml-viewer15.html";

GBX.divFixThings =
	`
		<p>
			<button id=butGBX class=butHelp onclick="MNU.setPopupShowHide(butGBX,GBX.helpFile);" >?</button>
		</p>

		<h2 id=GBXh1FileName >Check file: <script>decodeURI( FIL.name ) </script></h2>

		<p>
			<iframe id=GBXifr style=height:300px;width:600px; ></iframe>
			<br>
			<i>Preview model is for visual verification only and is not connected to fixer</i>
		</p>

		<p>
			<button onclick=GBX.runAll(); >Run all checks</button>

			<button onclick=GBX.openAllNonZero(); >Open all non-zero</button>

			<button onclick=GBX.closeAll(); >Close all</button>

			To do: a 'fix all' button

		</p>

		<p>
			<input type=checkbox id=GBXinpIgnoreAirSurfaceType > Ignore Air surface type
		</p>

		<div id=GGDdivGetGbxmlData ></div>

		<div id=GSSdivGetSurfaceStatistics ></div>

		<div id=GCSdivGetCheckStrings ></div>

		<div id=GCOdivGetCheckOffset ></div>

		<div id=OCVdivGetOpeningsCheckVertices ></div>

		<div id=FXAdivFixXmlAttributes ></div>

		<div id=FXSTIdivGetSurfaceTypeInvalid ></div>

		<div id=FSTNdivGetSurfaceTypeName ></div>

		<div id=FETSdivGetFixExposedToSun ></div>

		<div id=FDPCdivGetDuplicatePlanar ></div>

		<div id=FASSTdivSpacesWrongType ></div>

		<div id=FASEdivSpaceExtra ></div>

		<div id=FASDdivSpaceDuplicate ></div>

		<div id=FASAdivFixAirSingleAdjacent ></div>

		<div id=FCIMdivGetCadIdMissing ></div>

		<div id=TMPdivTemplate ></div>

		<hr>

		<center title="Hi there!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > <img src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" height=24 > </a></center>

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

GBX.cadIdsDefault = {

	InteriorWall: "Basic Wall: SIM_INT_SLD",
	ExteriorWall: "Basic Wall: SIM_EXT_SLD",
	Roof: "Basic Roof: SIM_EXT_SLD",
	InteriorFloor: "Floor: SIM_INT_SLD_FLR",
	ExposedFloor: "Floor: SIM_EXT_SLD_FLR",
	Shade: "???: SIM_???",
	UndergroundWall: "Basic Wall: SIM_???",
	UndergroundSlab: "Floor: SIM_???",
	Ceiling: "???: SIM_???",
	Air: "???: SIM_???",
	UndergroundCeiling: "???: SIM_???",
	RaisedFloor: "Floor: SIM_???",
	SlabOnGrade: "Floor: SIM_???",
	FreestandingColumn: 0x808080,
	EmbeddedColumn: 0x80806E,
	Undefined: 0x88888888

};

GBX.colors = Object.assign( {}, GBX.colorsDefault ); // create working copy of default colors

GBX.surfaceTypes = Object.keys( GBX.colors );


GBX.init = function() {

	divContents.innerHTML = GBX.divFixThings;

	GBXh1FileName.innerHTML = `File: ${ decodeURI( FIL.name ) }`;

	GGD.getData( FIL.text );

	GGDdivGetGbxmlData.innerHTML = GGD.getGbxmlData( FIL.text );

	GSSdivGetSurfaceStatistics.innerHTML = GSS.getMenuSurfaceStatistics();

	GCSdivGetCheckStrings.innerHTML = GCS.getCheckStrings();

	GCOdivGetCheckOffset.innerHTML = GCO.getCheckOffset();

	OCVdivGetOpeningsCheckVertices.innerHTML = OCV.getOpeningsCheckVertices();

	FXAdivFixXmlAttributes.innerHTML = FXA.getMenuFixXmlAttributes();

	FSTNdivGetSurfaceTypeName.innerHTML = FSTN.getMenuSurfaceTypeName();

	FETSdivGetFixExposedToSun.innerHTML = FETS.getMenuSurfaceExposedToSun();

	FDPCdivGetDuplicatePlanar.innerHTML = FDPC.getMenuDuplicatePlanarCoordinates();

	FASSTdivSpacesWrongType.innerHTML = FASST.getMenuFASST();

	FASEdivSpaceExtra.innerHTML = FASE.getMenuAdjacentSpaceExtra();

	FASDdivSpaceDuplicate.innerHTML = FASD.getFixAdjacentSpaceDuplicate();

	FASAdivFixAirSingleAdjacent.innerHTML = FASA.getMenuAirSingleAdjacent();

	FCIMdivGetCadIdMissing.innerHTML = FCIM.getCadIdMissing();

	//TMPdivTemplate.innerHTML = TMP.getMenuTemplate();


	if ( !FIL.files ) {

		const url = location.hash ? location.hash : "#" + FIL.urlDefaultFile;
		//console.log( 'url', url );

		GBXifr.src = `${ GBX.viewer }${ url }`;

	} else {

		// need something loaded. Will be updated by the load event later
		const url = "#https://cdn.jsdelivr.net/gh/ladybug-tools/spider-gbxml-fixer@master/test-samples/one-room-original.xml";

		GBXifr.src = `${ GBX.viewer }${ url }`;

		GBXifr.onload = function() {

			//console.log( 'IL.reader.result', FIL.reader.result );
			GBXifr.contentWindow.GBX.parseFile( FIL.reader.result );

		};

	}

};



////////// utilities


GBX.runAll = function(){

	const details = divContents.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

	for ( let item of details ) { item.open = true; }

	for ( let item of details ) { item.open = false; }

};



GBX.closeAll = function(){

	const details = divContents.querySelectorAll( 'details' );

	for ( let item of details ) { item.open = false; }

};

GBX.openAllNonZero = function(){

	const details = divContents.querySelectorAll( 'details' );

	for ( let item of details ) {

		//console.log( 'item', item );

		if ( item.innerText.includes( "~" ) && item.innerText.includes( "~ 0 " ) === false ) {

			item.open = true;

		}

	}

};

