//Copyright 2019 Ladybug Tools authors. MIT License
/* globals GBX, GSA, FSTNsumSurfaceType, FSTNdivSurfaceType, FSTNdet */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FSTN = { "release": "2.1.0", "date": "2019-04-02" };


FSTN.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];

FSTN.description =
	`
		Checks for a surface type name that is not one of the 15 valid gbXML surface type names
	`;

FSTN.currentStatus =
	`
		<h3>Fix Surface Type Name (FSTN) R${ FSTN.release } ~ ${ FSTN.date }</h3>

		<p>
			${ FSTN.description }.
		</p>

		<p>
			Most likely this type of error is quite rare. It occurs when a user types in a non-valid surface type in the originating CAD application.
		</p>

		<p>
			Wish List / To do:<br>
			<ul>

			</ul>
		</p>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-15 ~ First commit</li>
			</ul>
		</details>
	`;


FSTN.getMenuSurfaceTypeName = function() {

	const htm =
		`
			<details id=FSTNdet ontoggle="FSTNdivSurfaceType.innerHTML=FSTN.getSurfaceType();" >

			<summary id=FSTNsumSurfaceType class=sumHeader ><mark>Fix surfaces with invalid surface type name</mark>
				<a id=FSTNSum class=helpItem href="JavaScript:MNU.setPopupShowHide(FSTNSum,FSTN.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div id=FSTNdivSurfaceType ></div>

			<div id=FSTNdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



FSTN.getSurfaceType = function() {

	const timeStart = performance.now();

	FSTN.errors = [];

	FSTN.surfaceTypes = GBX.surfaces.map( ( surface, index ) => {

		const typeSource0 = surface.match( /surfaceType="(.*?)"/i );
		const typeSource1 = typeSource0 === null ?  ["", "no attribute" ] : typeSource0 ;
		const typeSource = typeSource1[ 1 ] ? typeSource1[ 1 ] : "undefined";

		if ( FSTN.types.includes( typeSource ) === false ) {
			//console.log( '', typeSource1 );

			const id = surface.match( / id="(.*?)"/i )[ 1 ];
			const results = FSTN.getSurfaceTypeNew( surface, typeSource );
			const typeNew = results.typeNew;
			const reasons = results.reasons;
			const error = results.error;

			FSTN.errors.push( { id, index, typeSource, typeNew, reasons, error  } );

		}

	} );
	//console.log( 'FSTN.errors', FSTN.errors );
	//console.log( 'FSTN.surfaceTypes', FSTN.surfaceTypes );

	const errorsString = FSTN.errors.map( ( item, index ) =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=FSTNdivSurfaceAttributeData.innerHTML=FSTN.getSurfaceAttributes(${ index },"${ item.id}"); >
		${ item.id }</button> / from:
		 <mark>${ item.typeSource }</mark> to: ${ item.typeNew }
		`
	).join("<br>");

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FSTN.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FSTNsumSurfaceType.innerHTML =
		`Fix surfaces with invalid surface type name ~ ${ FSTN.errors.length.toLocaleString() } errors
			${ help }
		`;

	const htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ GBX.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FSTN.surfaceTypes.length.toLocaleString() } surface types found.</p>

		${ errorsString }

		<p><button onclick=FSTN.fixAllChecked(); >Fix all checked</button></p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};


FSTN.getSurfaceAttributes = function( index ) {

	const error = FSTN.errors[ index ];

	const options = FSTN.types.map( type =>
		`<option ${ type === error.typeNew ? "selected" : "" } >${ type }<option>`
	);

	const htm =
	`
		<p>Surface type: ${ error.typeSource }</p>
		<p>
			Reasons: <i>${ error.reasons }</i><br>
			Error: ${ error.error }
		</p>
		<p><select>${ options }</select></p>

		${ GSA.getSurfacesAttributesByIndex( error.index, error.id ) }
	`;

	return htm;

};



