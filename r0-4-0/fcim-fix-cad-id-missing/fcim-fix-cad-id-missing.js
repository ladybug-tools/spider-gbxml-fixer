//Copyright 2019 Ladybug Tools authors. MIT License
/* globals GBX, GSA, GBXinpIgnoreAirSurfaceType, FCIMsumCadIdMissing, FCIMinpCadId, FCIMdet, FCIMdivCadIdMissing, FCIMselSurface */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FCIM = { release: "0.3.0", date: "2019-04-17" };


FCIM.description = `Assign an ID to surfaces with a missing CAD object ID`;

FCIM.currentStatus =
	`
		<h3>Fix Surface CAD Object ID Missing (FCIM) R${ FCIM.release } ~ ${ FCIM.date }</h3>

		<p>
			${ FCIM.description }.
		</p>

		<details open>
			<summary>Wish list / to do</summary>
			<ul>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-17 ~ F - Add 'fix all' button & refactor</li>
				<li>2019-04-03 ~ F - First commit</li>
			</ul>
		</details>
	`;


FCIM.getCadIdMissing = function() {

	const htm =
		`
			<details id=FCIMdet ontoggle="FCIMdivCadIdMissing.innerHTML=FCIM.getFixCadIdMissing();" >

			<summary id=FCIMsumCadIdMissing >Fix Surfaces with CAD object ID missing
				<a id=FCIMSum class=helpItem href="JavaScript:MNU.setPopupShowHide(FCIMSum,FCIM.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

				<div id=FCIMdivCadIdMissing ></div>

			</details>

		`;

	return htm;

};



FCIM.getFixCadIdMissing = function() {

	const timeStart = performance.now();
	FCIM.errors = [];

	GBX.surfaces.forEach( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];
		const cadIdSource = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/);

		let cadId;

		if ( !cadIdSource ) {

			cadId = "no attribute";

		} else if ( cadIdSource[ 1 ] === "" ){

			cadId = "undefined";

		}
		//console.log( 'cadId', cadId );

		if ( [ "no attribute", "undefined" ].includes( cadId ) ){ FCIM.errors.push( { id, index, cadId } ); }

	} );
	//console.log( 'FCIM.errors', FCIM.errors );

	if ( GBXinpIgnoreAirSurfaceType.checked === true ) {

		FCIM.errors = FCIM.errors.filter( id => {

			const surfaceText = GBX.surfaces[ id ];
			//console.log( 'surfaceText', surfaceText );

			const surfaceType = surfaceText.match( /surfaceType="(.*?)"/)[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			return surfaceType !== "Air";

		}) ;

	}

	const options = FCIM.errors.map( ( item, indexError ) => {

		const surface = GBX.surfaces[ item.index ];
		//console.log( 'sf', surface );

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/gi );
		//console.log( 'name', name );

		name = name ? name.pop() : id;
		//.pop();

		return `<option value=${ indexError } title="${ id }" >${ name }</option>`;

	} );
	//console.log( 'options', options );

	const help = `<a id=fcimHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fcimHelp,FCIM.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FCIMsumCadIdMissing.innerHTML =
		`Fix surfaces with missing CAD object ID ~ ${ FCIM.errors.length.toLocaleString() } found
			${ help }
		`;


	const cimHtm =
		`
			<p><i>The CADObjectId Element is used to map unique CAD object identifiers to gbXML elements</i></p>

			Surfaces with no CAD Object ID: ${ FCIM.errors.length.toLocaleString() }<br>

			<p>
				<select id=FCIMselSurface onclick=FCIMdivIdMissingData.innerHTML=FCIM.getSurfaceData(this); size=5 style=min-width:8rem; >${ options }</select>
			</p>

			<p><button onclick=FCIM.fixAllSelected(); >Fix all</button></p>

			<div id="FCIMdivIdMissingData" >Click a surface name above to view its details and update its CAD object ID</div>

			<div id=FCIMdivSelectedSurfaceGbXML></div>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;

	return cimHtm;

};


FCIM.getSurfaceData = function( select ) {
	//console.log( 'select.selectedIndex', select.selectedIndex  );

	const error = FCIM.errors[ select.selectedIndex ];
	// console.log( 'error', error );

	const invalidData = GSA.getSurfacesAttributesByIndex( error.index, error.id );

	const htm =

	`
		${ invalidData }
		<p>
			CAD Object ID <input id=FCIMinpCadId value="Place holder: ${ error.id }" style=width:30rem; >

			<button onclick=FCIM.getFixCim(FCIMselSurface.selectedIndex); >UpdateCAD Object ID</button>
		</p>
	`;

	return htm;

};




//////////

FCIM.getFixCim = function( indexError ) {
	console.log( 'index', indexError );

	const error = FCIM.errors[ indexError ];
	console.log( 'error', error );

	const surfaceTextCurrent = GBX.surfaces[ error.index ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const text = FCIMinpCadId.value;

	let surfaceTextNew;

	if ( error.cadId === "no attribute" ){

		surfaceTextNew = surfaceTextCurrent.replace( /<\/Surface>/i, `<CADObjectId>${ text }</CADObjectId> <\/Surface>` );

	} else {

		surfaceTextNew = surfaceTextCurrent.replace( /<CADObjectId>(.*?)<\/CADObjectId>/i, `<CADObjectId>${ text }</CADObjectId>` );

	}
	//console.log( 'surfaceTextNew', surfaceTextNew );

	GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FCIMdet.open = false;

	FCIMdivCadIdMissing.innerHTML = FCIM.getFixCadIdMissing();

	//console.log( 'suf', GBX.surfaces[ error.index ] );


};



FCIM.fixAllSelected = function() {

	for ( let i = 0; i < FCIMselSurface.length; i++ ) {

		const error = FCIM.errors[ i ];

		const surfaceTextCurrent = GBX.surfaces[ error.index ];
		//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

		const text = `place holder: ${ error.id }`;

		let surfaceTextNew;

		if ( error.cadId === "no attribute" ){

			surfaceTextNew = surfaceTextCurrent.replace( /<\/Surface>/i, `<CADObjectId>${ text }</CADObjectId> <\/Surface>` );

		} else {

			surfaceTextNew = surfaceTextCurrent.replace( /<CADObjectId>(.*?)<\/CADObjectId>/i, `<CADObjectId>${ text }</CADObjectId>` );

		}
		//console.log( 'surfaceTextNew', surfaceTextNew );

		GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

	}

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FCIMdet.open = false;

	FCIMdivCadIdMissing.innerHTML = FCIM.getFixCadIdMissing();

	//console.log( 'suf', GBX.surfaces[ error.index ] );

};
