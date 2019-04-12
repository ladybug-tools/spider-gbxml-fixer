//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FXSTI = { "release": "3.0.0", "date": "2019-04-11" };


FXSTI.description =
	`
		Checks for a surface type that is not one of the 15 valid gbXML surface types.
		Checks that tilt. exposedToSun and adjacent spaces are appropriate for the surface type

	`;

FXSTI.currentStatus =
	`
		<h3>Fix Surface Type Invalid (FXSTI) R${ FXSTI.release } ~ ${ FXSTI.date }</h3>

		<p>
			${ FXSTI.description }.
		</p>

		<p>This modules checks for two kinds of errors.</p>

		<p>
			1. Misspelled surface types (quite rare) .
			These may  occur when a user types in a non-valid surface type in the originating CAD application.
		</p>

		<p>2. Surfaces given a type that does not correspond to the given geometry or given attributes.</p>

		<details>
			<summary>Wish list / to do</summary>
			<ul>
				<li>2019-04-11 ~ Display the reasoning behind each issue that is identified</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-11 ~ F - R3 First commit</li>
			</ul>
		</details>
	`;




FXSTI.getSurfaceTypeInvalid = function() {

	const htm =
		`
			<details id=FXSTIdet ontoggle="FXSTIdivSurfaceType.innerHTML=FXSTI.getSurfaceType();" >

			<summary id=FXSTIsumSurfaceType class=sumHeader >Fix surfaces with invalid surface type
				<a id=FXSTISum class=helpItem href="JavaScript:MNU.setPopupShowHide(FXSTISum,FXSTI.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<p><mark>Work-in-progress</mark></p>

			<div id=FXSTIdivSurfaceType ></div>

			<div id=FXSTIdivSurfaceData ></div>

			</details>

		`;

	return htm;

};



