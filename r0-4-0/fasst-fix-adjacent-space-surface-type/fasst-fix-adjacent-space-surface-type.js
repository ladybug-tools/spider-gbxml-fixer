/* globals GBX, GSA, FASSTsumSurfaces, FASSTdivSurfaceAttributeData, FASSTdivSurfaceData, FASSTdet */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FASST = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-12",
	"description": "Fix surfaces with two adjacent spaces that are not of a surface type that requires two adjacent spaces",
	"helpFile": "./r0-4-0/fasst-fix-adjacent-space-surface-type/README.md",
	"release": "0.1.2"

};


FASST.typesTwoAdjacentSpaces = [ "InteriorWall", "InteriorFloor", "Ceiling", "Air" ];

FASST.getMenuFASST = function() {

	FASST.help = `<button id=butFASST class=butHelp onclick="MNU.setPopupShowHide(butFASST,FASST.helpFile);" >?</button>`;


	const htm =
		`
			<details id=FASSTdet ontoggle="FASSTdivSurface.innerHTML=FASST.getSurfaces();" >

				<summary id=FASSTsumSurfaces >Fix surfaces with two adjacent spaces & incorrect surface type
					${ FASST.help }
				</summary>

				<div id=FASSTdivSurface ></div>

				<div id=FASSTdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



FASST.getSurfaces = function() {

	const timeStart = performance.now();

	FASSTdivSurfaceAttributeData.innerHTML = "";

	FASST.surfacesTwoSpaces = [];

	GBX.surfaces.forEach( ( surface, index ) => {

		const spaceIdRefs = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( spaceIdRefs && spaceIdRefs.length && spaceIdRefs.length >= 2 ) {
			//console.log( 'spaceIdRefs', spaceIdRefs );

			const surfaceType = surface.match( /surfaceType="(.*?)"/i )[ 1 ];

			if ( FASST.typesTwoAdjacentSpaces.includes( surfaceType ) === false && spaceIdRefs[ 0 ] !== spaceIdRefs[ 1 ]) {

				//console.log( 'surfaceType', surfaceType );
				FASST.surfacesTwoSpaces.push( index );

			}

		}

	} );
	//console.log( 'FASST.surfacesTwoSpaces', FASST.surfacesTwoSpaces );

	const options = FASST.surfacesTwoSpaces.map( index => {

		const surface = GBX.surfaces[ index ];
		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		const names = surface.match( /<Name>(.*?)<\/Name>/i );
		const name = names ? names[ 1 ] : id;

		return `<option value=${ index } title="${ id }" >${ name }</option>`;

	} );


	FASSTsumSurfaces.innerHTML = `Fix surfaces with two adjacent spaces & incorrect surface type ~ ${ FASST.surfacesTwoSpaces.length.toLocaleString() } found ${ FASST.help }`;

	const htm =
	`
		<p><i>Identify surfaces with two adjacent spaces that are not of type: ${ FASST.typesTwoAdjacentSpaces.join( ", " ) } </i></p>

		<p><i>Fixes:
			<ul>
				<li>If tilt equals 90: update surface type to "InteriorWall", set exposedToSun to false, update CADObjectID to "Basic Wall: SIM_INT_SLD SpiderFix [id as in original element]"</li>
				<li>If tilt not equal to 90: update surface type to "InteriorWall", set exposedToSun to false, update CADObjectID to "Floor: SIM_INT_SLD_FLR SpiderFix [id as in original element]"</li>
			</ul>
		</i></p>

		<p><i>See also "Fix surfaces with an extra adjacent space" for an alternative fix </i></p>

		<p>${ FASST.surfacesTwoSpaces.length.toLocaleString() } surface(s) found.</p>

		<p>
			<select id=FASSTselSurfaces onclick=FASST.setSurfaceData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<p><button onclick=FASST.fixAllSurfaces(); >Fix all</button></p>

		<div id="FASSTdivSurfaceData" >Click a surface name above to view its details. Tool tip shows the ID of the surface.</div>

		<p>Click 'Save file' button in File menu to save changes to a file.</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};



FASST.setSurfaceData = function( select ) {
	console.log( 'value', select.value );

	const htm =
	`
		${ GSA.getSurfacesAttributesByIndex( select.value, select.selectedOptions[ 0 ].innerHTML ) }

		<p>
			<button onclick=FASST.fixSurface(${ select.value }); title="If tilt equals 90" >change surface type</button>
			View edits in Develope Console (F12/Ctrl-J/Cmd-J)
		</p>
	`;

	FASSTdivSurfaceData.innerHTML = htm;

	const det = FASSTdivSurfaceData.querySelectorAll( 'details');
	det[ 0 ].open = true;

};



FASST.fixSurface = function( index ) {

	const surfaceTextCurrent = GBX.surfaces[ index ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const tilts = surfaceTextCurrent.match( /<Tilt>(.*?)<\/Tilt>/i );
	const tilt = tilts ? tilts[ 1 ] : "";
	console.log( 'tilt', tilt );

	let surfaceTextNew;

	if ( tilt === "90" ) {

		surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*?)"/i, `surfaceType="InteriorWall"` );

		surfaceTextNew = surfaceTextNew.replace( /<CADObjectId>(.*?)\[(.*)\]<\/CADObjectId>/i, `<CADObjectId>Basic Wall: SIM_INT_SLD SpiderFix [$2]</CADObjectId>` );

		surfaceTextNew = surfaceTextNew.replace( /exposedToSun="(.*?)"/i, `exposedToSun="false"` );

		console.log( 'surfaceTextNew', surfaceTextNew );

	} else {

		surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*?)"/i, `surfaceType="InteriorFloor"` );

		surfaceTextNew = surfaceTextNew.replace( /<CADObjectId>(.*?)\[(.*)\]<\/CADObjectId>/i, `<CADObjectId>Floor: SIM_INT_SLD_FLR SpiderFix [$2]</CADObjectId>` );

		surfaceTextNew = surfaceTextNew.replace( /exposedToSun="(.*?)"/i, `exposedToSun="false"` );

	}

	GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FASSTdet.open = false;

};



FASST.fixAllSurfaces = function() {

	for ( let index of FASST.surfacesTwoSpaces ) {

		FASST.fixSurface( index );

	}

};