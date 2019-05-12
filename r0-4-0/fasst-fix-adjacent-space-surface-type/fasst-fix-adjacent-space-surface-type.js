/* globals GBX, GSA, FASSTsumSurfaces */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FASST = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-10",
	"description": "Fix surfaces with two adjacent spaces that are not of a surface type that requires two adjacent spaces",
	"helpFile": "../fasst-fix-adjacent-space-surface-type/README.md",
	"release": "0.4.1"

};


FASST.typesTwoAdjacentSpaces = [ "InteriorWall", "InteriorFloor", "Ceiling", "Air" ];



FASST.getMenuFASST = function() {

	FASST.help = `<button id=butFASST class=butHelp onclick="MNU.setPopupShowHide(butFASST,FASST.helpFile);" >?</button>`;


	const htm =
		`
			<details ontoggle="FASSTdivSurface.innerHTML=FASST.getSurfaces();" >

				<summary id=FASSTsumSurfaces >Fix surfaces with two adjacent spaces and incorrect surface type
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
			//console.log( 'spaceIdRef', spaceIdRef );

			const surfaceType = surface.match( /surfaceType="(.*?)"/i )[ 1 ];

			if ( FASST.typesTwoAdjacentSpaces.includes( surfaceType ) === false ) {

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


	FASSTsumSurfaces.innerHTML = `Surfaces ~ ${ FASST.surfacesTwoSpaces.length.toLocaleString() } found ${ FASST.help }`;

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ FASST.surfacesTwoSpaces.length.toLocaleString() } surface types found.</p>


		<p>
			<select id=FASSTselSurfaces onclick=FASST.setSurfaceData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<p><button onclick=FASST.changeAllSurfaces(); >Fix all</button></p>

		<div id="FASSTdivSurfaceData" >Click a surface name above to view its details and change its surface type. Tool tip shows the ID of the surface.</div>

		<!-- <p>Click 'Save file' button in File menu to save changes to a file.</p> -->

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};



FASST.setSurfaceData = function( select ) {
	//console.log( 'value', select.value );

	const htm = GSA.getSurfacesAttributesByIndex( select.value, select.selectedOptions[ 0 ].innerHTML );

	FASSTdivSurfaceData.innerHTML = htm;

	const det = FASSTdivSurfaceData.querySelectorAll( 'details');
	det[ 0 ].open = true;

};
