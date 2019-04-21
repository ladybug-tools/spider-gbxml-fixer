//Copyright 2019 Ladybug Tools authors. MIT License
/* globals FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FT = { "release": "1.0.0", "date": "2019-04-09" };


FT.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];


FT.description =
	`
		template for checking surfaces
	`;

FT.currentStatus =
	`
		<h3>Fix Surface Type Invalid (FT) R${ FT.release } ~ ${ FT.date }</h3>

		<p>
			${ FT.description }.
		</p>

		<p>
			Wish List / To do:<br>
			<ul>

			</ul>
		</p>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-11 ~ First commit</li>
			</ul>
		</details>
	`;




FT.getSurfaceTypeInvalid = function() {

	const htm =
		`
			<details ontoggle="FTdivSurface.innerHTML=FT.getSurfaces();" >

				<summary id=FTsumSurfaces class=sumHeader >Get surfaces
					<a id=FTsum class=helpItem href="JavaScript:MNU.setPopupShowHide(FTsum,FT.currentStatus);" >&nbsp; ? &nbsp;</a>
				</summary>

				<div id=FTdivSurface ></div>

				<div id=FTdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



FT.getSurfaces = function() {

	const timeStart = performance.now();

	FTdivSurfaceAttributeData.innerHTML = "";

	FT.surfaces = [];

	FT.surfaces = SGF.surfaces.map( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/i )
		name = name ? name[ 1 ] : id;

		let typeSource = surface.match( /surfaceType="(.*?)"/i )
		typeSource = typeSource ? typeSource[ 1 ] : "";
		//console.log( '', typeSource );

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		exposedToSun = exposedToSun ? exposedToSun[ 0 ] : "";

		let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : "false";

		//console.log( 'exposedToSun', exposedToSun );

		return( { index, id, name, typeSource, exposedToSun } )


	} )

	console.log( 'FT.surfaces', FT.surfaces );
	//console.log( 'FT.surfaceTypes', FT.surfaceTypes );

	//errors = FT.errors.map( item => `id: ${ item.id } current surface type: ${ item.typeSource } ${ item.exposedToSun }` );

	surfacesString = FT.surfaces.map( item =>
		`<input type=checkbox value=${ item.id } checked >
		<button onclick=FTdivSurfaceAttributeData.innerHTML=FT.getSurfaceData(${item.index },"${ item.id}");
		title="${ item.id }" >
		${ item.name }</button> / ${ item.typeSource } from:
		 <mark>${ item.exposedToSun }</mark> to: exposedToSun="false"
		`
	).join("<br>");


	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FT.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FTsumSurfaces.innerHTML =
		`Surfaces ~ ${ FT.surfaces.length.toLocaleString() } found
			${ help }
		`;

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ FT.surfaces.length.toLocaleString() } surface types found.</p>

		${ surfacesString }

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};



FT.getSurfaceData = function( index, text = "item" ) {

	htm = GSA.getSurfacesAttributesByIndex( index, text );

	return htm;

};


/*


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

*/
