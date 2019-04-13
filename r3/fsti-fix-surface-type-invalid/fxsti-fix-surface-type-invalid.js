//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FXSTI = { "release": "3.1.0", "date": "2019-04-12" };


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
			1. Misspelled surface types (quite rare).
			These may  occur when a user types in a non-valid surface type in the originating CAD application.
		</p>

		<p>
			2. Surfaces given a type that does not correspond to the given geometry or given attributes.
		</p>

		<details>
			<summary>Wish list / to do</summary>
			<ul>

			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-12 ~ F - Display the reasoning behind each issue that is identified</li>
				<li>2019-04-12 ~ B ~ Fixed issues with saving data to files</li>
				<li>2019-04-11 ~ F - R3 First commit</li>
			</ul>
		</details>
	`;



FXSTI.types = [
	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];


FXSTI.getSurfaceTypeInvalid = function() {

	const htm =
		`
			<details id=FXSTIdet ontoggle="FXSTIdivSurfaceType.innerHTML=FXSTI.getSurfaceType();" >

			<summary id=FXSTIsumSurfaceType class=sumHeader ><mark>Fix surfaces with invalid surface type</mark>
				<a id=FXSTISum class=helpItem href="JavaScript:MNU.setPopupShowHide(FXSTISum,FXSTI.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<p><mark>Work-in-progress</mark></p>

			<div id=FXSTIdivSurfaceType ></div>

			<div id=FXSTIdivSurfaceData ></div>

			<hr>

			</details>

		`;

	return htm;

};



FXSTI.getSurfaceType = function() {

	const timeStart = performance.now();

	FXSTIdivSurfaceData.innerHTML = "";

	FXSTI.errors = [];

	FXSTI.surfaceTypes = SGF.surfaces.map( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		//console.log( 'typeSource', typeSource );
		typeSource = typeSource ? typeSource : "null";
		typeSource = typeSource === "null" ? typeSource : typeSource[ 1 ];

		const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i )[ 1 ];

		let spaces = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
		spaces = spaces ? spaces : [];
		//console.log( '', spaces );

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		exposedToSun = exposedToSun ? exposedToSun[ 1 ] : false;

		let error = "";
		let reasons = "";

		if ( FXSTI.types.includes( typeSource ) === false ) {

			reasons += "Invalid surface type name. "
			error = "Invalid surface type name."
		}

		let type;

		if ( Number( tilt ) === 90 ) {

			reasons += `Tilt = ${ tilt }. `;

			if ( spaces.length === 2 ) {

				reasons += "Two adjacent space IDs. ";
				let id1 = spaces[ 0 ].match( /spaceIdRef="(.*?)"/i )
				id1 = id1 ? id1[ 1 ] : id1;
				let id2 = spaces[ 1 ].match( /spaceIdRef="(.*?)"/i )
				id2 = id2 ? id2[ 1 ] : id2;
				//console.log( '', id1, id2 );

				if ( id1 !== id2) {

					reasons += "Different adjacent space IDs. ";
					type = "InteriorWall";

				} else {

					reasons += "Identical IDs. ";

					if ( typeSource === "InteriorWall") {

						reasons += "Interior wall with identical adjacent IDs. ";
						type = "InteriorWall";

					} else {

						type = "Air";

					}

				}

				if ( exposedToSun === "true" ) {

					error = "ExposedToSun invalid for interiors";
					reasons += `Error: exposedToSun set to ${ exposedToSun }. `;

				}

			} else if ( spaces.length === 1 ) {

				reasons += "Single adjacent space ID. ";

				if ( exposedToSun === "true" ) {

					type = "ExteriorWall";
					reasons += `ExposedToSun set to ${ exposedToSun }. `;

					if ( type !== typeSource ) {

						error = "ExposedToSun true, one adjacent space";

					}

				} else {

					reasons += `Type = ${ typeSource }. `;

					if ( [ "ExteriorWall", "UndergroundWall" ].includes( typeSource ) ) {

						type = typeSource;

					} else {

						type = typeSource;
						error = "Want exterior/underground wall";

					}

				}

			} else if ( spaces.length === 0 ) {

				type = "Shade";
				reasons += "No adjacent space ID. ";

				if ( type !== typeSource ) {

					error = "No adjacent space ID. ";

				}

			} else {

				error = "Issues with spaces";
				console.log( 'tilt', tilt );
				console.log( 'spaces', spaces );
				console.log( 'typeSource', typeSource );

			}

		} else if ( Number( tilt ) === 0 ){

			reasons += "Tilt = 0. ";

			if ( spaces.length === 2 ) {

				reasons += "Two adjacent space IDs. ";
				let id1 = spaces[ 0 ].match( /spaceIdRef="(.*?)"/i );
				id1 = id1 ? id1[ 1 ] : id1;
				let id2 = spaces[ 1 ].match( /spaceIdRef="(.*?)"/i );
				id2 = id2 ? id2[ 1 ] : id2;
				//console.log( '', id1, id2 );

				if ( id1 !== id2 ) {

					reasons += "Different adjacent space IDs. ";
					type = "Ceiling";

					if ( ["Ceiling", "InteriorFloor" ].includes( typeSource ) ) {

						type = typeSource;

					} else {

						type = "Ceiling";
					}

				} else {

					reasons += "Identical IDs. ";

					if ( typeSource === "Ceiling") {

						reasons += "Ceiling with identical adjacent space IDs. ";
						type = "Ceiling";

					} else {

						type = "Air";

					}

				}

				if ( exposedToSun === "true" ) {

					type = typeSource;
					error = "Suface should not have exposedToSun = true."
					reasons += `Error: exposedToSun set to ${ exposedToSun }. `;

				}

			} else if ( spaces.length === 1 ) {

				reasons += "Single adjacent space ID. ";

				if ( exposedToSun === "true" ) {

					reasons += `ExposedToSun set to ${ exposedToSun }. `;
					type = typeSource;

					if ( [ "ExposedFloor", "RaisedFloor", "Roof" ].includes( typeSource ) ) {


					} else {

						error = "Want floor or roof";

					}


				} else {

					reasons += `Type = ${ typeSource }. `;
					type = typeSource;

					if ( [ "ExposedFloor", "RaisedFloor", "Roof", "SlabOnGrade", "UndergroundCeiling", "UndergroundSlab" ].includes( typeSource ) ) {


					} else {

						error = "Want horizontal surface ";

					}

				}

			} else {

				reasons += "No adjacent space ID. ";
				type = "Shade";

			}

		} else if ( Number( tilt ) === 180 ){

			reasons += "Tilt = 180. ";

			if ( spaces.length === 2 ) {

				reasons += "Two adjacent space IDs. ";
				let id1 = spaces[ 0 ].match( /spaceIdRef="(.*?)"/i )
				id1 = id1 ? id1[ 1 ] : id1;
				let id2 = spaces[ 1 ].match( /spaceIdRef="(.*?)"/i )
				id2 = id2 ? id2[ 1 ] : id2;
				//console.log( '', id1, id2 );

				if ( id1 !== id2) {

					reasons += "Different adjacent space IDs. ";
					type = typeSource;

					if ( [ "Air", "Ceiling", "InteriorFloor", "RaisedFloor" ].includes( typeSource ) ) {


					} else {

						error = "Want interior horizontal surface ";
					}

				} else {

					reasons += "Identical IDs. ";

					if ( typeSource === "InteriorFloor") {

						reasons += "Interior floor with identical adjacent IDs. ";
						type = "InteriorFloor"

					} else {

						type = "Air";

					}

				}

			} else if ( spaces.length === 1 ) {

				reasons += "Single adjacent space ID. ";

				if ( exposedToSun === "true" ) {

					reasons += `ExposedToSun set to ${ exposedToSun }. `;
					type = typeSource;

					if ( [ "ExposedFloor", "RaisedFloor", "Roof", "UndergroundCeiling" ].includes( typeSource ) ) {


					} else {

						error = "ExposedToSun true";

					}

				} else {

					reasons += `Type = ${ typeSource }. `;
					type = typeSource;

					if ( [ "ExposedFloor", "RaisedFloor", "Roof", "SlabOnGrade", "UndergroundSlab" ].includes( typeSource ) ) {


					} else {

						error = "incorrect surface type ";

					}


				}

			} else {

				reasons += "No adjacent space ID. ";
				type = "Shade";

			}

		} else {

			//console.log( 'tilt', tilt );

			reasons += `Tilt = ${ tilt }. `;

			if ( spaces.length === 2 ) {

				reasons += "Two adjacent space IDs. ";

				if ( Number( tilt ) > 45 && Number( tilt ) <=90 ) {

					reasons += "Tilt angle is > 45 and < 90. ";

					type = typeSource;

					if ( [ "Air", "Ceiling", "InteriorWall" ].includes( typeSource ) ) {

					} else {

						error = "incorrect surface type ";
					}

				} else {

					reasons += "Tilt angle is < 45 or > 90. ";
					type = typeSource;

					if ( [ "Air", "Ceiling", "InteriorFloor" ].includes( typeSource ) ) {

					} else {

						error = "incorrect surface type ";
					}

				}

			} else if ( spaces.length === 1 ) {

				reasons += "Single adjacent space ID. ";

				if ( Number( tilt ) > 45 && Number( tilt ) <=90 ) {

					//console.log( 'tilt', tilt );
					reasons += "tilt angle is > 45 and < 90. ";
					type = "ExteriorWall";

				} else {

					reasons += "tilt angle is < 45 or > 90. ";
					type = "Roof";

				}

			} else {

				reasons += "No adjacent space ID. ";
				type = "Shade";

			}

		}

		if ( typeSource !== type ) {

			typeSource = typeSource ? typeSource : "undefined";
			//console.log( '', typeSource, type );

			if ( SGFinpIgnoreAirSurfaceType.checked === true && typeSource === "Air" ) {


			} else {

				FXSTI.errors.push( { id, index, typeSource, type, reasons, error } );

			}

		} else if ( error !== "" ) {

			FXSTI.errors.push( { id, index, typeSource, type, reasons, error } );

		}

		return [ typeSource, type ];

	} )
	//console.log( 'FXSTI.surfaceTypes', FXSTI.surfaceTypes );

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FXSTI.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXSTIsumSurfaceType.innerHTML =
		`Fix surfaces with invalid surface type  ~ ${ FXSTI.errors.length.toLocaleString() } issues
			${ help }
		`;

	const errorsString = FXSTI.errors.map( ( item, index ) =>
		`
			<input type=checkbox value=${ item.id } checked >
		 	<button onclick=FXSTIdivSurfaceData.innerHTML=FXSTI.getSurfaceData(${ index }); >${ item.id }</button> from:
			<mark>${ item.typeSource }</mark> to: ${ item.type }
			/ ${ item.error }
		`
	).join("<br>");

	const htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ SGF.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FXSTI.surfaceTypes.length.toLocaleString() } surfaces checked.
		${ FXSTI.errors.length.toLocaleString() } issues found.</p>

		<p>${ errorsString }</p>

		<p><button onclick=FXSTI.fixAllChecked(); >Fix all checked</button></p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};


FXSTI.getSurfaceData = function( index ) {

	const error = FXSTI.errors[ index ];

	const htm =
	`
		<p>Surface type: ${ error.typeSource }</p>
		<p>Reasons: ${ error.reasons }<br>
		${ "Error: " + error.error || "" }</p>

		${ GSA.getSurfacesAttributesByIndex( error.index, error.id ) }
	`;

	return htm;

}



FXSTI.fixAllChecked = function() {

	const checked = Array.from( FXSTIdivSurfaceType.querySelectorAll( 'input:checked') ).map( item => item.value );

	for ( let error of FXSTI.errors ) {

		if ( checked.includes( error.id ) ) {
			//console.log( 'error', error.id );

			//const surface = SGF.surfaces.find( surface => surface.match( / id="(.*?)"/i )[ 1 ] ===  error.id )
			const surfaceCurrent = SGF.surfaces[ error.index ];

			if ( error.typeSource === "null") {
				//console.log( 'error', error );

				surfaceNew = surfaceCurrent.replace( / id="/i, ` surfaceType="${ error.type}" id="` );
				//console.log( 'SGF.surfaces[ index ]', SGF.surfaces[ index ] );

			} else {

				surfaceNew = surfaceCurrent.replace( /surfaceType="(.*?)"/i, `surfaceType="${ error.type}"` );

			}
			//console.log( 'surfaceNew', surfaceNew );

			SGF.text = SGF.text.replace( surfaceCurrent, surfaceNew );
			SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

		}

	}

	FXSTIdet.open = false;

};
