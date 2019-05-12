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


FASST.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];



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

	FASST.surfaces = [];

	FASST.surfaces = GBX.surfaces.map( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/i );
		name = name ? name[ 1 ] : id;

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";
		//console.log( '', typeSource );

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		exposedToSun = exposedToSun ? exposedToSun[ 0 ] : "";
		//let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : "false";

		return( { index, id, name, typeSource, exposedToSun } );

	} );

	console.log( 'FASST.surfaces', FASST.surfaces );
	//console.log( 'FASST.surfaceTypes', FASST.surfaceTypes );

	/*
	const surfacesString = FASST.surfaces.map( item =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=FASSTdivSurfaceAttributeData.innerHTML=FASST.getSurfaceData(${item.index },"${ item.id}");
		title="${ item.id }" >
		${ item.name }</button> / ${ item.typeSource } from:
		 <mark>${ item.exposedToSun }</mark> to: exposedToSun="false"
		`
	).join("<br>");
	*/


	const options = FASST.surfaces.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );


	FASSTsumSurfaces.innerHTML = `Surfaces ~ ${ FASST.surfaces.length.toLocaleString() } found ${ FASST.help }`;

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ FASST.surfaces.length.toLocaleString() } surface types found.</p>


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

	const surface = FASST.surfaces[ select.selectedIndex ];
	//console.log( 'surface', surface );

	const htm = GSA.getSurfacesAttributesByIndex( select.selectedIndex, surface.name );

	FASSTdivSurfaceData.innerHTML = htm;

};
