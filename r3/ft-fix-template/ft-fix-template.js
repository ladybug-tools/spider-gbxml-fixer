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

FT.exposedTypes = [ "ExteriorWall", "Roof", "ExposedFloor", "Shade", "RaisedFloor" ];

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
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</details>
	`;




FT.getSurfaceTypeInvalid = function() {

	const htm =
		`
			<details ontoggle="FXSTIdivSurfaceType.innerHTML=FT.getSurfaceType();" >

				<summary id=FXSTIsumSurfaceType class=sumHeader >Fix surfaces with invalid surface type
					<a id=FXSTISum class=helpItem href="JavaScript:MNU.setPopupShowHide(FXSTISum,FT.currentStatus);" >&nbsp; ? &nbsp;</a>
				</summary>

				<div id=FXSTIdivSurfaceType ></div>

			</details>

		`;

	return htm;

};



FT.getSurfaceType = function() {

	const timeStart = performance.now();

	FT.errors = [];

	FT.surfaceTypes = SGF.surfaces.map( surface => {

		let typeSource = surface.match( /surfaceType="(.*?)"/i )
		typeSource = typeSource ? typeSource[ 1 ] : "";
		//console.log( '', typeSource );

		if ( typeSource === "Air" ) {

			let spaces = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
			spaces = spaces ? spaces : [];
			console.log( 'spaces', spaces[ 0 ] === spaces[ 1 ] );

		}

		//console.log( 'exposedToSun', exposedToSun );


	} )

	console.log( 'FT.errors', FT.errors );
	//console.log( 'FT.surfaceTypes', FT.surfaceTypes );

	errors = FT.errors.map( item => `id: ${ item.id } current surface type: ${ item.typeSource } ${ item.exposedToSun }` );

	const help = `<a id=fxstiHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxstiHelp,FT.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXSTIsumSurfaceType.innerHTML =
		`Surface types ~ ${ FT.surfaceTypes.length.toLocaleString() } found
			${ help }
		`;

	const htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ SGF.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FT.surfaceTypes.length.toLocaleString() } surface types found.</p>

		${ errors.join("<br>") }

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};



FT.setTypeInvalidData = function( select ) {

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
				<button onclick=FT.setSurfaceType(${ index }); >Update data in memory</button>
				<button onclick=FT.showSurfaceGbxml(${ index }); >View gbXML text</button>
			</p>
		`;

	FXSTIdivTypeInvalidData.innerHTML = htm;

};



FT.setSurfaceType = function( index ) {
	//console.log( 'index',FT.surfaceTypeInvalids[ index ]  );

	const surfaceTextCurrent = SGF.surfaces[ FT.surfaceTypeInvalids[ index ] ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const type = document.body.querySelector( `#selSurfaceType${ index }` ).value;
	//console.log( 'type', type );

	const surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="(.*)" /, `surfaceType="${ type }" ` );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	SGF.text =  SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

};



FT.showSurfaceGbxml = function( index ) {

	const surfaceText = SGF.surfaces[ FT.surfaceTypeInvalids[ index ] ];

	//const div = document.body.querySelector( `#divSurfaceType${ index }` );

	FXSTIdivSelecteSurfaceTGbxml.innerText = surfaceText;

};
