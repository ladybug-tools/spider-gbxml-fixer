// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FXASEselAdjacentSpaceExtra, FXASEsumSpaceExtra, FXASEdivSpaceExtraData, FXASEdivSpaceExtra  */
/* jshint esversion: 6 */
/* jshint loopfunc: true */



const FASE = { "release": "3.0.0", "date": "2019-04-19" };


FASE.description =
	`
		Checks for a surface with more adjacent spaces and required
	`;


FASE.currentStatus =
	`
		<h3>Fix Surface Adjacent Space Extra (FASE) R${ FASE.release } ~ ${ FASE.date }</h3>

		<p>
			${ FASE.description }.
		</p>

		<details>
			<summary>Wish List / To do</summary>
			<ul>
				<li>2019-04-02 ~ B - Validate and fix with jsHint</li>
				<li>2019-03-25 ~ Add select and update multiple surfaces at once</li>
				<li>2019-03-19 ~ Pre-select the correct surface type in the select type list box</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-03 ~ First commit</li>
			</ul>
		</details>
	`;




FASE.getFixAdjacentSpaceExtra = function() {

	const htm =
		`
			<details id=FASEdet ontoggle="FXASEdivAdjacentSpaceExtra.innerHTML=FASE.getAdjacentSpaceExtra();" >

				<summary id=FXASEsumAdjacentSpaceExtra class=sumHeader >Fix surfaces with an extra adjacent space
					<a id=FXASESum class=helpItem href="JavaScript:MNU.setPopupShowHide(FXASESum,FASE.currentStatus);" >&nbsp; ? &nbsp;</a>
				</summary>

				<div id=FXASEdivAdjacentSpaceExtra ></div>

			</details>
		`;

	return htm;

};


FASE.oneSpace = [ 'ExteriorWall', 'Roof', 'ExposedFloor', 'UndergroundCeiling', 'UndergroundWall',
	'UndergroundSlab', 'RaisedFloor', 'SlabOnGrade', 'FreestandingColumn', 'EmbeddedColumn' ];

FASE.getAdjacentSpaceExtra = function() {

	const timeStart = performance.now();

	FASE.extras = [];

	const surfaces = SGF.surfaces;

	// refactor to a reduce??
	surfaces.forEach( (surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let surfaceType = surface.match ( /surfaceType="(.*?)"/ );
		surfaceType = surfaceType ? surfaceType[ 1 ] : [];

		let adjacentSpaceArr = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
		adjacentSpaceArr = adjacentSpaceArr ? adjacentSpaceArr : [];
		//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

		let name = surface.match( /<Name>(.*?)<\/Name>/i )
		name = name ? name[ 1 ] : id;

		if ( FASE.oneSpace.includes( surfaceType ) && adjacentSpaceArr && adjacentSpaceArr.length > 1 ) {

			FASE.extras.push( { id, index, surfaceType, name, adjacentSpaceArr  } );

		} else if ( surfaceType === "Shade" && adjacentSpaceArr.length > 0 ) {
			//console.log( 'Shade with adjacent space found', 23 );

			FASE.extras.push( { id, index, surfaceType, name, adjacentSpaceArr  } );

		}

	} );

	const options = FASE.extras.map( extra => {

		return `<option value=${ extra.index } title="${ extra.id }" >${ extra.name }</option>`;

	} );
	//console.log( 'options', options );

	const help = `<a id=fxaseHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxaseHelp,FASE.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXASEsumAdjacentSpaceExtra.innerHTML =
		`Fix surfaces with an extra adjacent space ~ ${ FASE.extras.length.toLocaleString() } found
			${ help }
		`;

	const aseHtm =
		`
			<p><i>Exterior surfaces that normally take a single adjacent space that are found to have two adjacent spaces.</i></p>

			<p>
				${ FASE.extras.length.toLocaleString() } surface(s) with extra spaces found. See tool tips for surface ID.
			</p>

			<p>
				<select id=FXASEselAdjacentSpaceExtra onclick=FASE.setSpaceExtraData(this); size=5 style=min-width:8rem; >
					${ options }
				</select>
			</p>

			<p><button onclick=FDPC.deleteDuplicateSurfaces(); >Fix all</button></p>
			<div id="FXASEdivSpaceExtraData" >Click a surface name above to view its details and delete extra space. Tool tip shows the ID of the surface.</div>


			<div id=FXASEdivSelectedSurfaceGbXML ></div>

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return aseHtm;

};



FASE.setSpaceExtraData = function( select ) {
	//console.log( 'select.value', select.value );

	extra = FASE.extras[ select.selectedIndex ];
	//console.log( 'extra', extra );

	const htm =
	`
		<p>
		text: <br>
		<textarea style=width:100%; >${ extra.adjacentSpaceArr.join( "\n" ) }</textarea>
		</p>
		${ GSA.getSurfacesAttributesByIndex( extra.index, extra.name ) }
		<p>
			<button onclick=FASE.adjacentSpaceDelete(${ select.selectedIndex }); >delete invalid adjacent space</button>
		</p>
	`;

	FXASEdivSpaceExtraData.innerHTML = htm;

	const det = FXASEdivSpaceExtraData.querySelectorAll( 'details');
	det[ 0 ].open = true;

};



FASE.adjacentSpaceDelete = function( index ) {

	extra = FASE.extras[ index ];
	//console.log( 'extra', extra );

	let surfaceTextCurrent = SGF.surfaces[ extra.index ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	if ( extra.surfaceType === "Shade" ) {

		const result = confirm( `Surface type is "Shade".\nOK to delete all adjacent space references?` );

		if ( result !== true ) { return; }

		const regex = new RegExp( `<AdjacentSpaceId(.*?)\/>`, "gi" );
		const matches = surfaceTextCurrent.match ( regex );
		//console.log( 'matches', matches );

		for ( match of matches ) {

			const surfaceTextNew = surfaceTextCurrent.replace( match, '' );
			//console.log( 'surfaceTextNew', surfaceTextNew );

			SGF.text = SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

			surfaceTextCurrent = surfaceTextNew

		}

	} else if ( FASE.oneSpace.includes( extra.surfaceType ) ) {

		const matches = surfaceTextCurrent.match ( /spaceIdRef="(.*?)"/gi );
		//console.log( 'matches', matches );

		spaceIds = matches.map( match => match.match( /"(.*?)"/ )[ 1 ] );
		//console.log( 'spaceIds', spaceIds );

		keeper = []
		for ( spaceId of spaceIds ) {

			for ( space of SGF.spaces ) {

				if ( space.includes( spaceId ) ) {

					//console.log( 'space', spaceId  );

					keeper.push( `keeper ${ spaceId }` );
					break;

				} else {

					keeper = [ `not to keep: ${ spaceId }`];
				}

			}
		}

		console.log( '', keeper );
		
	}

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

	FASEdet.open = false;

	FASEdivFixAdjacentSpaceExtra.innerHTML = FASE.getFixAdjacentSpaceExtra();

};
