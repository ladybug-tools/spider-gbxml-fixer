//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FETS = { "release": "3.0.0", "date": "2019-04-11" };


FETS.types = [
	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];

FETS.exposedTypes = [ "ExteriorWall", "Roof", "ExposedFloor", "Shade", "RaisedFloor" ];

FETS.description =
	`
		Checks for surface with invalid exposedToSon values
	`;

FETS.currentStatus =
	`
		<h3>Fix Surfaces Exposed To Sun I(FETS) R${ FETS.release } ~ ${ FETS.date }</h3>

		<p>
			${ FETS.description }.
		</p>


		<p>
			Wish List / To do:<br>
			<ul>

			</ul>
		</p>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-09 ~ First commit</li>
			</ul>
		</details>
	`;




FETS.getSurfaceExposedToSun = function() {

	const htm =
		`
			<details id=FETSdet ontoggle="FETSdivSurfaces.innerHTML=FETS.getSurfaceExposedToSunErrors();" >

				<summary id=FETSsumSurfaces class=sumHeader >Fix surfaces with invalid ExposedToSun values
					<a id=FETSSum class=helpItem href="JavaScript:MNU.setPopupShowHide(FETSSum,FETS.currentStatus);" >&nbsp; ? &nbsp;</a>
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

	FETS.surfaceTypes = SGF.surfaces.map( ( surface, index ) => {

		let typeSource = surface.match( /surfaceType="(.*?)"/i )
		typeSource = typeSource ? typeSource[ 1 ] : "";

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : false;
		const id = surface.match( / id="(.*?)"/i )[ 1 ];

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


	const help = `<a id=FETSHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(FETSHelp,FETS.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FETSsumSurfaces.innerHTML =
		`Fix surfaces with invalid ExposedToSun values ~ ${ ( FETS.errorsByValue.length + FETS.errorsByType.length + FETS.errorsByAttribute.length ).toLocaleString() } errors
			${ help }
		`;

	errorsByValueString = FETS.errorsByValue.map( item =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=FETSdivSurfaceData.innerHTML=FETS.getSurfaceData(${item.index },"${ item.id}"); >
		${ item.id }</button> / ${ item.typeSource } from:
		<mark> ${ item.exposedToSun[ 0 ] }</mark> to: exposedToSun="true"
		`
	).join("<br>");

	errorsByAttributeString = FETS.errorsByAttribute.map( item =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=FETSdivSurfaceData.innerHTML=FETS.getSurfaceData(${item.index },"${ item.id}"); >
		${ item.id }</button> / ${ item.typeSource } from: attribute
		<mark>${ item.exposedToSun }</mark> to: exposedToSun="true"
		`
	).join("<br>");

	errorsByTypeString = FETS.errorsByType.map( item =>
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

	htm = GSA.getSurfacesAttributesByIndex( index, text );

	return htm;

};



FETS.fixAllChecked = function() {

	checked = Array.from( FETSdivSurfaces.querySelectorAll( 'input:checked') ).map( item => item.value );

	for ( let error of FETS.errorsByValue ) {

		if ( checked.includes = error.id ) {
			//console.log( 'error', error.id );

			const surface = SGF.surfaces.find( surface => surface.match( / id="(.*?)"/i )[ 1 ] ===  error.id )
			//console.log( 'surfaceCurrent', surfaceCurrent);

			const index = SGF.surfaces.indexOf( surface );

			SGF.surfaces[ index ] = surface.replace( /exposedToSun="(.*?)"/i, `exposedToSun="true"` );
			//console.log( 'SGF.surfaces[ index ]', SGF.surfaces[ index ] );

		}

	}

	for ( let error of FETS.errorsByAttribute ) {

		if ( checked.includes = error.id ) {
			//console.log( 'error', error.id );

			const surface = SGF.surfaces.find( surface => surface.match( / id="(.*?)"/i )[ 1 ] ===  error.id )
			//console.log( 'surfaceCurrent', surfaceCurrent);

			const index = SGF.surfaces.indexOf( surface );

			SGF.surfaces[ index ] = surface.replace( / id="(.*?)"/i, `exposedToSun="true" id="` );
			//console.log( 'SGF.surfaces[ index ]', SGF.surfaces[ index ] );

		}

	}

	for ( let error of FETS.errorsByType ) {

		if ( checked.includes = error.id ) {
			//console.log( 'error', error.id );

			const surface = SGF.surfaces.find( surface => surface.match( / id="(.*?)"/i )[ 1 ] ===  error.id )
			//console.log( 'surfaceCurrent', surface );

			const index = SGF.surfaces.indexOf( surface );

			SGF.surfaces[ index ] = surface.replace( /exposedToSun="(.*?)"/i, `exposedToSun="false"` );
			//console.log( 'SGF.surfaces[ index ]', index, SGF.surfaces[ index ] );

		}

	}

	FETSdet.open = false;

};