FXSTI.getSurfaceType = function() {

	const timeStart = performance.now();

	FXSTIdivSurfaceData.innerHTML = "";

	FXSTI.errors = [];

	FXSTI.surfaceTypes = SGF.surfaces.map( ( surface, index ) => {

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		//console.log( 'typeSource', typeSource );

		typeSource = typeSource ? typeSource : "null";
		typeSource = typeSource === "null" ? typeSource : typeSource[ 1 ];

		const id = surface.match( / id="(.*?)"/i )[ 1 ];
		const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i )[ 1 ];

		let spaces = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
		spaces = spaces ? spaces : [];
		//console.log( '', spaces );

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		exposedToSun = exposedToSun ? exposedToSun[ 1 ] : false;

		let type;

		if ( tilt === "90" ) {

				if ( spaces.length === 2 ) {

				const id1 = spaces[ 0 ].match( /spaceIdRef="(.*?)"/i )[1 ];
				const id2 = spaces[ 1 ].match( /spaceIdRef="(.*?)"/i )[1 ];
				//console.log( '', id1, id2 );

				if ( id1 !== id2) {

					type = "InteriorWall";

				} else {

					type = "Air";

				}
				//type = "InteriorWall";

			} else if ( spaces.length === 1 ) {

				//console.log( '', exposedToSun );

				if ( exposedToSun === "true" ) {

					type = "ExteriorWall";

				} else {

					type = "UndergroundWall";

				}


			} else if ( spaces.length === 0 ) {

				type = "Shade";

			} else {

				//console.log( 'typeSource', spaces );
				//console.log( 'typeSource', typeSource );

			}

		} else if ( tilt === "0" ){

				if ( spaces.length === 2 ) {

				//type = "Ceiling";
				type = "InteriorFloor";


			} else if ( spaces.length === 1 ) {

				type = "Roof"

			} else {

				type = "Shade";

			}

		} else if ( tilt === "180" ){

			if ( spaces.length === 2 ) {

				type = "InteriorFloor";

			} else if ( spaces.length === 1 ) {

				if ( exposedToSun === "true" ) {

					type = "RaisedFloor";

				} else {

					type = "SlabOnGrade"

				}

			} else {

				type = "Shade";

			}

		} else {

			//console.log( 'tilt', tilt );

			if ( spaces.length === 2 ) {

				if ( Number( tilt ) > 45 && Number( tilt ) <=90 ) {

					type = "InteriorWall";

					} else {

					type = "InteriorFloor";

					}

			} else if ( spaces.length === 1 ) {

				if ( Number( tilt ) > 45 && Number( tilt ) <=90 ) {

					//console.log( 'tilt', tilt );
					type = "ExteriorWall";

				} else {

					type = "Roof";

				}

			} else {

				type = "Shade";

			}

		}

		if ( type !== typeSource ) {

			if ( typeSource === "UndergroundSlab" && type === "SlabOnGrade" ) {

			} else {

				//console.log( 'ff', "undefined", type, spaces, tilt );

			}


		}

		if ( typeSource !== type ) {

			typeSource = typeSource ? typeSource : "undefined";
			//console.log( '', typeSource, type );

			if ( SGFinpIgnoreAirSurfaceType.checked === true && typeSource === "Air" ) {

			} else {

				FXSTI.errors.push( { index, id, typeSource, type } );

			}

		}

		return [ typeSource, type ];

	} )
	//console.log( 'FXSTI.surfaceTypes', FXSTI.surfaceTypes );

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FXSTI.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXSTIsumSurfaceType.innerHTML =
		`Fix surfaces with invalid surface type  ~ ${ FXSTI.errors.length.toLocaleString() } errors
			${ help }
		`;

	const errorsString = FXSTI.errors.map( item =>
		`
			<input type=checkbox value=${ item.id } checked >
		 	<button onclick=FXSTIdivSurfaceData.innerHTML=FXSTI.getSurfaceData(${item.index },"${ item.id}"); >${ item.id }</button> from:
			<mark>${ item.typeSource }</mark> to: ${ item.type }
		`
	).join("<br>");

	const htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ SGF.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FXSTI.surfaceTypes.length.toLocaleString() } surfaces found.</p>

		<p>${ errorsString }</p>

		<p><button onclick=FXSTI.fixAllChecked(); >Fix all checked</button></p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>


	`;

	return htm;

};


FXSTI.getSurfaceData = function( index, text = "item" ) {

	const htm = GSA.getSurfacesAttributesByIndex( index, text );

	return htm;

}



FXSTI.fixAllChecked = function() {

	const checked = Array.from( FXSTIdivSurfaceType.querySelectorAll( 'input:checked') ).map( item => item.value );

	for ( let error of FXSTI.errors ) {

		if ( checked.includes = error.id ) {
			//console.log( 'error', error.id );

			const surface = SGF.surfaces.find( surface => surface.match( / id="(.*?)"/i )[ 1 ] ===  error.id )
			//console.log( 'surface', surface);

			const index = SGF.surfaces.indexOf( surface );

			if ( error.typeSource === "null") {
				//console.log( 'error', error );

				SGF.surfaces[ index ] = surface.replace( / id="/i, ` surfaceType="${ error.type}" id="` );
				//console.log( 'SGF.surfaces[ index ]', SGF.surfaces[ index ] );

			} else {

				SGF.surfaces[ index ] = surface.replace( /surfaceType="(.*?)"/i, `surfaceType="${ error.type}"` );

			}
			//console.log( 'SGF.surfaces[ index ]', SGF.surfaces[ index ] );

		}

	}

	FXSTIdet.open = false;

};


/*

FXSTI.setTypeInvalidData = function( select ) {

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
				<button onclick=FXSTI.setSurfaceType(${ index }); >Update data in memory</button>
				<button onclick=FXSTI.showSurfaceGbxml(${ index }); >View gbXML text</button>
			</p>
		`;

	FXSTIdivTypeInvalidData.innerHTML = htm;

};



FXSTI.setSurfaceType = function( index ) {
	//console.log( 'index',FXSTI.surfaceTypeInvalids[ index ]  );

	const surfaceTextCurrent = SGF.surfaces[ FXSTI.surfaceTypeInvalids[ index ] ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const type = document.body.querySelector( `#selSurfaceType${ index }` ).value;
	//console.log( 'type', type );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	SGF.text =  SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

};



FXSTI.showSurfaceGbxml = function( index ) {

	const surfaceText = SGF.surfaces[ FXSTI.surfaceTypeInvalids[ index ] ];

	//const div = document.body.querySelector( `#divSurfaceType${ index }` );

	FXSTIdivSelecteSurfaceTGbxml.innerText = surfaceText;

};
*/
