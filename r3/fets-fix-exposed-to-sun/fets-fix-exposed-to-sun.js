//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FETS = { "release": "2.1.0", "date": "2019-04-02" };


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
			<details ontoggle="FETSdivSurfaces.innerHTML=FETS.getSurfaceExposedToSunErrors();" >

				<summary id=FETSsumSurfaces class=sumHeader >Fix surfaces with invalid ExposedToSun values
					<a id=FETSSum class=helpItem href="JavaScript:MNU.setPopupShowHide(FETSSum,FETS.currentStatus);" >&nbsp; ? &nbsp;</a>
				</summary>

				<div id=FETSdivSurfaces ></div>

			</details>

		`;

	return htm;

};



FETS.getSurfaceExposedToSunErrors = function() {

	const timeStart = performance.now();

	FETS.errorsByType = [];
	FETS.errorsByValue = [];
	FETS.errorsByAttribute = [];

	FETS.surfaceTypes = SGF.surfaces.map( surface => {

		let typeSource = surface.match( /surfaceType="(.*?)"/i )
		typeSource = typeSource ? typeSource[ 1 ] : "";

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ] === "true" : false;
		//console.log( 'exposedToSun', exposedToSun );
		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		if ( exposedToSunBoolean === true && FETS.exposedTypes.includes( typeSource ) === false ) {

				FETS.errorsByType.push( {id, typeSource, exposedToSunBoolean, exposedToSun } );

		} else if ( exposedToSunBoolean === false && FETS.exposedTypes.includes( typeSource ) === true  ) {

			if ( exposedToSun && exposedToSun.length ) {

				FETS.errorsByValue.push( {id, typeSource, exposedToSunBoolean, exposedToSun } );

			} else {

				FETS.errorsByAttribute.push( {id, typeSource, exposedToSunBoolean, exposedToSun } );

			}

		}


	} )


	const help = `<a id=FETSHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(FETSHelp,FETS.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FETSsumSurfaces.innerHTML =
		`Surfaces ~ ${ ( FETS.errorsByValue.length + FETS.errorsByType.length ).toLocaleString() } errors
			${ help }
		`;

	errorsByValueString = FETS.errorsByValue.map( item =>
		`<input type=checkbox value=${ item.id } checked > ${ item.id } / ${ item.typeSource } from:
		<mark> ${ item.exposedToSun[ 0 ] }</mark> to: exposedToSun="true"
		`
	).join("<br>");

	errorsByAttributeString = FETS.errorsByAttribute.map( item =>
		`<input type=checkbox value=${ item.id } checked > ${ item.id } / ${ item.typeSource } from: attribute
		<mark>${ item.exposedToSun }</mark> to: exposedToSun="true"
		`
	).join("<br>");

	errorsByTypeString = FETS.errorsByType.map( item =>
		`<input type=checkbox value=${ item.id } checked > ${ item.id } / ${ item.typeSource } from:
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



FETS.fixAllChecked = function() {

	checked = Array.from( FETSdivSurfaces.querySelectorAll( 'input:checked') ).map( item => item.vale );

	for ( let error of FETS.errorsByValue ) {

		if ( checked.includes = error.id ) {
			//console.log( 'error', error.id );

			const surface = SGF.surfaces.find( surface => surface.match( / id="(.*?)"/i )[ 1 ] ===  error.id )
			//console.log( 'surfaceCurrent', surfaceCurrent);

			const index = SGF.surfaces.indexOf( surface );

			SGF.surfaces[ index ] = surface.replace( /exposedToSun="(.*?)"/i, `exposedToSun="true"` );
			//console.log( 'SGF.surfaces[ index ]', SGF.surfaces[ index ] );

			//surfaceNew = surfaceCurrent.replace( /exposedToSun="(.*?)"/i, `exposedToSun="true"` );
			//SGF.text.replace( surfaceCurrent, surfaceNew );
			//SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

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

			const index = SGF.surfaces.find( surface => surface.match( / id="(.*?)"/i )[ 1 ] ===  error.id ).indexOf( surface );

			SGF.surfaces[ index ] = surface.replace( /exposedToSun="(.*?)"/i, `exposedToSun="false" id="` );
			//console.log( 'SGF.surfaces[ index ]', SGF.surfaces[ index ] );

		}

	}

};



/*

FETS.setTypeInvalidData = function( select ) {

	const invalidData = SGF.getSurfacesAttributesByIndex( select.value, select.options[ select.selectedIndex ].innerText );

	const options = SGF.surfaceTypes.map( ( type, index ) => {

		const selected = ""; //index === selectedIndex ? "selected" : "";
		return `<option ${ selected } >${ type }</option>`;

	} ).join( "" );

	let index = 0;

	const htm =
		`
			<p>
				${ invalidData }
			</p>

			<p>
				Select new surface type <select id=selSurfaceType${ index } >${ options }</select>
				<button onclick=FETS.setSurfaceType(${ index }); >Update data in memory</button>
				<button onclick=FETS.showSurfaceGbxml(${ index }); >View gbXML text</button>
			</p>
		`;

	FETSdivTypeInvalidData.innerHTML = htm;

};





FETS.setSurfaceType = function( index ) {
	//console.log( 'index',FETS.surfaceTypeInvalids[ index ]  );

	const surfaceTextCurrent = SGF.surfaces[ FETS.surfaceTypeInvalids[ index ] ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const type = document.body.querySelector( `#selSurfaceType${ index }` ).value;
	//console.log( 'type', type );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	SGF.text =  SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

};



FETS.showSurfaceGbxml = function( index ) {

	const surfaceText = SGF.surfaces[ FETS.surfaceTypeInvalids[ index ] ];

	//const div = document.body.querySelector( `#divSurfaceType${ index }` );

	FETSdivSelecteSurfaceTGbxml.innerText = surfaceText;

};

*/