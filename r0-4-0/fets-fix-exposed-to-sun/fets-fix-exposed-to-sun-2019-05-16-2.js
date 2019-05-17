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

	FETS.errors = [];
	FETS.errorsByType = [];
	FETS.errorsByValue = [];
	FETS.errorsByAttribute = [];

	FETS.surfaceTypes = GBX.surfaces.map( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/i );
		name = name ? name[ 1 ] : id;

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );

		let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : false;

		/*
		if ( exposedToSunBoolean === true && FETS.exposedTypes.includes( typeSource ) === false ) {
			//console.log( 'exposedToSun', exposedToSun );

			if ( exposedToSun[ 1 ] === "true" ) {

				FETS.errorsByType.push( { id, index, name, typeSource, exposedToSunBoolean, exposedToSun } );

			}

		} else if ( exposedToSunBoolean === false && FETS.exposedTypes.includes( typeSource ) === true  ) {

			if ( exposedToSun && exposedToSun.length ) {

				FETS.errorsByValue.push( {id, index, name, typeSource, exposedToSunBoolean, exposedToSun } );

			} else {

				FETS.errorsByAttribute.push( {id, index, name, typeSource, exposedToSunBoolean, exposedToSun } );

			}

		}

		*/


		if ( exposedToSunBoolean === true && FETS.exposedTypes.includes( typeSource ) === false ) {
			//console.log( 'exposedToSun', exposedToSun );

			if ( exposedToSun[ 1 ] === "true" ) {

				const fix = `exposedToSun="True"`;

				FETS.errors.push( { id, index, name, typeSource, exposedToSunBoolean, exposedToSun, fix } );

			}

		} else if ( exposedToSunBoolean === false && FETS.exposedTypes.includes( typeSource ) === true  ) {

			if ( exposedToSun && exposedToSun.length ) {

				const fix = `exposedToSun="True"`;

				FETS.errors.push( {id, index, name, typeSource, exposedToSunBoolean, exposedToSun, fix } );

			} else {

				const fix = `exposedToSun="False"`;
				FETS.errors.push( {id, index, name, typeSource, exposedToSunBoolean, exposedToSun } );

			}

		}

	} );



	FETSsumSurfaces.innerHTML =
	`Fix surfaces with invalid ExposedToSun
		~ ${ ( FETS.errorsByValue.length + FETS.errorsByType.length + FETS.errorsByAttribute.length ).toLocaleString() } errors
		${ FETS.help }
	`;

	const options = FETS.errors.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );

	/*
	const optionsByValue = FETS.errorsByValue.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );

	const optionsByAttribute  = FETS.errorsByAttribute.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );

	const optionsByType = FETS.errorsByType.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );
	*/
	

	const htm =
	`

		<p><i>${ FETS.errors.length.toLocaleString() } surface(s) with exposedToSun issues</i></p>

		<p>
			<select id=FETSselSurfaces onclick=FETS.setSurfaceData(this.selectedIndex); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<!--
		<p><i>${ FETS.errorsByValue.length.toLocaleString() } surface(s) with exposedToSun value not equal to "true"</i></p>

		<p>
			<select id=FETSselSurfacesByValue onclick=FETS.setSurfaceData(FETS.errorsByValue[this.selectedIndex]); size=5 style=min-width:8rem; >
				${ optionsByValue }
			</select>
		</p>

		<p><i>${ FETS.errorsByAttribute.length.toLocaleString() } surface(s) with missing exposedToSun attribute was supplied </i></p>

		<p>
			<select id=FETSselSurfacesByAttribute onclick=FETS.setSurfaceData(FETS.errorsByAttribute[this.selectedIndex]); size=5 style=min-width:8rem; >
				${ optionsByAttribute }
			</select>
		</p>

		<p><i>${ FETS.errorsByType.length.toLocaleString() } surface(s) with exposedToSun="true" is not one of the following surface types: ${ FETS.exposedTypes.join( ', ' ) }</i></p>

		<p>
			<select id=FETSselSurfacesByType onclick=FETS.setSurfaceData(FETS.errorsByType[this.selectedIndex]); size=5 style=min-width:8rem; >
				${ optionsByType }
			</select>
		</p>

		-->

		<p><button onclick=FETS.fixAll(); >Fix all</button></p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};



FETS.setSurfaceData = function( index ) {

	//if ( !index ) { return; }

	const item = FETS.errors[ index ];
	//console.log( 'item', item );

	const htm =
	`
		${ GSA.getSurfacesAttributesByIndex( item.index, item.name ) }

		<p>
			<button onclick="FETS.fixSurface(${index});" title="" >update exposedToSun</button>
		</p>

		<p>
			<textarea id=FETStxt style="height:20rem; width:100%;" ></textarea>
		</p>
	`;

	FETSdivSurfaceData.innerHTML = htm;

};




FETS.fixSurface = function( index ) {
	//console.log( 'index', index );

	const item = FETS.errors[ index ];
	//console.log( '', item );

	const surfaceCurrent = GBX.surfaces[ item.index ];
	let surfaceNew;

	if ( surfaceCurrent.includes( "exposedToSun" ) ) {

		surfaceNew = surfaceCurrent.replace( /exposedToSun="(.*?)"/i, `${ item.fix }` );

	} else {

		surfaceNew = surfaceCurrent.replace( / id="(.*?)"/i, `${ item.fix } id="` );

	}

	GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FETStxt.value = surfaceNew;

};





FETS.fixAllSurfaces = function() {
	//console.log( 'index', index );

	for ( error of FETS.errors ) {


	}
	const item = FETS.errors[ index ];
	//console.log( '', item );

	const surfaceCurrent = GBX.surfaces[ item.index ];
	let surfaceNew;

	if ( surfaceCurrent.includes( "exposedToSun" ) ) {

		surfaceNew = surfaceCurrent.replace( /exposedToSun="(.*?)"/i, `${ item.fix }` );

	} else {

		surfaceNew = surfaceCurrent.replace( / id="(.*?)"/i, `${ item.fix } id="` );

	}

	GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FETStxt.value = surfaceNew;

};

//////////

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
