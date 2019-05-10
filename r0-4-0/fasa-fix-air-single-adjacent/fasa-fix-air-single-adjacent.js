/* globals FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FASA = {
	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-10",
	"description":
		"Identify all the surfaces of a model of type \"Air\" that have a single adjacent space attribute. " +
		"Allow you to change the surface type to \"Roof\". ",
	"helpFile": "../fasa-fix-air-single-adjacent/README.md",
	"release": "0.4.1",

};



FASA.getMenuAirSingleAdjacent = function() {

	FASA.help = `<button id=butFASA class=butHelp onclick="MNU.setPopupShowHide(butFASA,FASA.helpFile);" >?</button>`;

	const htm =
		`
			<details id=FASAdet ontoggle="FASAdivAirSingleAdjacent.innerHTML=FASA.getAirSingleAdjacent();" >

				<summary id=FASAsumSurfaces >Fix air surfaces with single adjacent space
					${ FASA.help }
				</summary>

				<div id=FASAdivAirSingleAdjacent ></div>

				<div id=FASAdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



FASA.getAirSingleAdjacent = function() {

	const timeStart = performance.now();

	FASAdivSurfaceAttributeData.innerHTML = "";

	FASA.airSurfaces = GBX.surfaces.filter( surface => {

		let surfaceType = surface.match( /surfaceType="(.*?)"/);
		surfaceType = surfaceType ? surfaceType[ 1 ] : "";

		return surfaceType === "Air";

	} );
	//console.log( 'FASA.airSurfaces', FASA.airSurfaces );

	FASA.airSingleAdjacents = FASA.airSurfaces.filter( surface => {

		let adjacentSpaceArr = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
		adjacentSpaceArr = adjacentSpaceArr ? adjacentSpaceArr : [];
		//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

		return adjacentSpaceArr.length === 1;

	} )
	//console.log( 'FASA.', FASA.airSingleAdjacents );

	FASA.surfaces = FASA.airSingleAdjacents.map( ( surface ) => {

		const index = GBX.surfaces.indexOf( surface );

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/i )
		name = name ? name[ 1 ] : id;

		let typeSource = surface.match( /surfaceType="(.*?)"/i )
		typeSource = typeSource ? typeSource[ 1 ] : "";
		//console.log( '', typeSource );

		let adjacentSpaceArr = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
		adjacentSpaceArr = adjacentSpaceArr ? adjacentSpaceArr : [];
		//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

		//let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		//exposedToSun = exposedToSun ? exposedToSun[ 0 ] : "";

		//let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : "false";
		//console.log( 'exposedToSun', exposedToSun );

		return( { index, id, name, typeSource, adjacentSpaceArr } )


	} )
	//console.log( 'FASA.surfaces', FASA.surfaces );
	//console.log( 'FASA.surfaceTypes', FASA.surfaceTypes );


	/*
	surfacesString = FASA.surfaces.map( item =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=FASAdivSurfaceAttributeData.innerHTML=FASA.getSurfaceData(${item.index },"${ item.id}");
		title="${ item.id }" >
		${ item.name }</button> / from:
		 <mark>${ item.typeSource }</mark> to: Roof
		`
	).join("<br>");

	*/

	const options = FASA.surfaces.map( extra => {

		return `<option value=${ extra.index } title="${ extra.id }" >${ extra.name }</option>`;

	} );

	FASAsumSurfaces.innerHTML =
		`Get air surfaces with single adjacent space ~ ${ FASA.surfaces.length.toLocaleString() } found
			${ FASA.help }
		`;

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ FASA.description }</p>

		<p>${ FASA.surfaces.length.toLocaleString() } surfaces of type "Air" with single adjacent space.</p>

		<p>
			<select id=FASEselAdjacentSpaceExtra onclick=FASA.setAirSingleAdjacentData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<p><button onclick=FASA.changeAllAirSingleAdjacent(); >Fix all</button></p>

		<div id="FASAdivAirSingleAdjacentData" >Click a surface name above to view its details and change its surface type. Tool tip shows the ID of the surface.</div>

		<p>Click 'Save file' button in File menu to save changes to a file.</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;


	return htm;

};



FASA.setAirSingleAdjacentData = function( select ) {
	//console.log( 'select.value', select.value );

	surface = FASA.surfaces[ select.selectedIndex ];
	console.log( 'surface', surface );

	const htm =
	`
		<p>
		gbXML adjace space text: <br>
		<textarea style=width:100%; >${ surface.adjacentSpaceArr.join( "\n" ) }</textarea>
		</p>
		${ GSA.getSurfacesAttributesByIndex( surface.index, surface.name ) }
		<p>
			<button onclick=FASA.changeAirSingleAdjacent(${ select.selectedIndex }); >change adjacent space type to "Roof"</button>
		</p>
	`;

	FASAdivSurfaceAttributeData.innerHTML = htm;

	const det = FASAdivSurfaceAttributeData.querySelectorAll( 'details');
	det[ 0 ].open = true;

};




FASA.changeAirSingleAdjacent = function( index ) {

	const air = FASA.surfaces[ index ];
	//console.log( 'air', air );

	let surfaceTextCurrent = GBX.surfaces[ air.index ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="Air"/i , 'surfaceType="Roof"' );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

	surfaceTextCurrent = surfaceTextNew;

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FASAdet.open = false;

	FASAdivFixAirSingleAdjacent.innerHTML = FASA.getMenuAirSingleAdjacent();


}


FASA.changeAllAirSingleAdjacent = function() {

	FASA.surfaces.forEach( ( surface, index ) => {

		//console.log( 'ind', surface.index );

		FASA.changeAirSingleAdjacent( index );

	} );

}
/*
FASA.getSurfaceData = function( index, text = "item" ) {

	htm = GSA.getSurfacesAttributesByIndex( index, text );

	return htm;

};
*/
