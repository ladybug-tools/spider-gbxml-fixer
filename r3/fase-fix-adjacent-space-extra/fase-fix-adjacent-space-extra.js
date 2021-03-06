// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FASEselAdjacentSpaceExtra, FASEsumSpaceExtra, FASEdivSpaceExtraData, FASEdivSpaceExtra  */
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
			<details id=FASEdet ontoggle="FASEdivAdjacentSpaceExtra.innerHTML=FASE.getAdjacentSpaceExtra();" >

				<summary id=FASEsumAdjacentSpaceExtra class=sumHeader ><mark>Fix surfaces with an extra adjacent space</mark>
					<a id=FASESum class=helpItem href="JavaScript:MNU.setPopupShowHide(FASESum,FASE.currentStatus);" >&nbsp; ? &nbsp;</a>
				</summary>

				<div id=FASEdivAdjacentSpaceExtra ></div>

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

	const help = `<a id=faseHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(faseHelp,FASE.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FASEsumAdjacentSpaceExtra.innerHTML =
		`Fix surfaces with an extra adjacent space ~ ${ FASE.extras.length.toLocaleString() } found
			${ help }
		`;

	const faseHtm =
		`
			<p><i>Exterior surfaces that normally take a single adjacent space that are found to have two adjacent spaces.</i></p>

			<p>
				${ FASE.extras.length.toLocaleString() } surface(s) with extra spaces found. See tool tips for surface ID.
			</p>

			<p>
				<select id=FASEselAdjacentSpaceExtra onclick=FASE.setSpaceExtraData(this); size=5 style=min-width:8rem; >
					${ options }
				</select>
			</p>

			<p><button onclick=FASE.deleteAllSpacesExtra(); >Fix all</button></p>
			<div id="FASEdivSpaceExtraData" >Click a surface name above to view its details and delete extra space. Tool tip shows the ID of the surface.</div>


			<div id=FASEdivSelectedSurfaceGbXML ></div>

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return faseHtm;

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

	FASEdivSpaceExtraData.innerHTML = htm;

	const det = FASEdivSpaceExtraData.querySelectorAll( 'details');
	det[ 0 ].open = true;

};



FASE.adjacentSpaceDelete = function( index ) {

	extra = FASE.extras[ index ];
	//console.log( 'extra', extra );

	let surfaceTextCurrent = SGF.surfaces[ extra.index ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	if ( extra.surfaceType === "Shade" ) {

		//const result = confirm( `Surface type is "Shade".\nOK to delete all adjacent space references?` );

		//if ( result !== true ) { return; }

		const regex = new RegExp( `<AdjacentSpaceId(.*?)\/>`, "gi" );
		const matches = surfaceTextCurrent.match ( regex );
		//console.log( 'matches', matches );

		for ( match of matches ) {

			const surfaceTextNew = surfaceTextCurrent.replace( match, '' );
			//console.log( 'surfaceTextNew', surfaceTextNew );

			SGF.text = SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

			surfaceTextCurrent = surfaceTextNew;

		}

	} else if ( FASE.oneSpace.includes( extra.surfaceType ) ) {

		const matches = surfaceTextCurrent.match ( /spaceIdRef="(.*?)"/gi );
		//console.log( 'matches', matches );

		spaceIds = matches.map( match => match.match( /"(.*?)"/ )[ 1 ] );
		//console.log( 'spaceIds', spaceIds );

		keepers = [];
		let keeperNot;

		for ( spaceId of spaceIds ) { // check for actual space Ids

			for ( let space of SGF.spaces ) {

				if ( space.includes( spaceId ) === true ) {

					keepers.push( { spaceId, space } );
					break;

				}

			}

		}
		//console.log( 'keepers', keepers );

		if ( keepers.length === 1 ) { // found one id was wrong

			for ( spaceId of spaceIds ) {

				if ( keepers[ 0 ].spaceId !== spaceId ) { // this must be the bad one

					keeperNot = spaceId;

				}
			}

		} else {

			const keepers2 = [];

			for ( keeper of keepers ) {

				const planarSurface = surfaceTextCurrent.match( /<PlanarGeometry(.*?)<\/PlanarGeometry>/i );
				console.log( 'planarSurface', planarSurface );
				const coordinatesSurface = planarSurface[ 1 ].match( /<Coordinate>(.*?)<\/Coordinate>/gi );
				//console.log( 'coordinatesSurface', coordinatesSurface );

				const coordinatesSpace = keeper.space.match( /<Coordinate>(.*?)<\/Coordinate>/gi );
				//console.log( 'coordinatesSpace', coordinatesSpace );
				let matches2 = 0;

				for ( let coordinate of coordinatesSurface ) {

					if ( coordinatesSpace.includes( coordinate ) ) {

						//console.log( '', 23 );
						matches2 ++;

					}
				}
				//console.log( 'coordinatesSurface.length', coordinatesSurface.length );
				//console.log( 'matches2', matches2 );

				if ( matches2 === coordinatesSurface.length  ) {

					keepers2.push( keeper );

				}

			}
			//console.log( 'keepers2', keepers2 );

			for ( let keeper of keepers ) {

				if ( keepers2.includes( keeper.spaceId ) === false ) { // this must be the bad one

					keeperNot = keeper.spaceId;

				}

			}

		}
		//console.log( 'KeeperNot', keeperNot );

		const matches3 = surfaceTextCurrent.match ( /<AdjacentSpaceId(.*?)\/>/gi );
		//console.log( 'm3', matches3 );

		for ( let match of matches3 ) {

			if ( match.includes( keeperNot ) === true ) {
				const surfaceTextNew = surfaceTextCurrent.replace( match, '' );
				//console.log( 'surfaceTextNew', surfaceTextNew );

				SGF.text = SGF.text.replace( surfaceTextCurrent, surfaceTextNew );

			}

		}
	}

	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );

	FASEdet.open = false;

	FASEdivSpaceExtra.innerHTML = FASE.getFixAdjacentSpaceExtra();

};



FASE.deleteAllSpacesExtra = function() {

	FASE.extras.forEach( ( extra, index ) => {

		console.log( 'ind', extra.index );

		FASE.adjacentSpaceDelete( index );

	} );

}