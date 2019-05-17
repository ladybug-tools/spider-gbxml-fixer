/* globals GBX, GSA, FETSdet, FETSdivSurfaces, FETSdivSurfaceData, FETSsumSurfaces */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FETS = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-16",
	"description": "Checks for surface with invalid exposedToSun values",
	"helpFile": "./r0-4-0/fets-fix-exposed-to-sun/README.md",
	"release": "0.1.0"

};




FETS.types = [
	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];

FETS.exposedTypes = [ "ExteriorWall", "Roof", "ExposedFloor", "Shade", "RaisedFloor" ];



//////////

FETS.getMenuSurfaceExposedToSun = function() {

	FETS.help = `<button id=butFETS class=butHelp onclick="MNU.setPopupShowHide(butFETS,FETS.helpFile);" >?</button>`;

	const htm =
	`
		<details id=FETSdet ontoggle="FETSdivSurfaces.innerHTML=FETS.getSurfaceExposedToSunErrors();" >

			<summary id=FETSsumSurfaces >Fix surfaces with invalid ExposedToSun
				${ FETS.help }
			</summary>

			<div id=FETSdivSurfaces ></div>

			<div id=FETSdivSurfaceData ></div>

		</details>

	`;

	return htm;

};



FETS.getSurfaceExposedToSunErrors = function() {

	const timeStart = performance.now();

	FETSdivSurfaceData.innerHTML = "";

	FETS.errorsByType = [];
	FETS.errorsByValue = [];
	FETS.errorsByAttribute = [];

	FETS.surfaceTypes = GBX.surfaces.map( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );

		let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : false;

		if ( exposedToSunBoolean === true && FETS.exposedTypes.includes( typeSource ) === false ) {
			//console.log( 'exposedToSun', exposedToSun );

			if ( exposedToSun[ 1 ] === "true" ) {

				FETS.errorsByType.push( { id, index, typeSource, exposedToSunBoolean, exposedToSun } );

			}

		} else if ( exposedToSunBoolean === false && FETS.exposedTypes.includes( typeSource ) === true  ) {

			if ( exposedToSun && exposedToSun.length ) {

				FETS.errorsByValue.push( {id, index, typeSource, exposedToSunBoolean, exposedToSun } );

			} else {

				FETS.errorsByAttribute.push( {id, index, typeSource, exposedToSunBoolean, exposedToSun } );

			}

		}

	} );



	FETSsumSurfaces.innerHTML =
	`Fix surfaces with invalid ExposedToSun
		~ ${ ( FETS.errorsByValue.length + FETS.errorsByType.length + FETS.errorsByAttribute.length ).toLocaleString() } errors
		${ FETS.help }
	`;

	const errorsByValueString = FETS.errorsByValue.map( item =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=FETSdivSurfaceData.innerHTML=FETS.getSurfaceData(${item.index },"${ item.id}"); >
		${ item.id }</button> / ${ item.typeSource } from:
		<mark> ${ item.exposedToSun[ 0 ] }</mark> to: exposedToSun="true"
		`
	).join("<br>");

	const errorsByAttributeString = FETS.errorsByAttribute.map( item =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=FETSdivSurfaceData.innerHTML=FETS.getSurfaceData(${item.index },"${ item.id}"); >
		${ item.id }</button> / ${ item.typeSource } from: attribute
		<mark>${ item.exposedToSun }</mark> to: exposedToSun="true"
		`
	).join("<br>");

	const errorsByTypeString = FETS.errorsByType.map( item =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=FETSdivSurfaceData.innerHTML=FETS.getSurfaceData(${item.index },"${ item.id}"); >
		${ item.id }</button> / ${ item.typeSource } from:
		 <mark>${ item.exposedToSun[ 0 ] }</mark> to: exposedToSun="false"
		`
	).join("<br>");

	

	const htm =
	`
		<p><i>${ FETS.errorsByValue.length.toLocaleString() } surface(s) with exposedToSun value not equal to "true"</i></p>

		${ errorsByValueString }

		<p><i>${ FETS.errorsByAttribute.length.toLocaleString() } surface(s) with missing exposedToSun attribute was supplied </i></p>

		${ errorsByAttributeString }

		<p><i>${ FETS.errorsByType.length.toLocaleString() } surface(s) with exposedToSun="true" is not one of the following surface types: ${ FETS.exposedTypes.join( ', ' ) }</i></p>

		${ errorsByTypeString }

		<p><button onclick=FETS.fixAllChecked(); >Fix all checked</button></p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};



FETS.getSurfaceData = function( index, text = "item" ) {

	const htm = GSA.getSurfacesAttributesByIndex( index, text );


	return htm;

};



FETS.fixAllChecked = function() {

	const boxesChecked = Array.from( FETSdivSurfaces.querySelectorAll( 'input:checked') ).map( item => item.value );

	for ( let error of FETS.errorsByValue ) {

		if ( boxesChecked.includes( error.id ) ) {

			const surfaceCurrent = GBX.surfaces[ error.index ];
			const surfaceNew = surfaceCurrent.replace( /exposedToSun="(.*?)"/i, `exposedToSun="true"` );

			GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
			GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

		}

	}

	for ( let error of FETS.errorsByAttribute ) {

		if ( boxesChecked.includes( error.id ) ) {

			const surfaceCurrent = GBX.surfaces[ error.index ];
			const surfaceNew = surfaceCurrent.replace( / id="(.*?)"/i, `exposedToSun="true" id="` );

			GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
			GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

		}

	}

	for ( let error of FETS.errorsByType ) {

		if ( boxesChecked.includes( error.id ) ) {

			const surfaceCurrent = GBX.surfaces[ error.index ];
			const surfaceNew = surfaceCurrent.replace( /exposedToSun="(.*?)"/i, `exposedToSun="false"` );

			GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
			GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

		}

	}

	FETSdet.open = false;

};