FSTN.getSurfaceTypeNew = function( surface, typeSource ) {
	//console.log( '', surface );

	const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i )[ 1 ];

	let spaces = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
	spaces = spaces ? spaces : [];
	//console.log( '', spaces );

	const exposedToSun0 = surface.match( /exposedToSun="(.*?)"/i );
	const exposedToSun1 = exposedToSun0 === null ?  ["", "no attribute" ] : exposedToSun0 ;
	const exposedToSun = exposedToSun1[ 1 ] ? exposedToSun1[ 1 ] : "undefined";
	//console.log( 'exposedToSun', exposedToSun );
	//const typeSource = typeSource1[ 1 ] ? typeSource1[ 1 ] : "undefined";

	let typeNew = "Shade";
	let reasons = "Invalid surface type name. ";
	let error = "";

	if ( spaces.length === 0 ) {

		typeNew = "Shade";
		reasons += "No adjacent spaces. ";

	} else if ( spaces.length ===  1 ) {

		reasons += "Single adjacent space ID. ";

		if ( Number( tilt ) === 90 ) {

			reasons += `Tilt = ${ tilt }. `;

			if ( exposedToSun === "true" ) {

				typeNew = "ExteriorWall";
				reasons += `ExposedToSun set to ${ exposedToSun }. `;

			} else {

				reasons += `ExposedToSun attribute is unknown. `;
				reasons += `Type = ${ typeSource }. `;

				if ( [ "ExteriorWall", "UndergroundWall" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "ExteriorWall";
					error = "Need exterior or underground wall. ";

				}

			}

		} else if ( Number( tilt ) === 0 ) {

			reasons += `Tilt = ${ tilt }. `;

			if ( exposedToSun === "true" ) {

				reasons += `ExposedToSun set to ${ exposedToSun }. `;

				if ( [ "ExposedFloor", "RaisedFloor", "Roof" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "Roof";
					error = "Need floor or roof";

				}

			} else {

				reasons += `ExposedToSun attribute is unknown. `;
				reasons += `Type = ${ typeSource }. `;

				if ( [ "ExposedFloor", "RaisedFloor", "Roof", "SlabOnGrade", "UndergroundCeiling",
					"UndergroundSlab" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "SlabOnGrade";
					error = "Need horizontal surface ";

				}

			}

		} else if ( Number( tilt ) === 180 ){

			reasons += `Tilt = ${ tilt }. `;

			if ( exposedToSun === "true" ) {

				reasons += `ExposedToSun set to ${ exposedToSun }. `;

				if ( [ "ExposedFloor", "RaisedFloor", "Roof", "UndergroundCeiling" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "Roof";
					error = "ExposedToSun true";

				}

			} else {

				reasons += `ExposedToSun attribute is unknown. `;

				if ( [ "ExposedFloor", "RaisedFloor", "Roof", "SlabOnGrade", "UndergroundSlab" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "SlabOnGrade";
					error = "incorrect surface type ";

				}

			}

		}

	} else if ( spaces.length ===  2 ) {

		reasons += "Two adjacent space IDs. ";

		let id1 = spaces[ 0 ].match( /spaceIdRef="(.*?)"/i );
		id1 = id1 ? id1[ 1 ] : id1;
		let id2 = spaces[ 1 ].match( /spaceIdRef="(.*?)"/i );
		id2 = id2 ? id2[ 1 ] : id2;
		//console.log( '', id1, id2 );

		if ( Number( tilt ) === 90 ) {

			reasons += `Tilt = ${ tilt }. `;

			if ( id1 !== id2) {

				reasons += "Different adjacent space IDs. ";
				typeNew = "InteriorWall";

			} else {

				reasons += "Identical IDs. ";

				if ( typeSource === "InteriorWall" ) {

					reasons += "Interior wall with identical adjacent IDs. ";
					typeNew = "InteriorWall";

				} else {

					typeNew = "Air";

				}

			}

		} else if ( Number( tilt ) === 0 ) {

			reasons += `Tilt = ${ tilt }. `;

			if ( exposedToSun === "true" ) {

				reasons += `ExposedToSun set to ${ exposedToSun }. `;

				if ( [ "Air", "Ceiling", "InteriorFloor" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else { // pick a likely candidate

					typeNew = "InteriorFloor";
					error = "Need horizontal surface";

				}

			}

		} else if ( Number( tilt ) === 180 ){

			reasons += `Tilt = ${ tilt }. `;

			if ( [ "Air", "InteriorFloor", "Ceiling" ].includes( typeSource ) ) {

				typeNew = typeSource;

			} else {

				typeNew = "InteriorFloor";

			}

		}


	} else {

		console.log( 'no spaces', surface );

	}
	//console.log( '',  { typeNew, reasons } );

	return { typeNew, reasons, error };

};



FSTN.fixAllChecked = function() {

	const boxesChecked = Array.from( FSTNdivSurfaceType.querySelectorAll( 'input:checked' ) ).map( item => item.value );

	for ( let error of FSTN.errors ) {

		if ( boxesChecked.includes( error.id ) ) {

			//console.log( 'error', error);

			const surfaceCurrent = GBX.surfaces[ error.index ];

			let surfaceNew;

			if ( error.typeSource === "no attribute" ) {

				surfaceNew = surfaceCurrent.replace( / id="/i, `surfaceType="${ error.typeNew }" id="` );

			} else {

				surfaceNew = surfaceCurrent.replace( /surfaceType="(.*?)"/i, `surfaceType="${ error.typeNew }"` );

			}

			GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
			GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

		}

	}

	FSTNdet.open = false;

};

