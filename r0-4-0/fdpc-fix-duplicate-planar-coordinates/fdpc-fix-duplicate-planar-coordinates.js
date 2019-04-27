
// Copyright 2019 Ladybug Tools authors. MIT License
/* globals GBX, GSA, FDPCsumDuplicatePlanar, FDPCdivDuplData, FDPCdivGetDuplicatePlanar, FDPCdet */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const FDPC = { "release": "0.4.0", "date": "2019-04-23" };

FDPC.description = `Identify two or more surfaces with the same planar geometry coordinates`;

FDPC.currentStatus =
	`
		<h3>Fix Surfaces with duplicate planar coordinates (FDPC) R${ FDPC.release } ~ ${ FDPC.date }</h3>

		<p>
			${ FDPC.description }.
		</p>

		<details>
			<summary>Issues</summary>
			<ul>
			</ul>
		</details>

		<details>
			<summary>Wish List / To do</summary>
			<ul>
				<li>2019-03-29 ~ Check for openings</li>
				<li>2019-03-25 ~ Add select and update multiple surfaces at once</li>
				<li>2019-03-19 ~ Pre-select the correct surface to delete n the select type list box</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>

			<ul>
				<li>2019-04-23 ~ First commit</li>
			</ul>
		</details>
	`;



FDPC.getFixDuplicatePlanarCoordinates = function() {

	const htm =
		`
			<details id=FDPCdet  ontoggle="FDPCdivDuplicatePlanar.innerHTML=FDPC.getDuplicatePlanarCoordinates();" >

				<summary id=FDPCsumDuplicatePlanar class=sumHeader >Fix surfaces with duplicate planar coordinates
					<a id=FDPCSum class=helpItem href="JavaScript:MNU.setPopupShowHide(FDPCSum,FDPC.currentStatus);" >&nbsp; ? &nbsp;</a>
				</summary>

				<div id=FDPCdivDuplicatePlanar ></div>

			</details>

		`;

	return htm;

};



FDPC.getDuplicatePlanarCoordinates = function() {

	const timeStart = performance.now();
	const planars = [];

	for ( let surface of GBX.surfaces ) {

		const planar = surface.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ );

		if ( planar ) { planars.push( planar[ 1 ] ); }

	}

	FDPC.duplicates = [];

	planars.forEach( ( planar1, index1 ) => {

		const planarsRemainder = planars.slice( index1 + 1 );

		planarsRemainder.forEach( ( planar2, index ) => {

			if ( planar1 === planar2 ) {

				const index2 = index1 + index + 1;
				FDPC.duplicates.push( [ index1, index2] );
			}

		} );

	} );
	//console.log( 'FDPC.duplicates', FDPC.duplicates );

	const options = FDPC.duplicates.map( ( arr, count ) => arr.map( index => {

		const surface = GBX.surfaces[ index ];
		return `<option value="${ arr.join() }" style=background-color:${ count % 2 === 0 ? "#eee" : "" };
			title="${ surface.match( / id="(.*?)"/i )[ 1 ] }" >
			${ count + 1 } ${ surface.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }
		</option>`;

		} )

	);
	//console.log( 'options', options );

	const help = `<a id=fdpcHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fdpcHelp,FDPC.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FDPCsumDuplicatePlanar.innerHTML =
		`Fix surfaces with duplicate planar coordinates ~ ${ FDPC.duplicates.length.toLocaleString() } found
			${ help }
		`;

	const htm =
	`
			<p><i>${ FDPC.description }</i></p>

			<p>
				${ FDPC.duplicates.length.toLocaleString() } sets duplicates found.  See tool tips for surface ID.<br>
			</p>

			<p>
				<select onclick=FDPC.setDuplicateData(this); style=min-width:8rem; size=${ FDPC.duplicates.length >= 5 &&  FDPC.duplicates.length <= 20 ? 2 * FDPC.duplicates.length : 10 } >${ options }</select>
			</p>

			<div id="FDPCdivDuplData" >Click a surface ID above to view its details and delete if necessary</div>

			<p><button onclick=FDPC.deleteDuplicateSurfaces(); >Fix all</button></p>

			<p>
				Click 'Save file' button in File Menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return htm;

};



FDPC.setDuplicateData = function( select ) {
	//console.log( '', select.selectedOptions );

	const items = select.value.split( ",");
	//console.log( '', items );

	const surfaceText1 = GBX.surfaces[ items[ 0 ] ];
	const id1 = surfaceText1.match( / id="(.*?)"/i )[ 1 ];

	const surfaceText2 = GBX.surfaces[ items[ 1 ] ];
	const id2 = surfaceText2.match( / id="(.*?)"/i )[ 1 ];

	//console.log( '', surfaceText1.length, surfaceText2.length );

	const htm =
		`
			${ GSA.getSurfacesAttributesByIndex( items[ 0 ], id1 ) }

			<p>
				Number of characters in surface text: ${ surfaceText1.length.toLocaleString() }
			</p>

			<p>
				<button onclick=FDPC.deleteSelectedSurface(${ items[ 0 ] }); >delete</button>

			</p>

			${ GSA.getSurfacesAttributesByIndex( items[ 1 ], id2) }

			<p>
				Number of characters in surface text: ${ surfaceText2.length.toLocaleString() }
			</p>

			<p>
				<button onclick=FDPC.deleteSelectedSurface(${ items[ 1 ] }); >Delete</button>
			</p>

			<hr>
		`;

	FDPCdivDuplData.innerHTML= htm;

	const details = FDPCdivDuplData.querySelectorAll( 'details' );
	details[ 1 ].open = true;
	details[ 5 ].open = true;

};



FDPC.deleteSelectedSurface = function( index ) {
	//console.log( 'select.value', select );

	const result = confirm( `OK to delete surface?` );

	if ( result === false ) { return; }

	const surfaceText = GBX.surfaces[ index ];

	GBX.text = GBX.text.replace( surfaceText, '' );
	//console.log( 'len2', GBX.text.length );

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'GBX.surfaces', GBX.surfaces.length );

	FDPCdet.open = false;

	FDPCdivGetDuplicatePlanar.innerHTML = FDPC.getFixDuplicatePlanarCoordinates();

};



FDPC.deleteDuplicateSurfaces = function() {
	//console.log( 'select.value', select );

	//const result = confirm( `OK to delete second surface\nwhen both surfaces have exactly the same character count\nor second surface contains the word "duplicate"?` );

	//if ( result === false ) { return; }

	for ( let items of FDPC.duplicates ) {

		const surfaceText1 = GBX.surfaces[ items[ 0 ] ];
		const spaceRefs1 = surfaceText1.match( /spaceIdRef="(.*?)"/gi );
		const name = surfaceText1.match( /<name>(.*?)<\/name/i )[ 1 ];
		//console.log( 'spaceRefs1', spaceRefs1 );

		const surfaceText2 = GBX.surfaces[ items[ 1 ] ];

		if ( surfaceText1.length === surfaceText2.length || surfaceText2.includes( "duplicate" ) ) {

			GBX.text = GBX.text.replace( surfaceText2, '' );

		} else {

			for ( let ref of spaceRefs1 ) {

				const id = ref.match( /spaceIdRef="(.*?)"/i )[ 1 ];
				//console.log( 'id', id );
				const spaceText = GBX.spaces.find( space => space.includes( id ) );
				//console.log( 'spaceText', spaceText );
				const match = FDPC.compareCoordinates( items[ 0 ], spaceText );

				if ( !match ){

					console.log( 'no match id', id, name );

				}

			}


		}

	}

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'GBX.surfaces', GBX.surfaces.length );

	FDPCdet.open = false;

	FDPCdivGetDuplicatePlanar.innerHTML = FDPC.getFixDuplicatePlanarCoordinates();

};


FDPC.compareCoordinates = function( surfaceIndex, spaceText ) {
	//console.log( 'spaceIndex', spaceIndex );
	const planarSurface = GBX.surfaces[ surfaceIndex ].match( /<PlanarGeometry(.*?)<\/PlanarGeometry>/i );
	//console.log( 'planarSurface1', planarSurface1 );
	const coordinatesSurface = planarSurface[ 1 ].match( /<Coordinate>(.*?)<\/Coordinate>/gi );
	//console.log( 'coordinatesSurface', coordinatesSurface );

	//const planarGeo = spaceText.match( /<PlanarGeometry(.*?)<\/PlanarGeometry>/i )[ 1 ];
	const coordinatesSpace = spaceText.match( /<Coordinate>(.*?)<\/Coordinate>/gi );
	//console.log( 'coordinatesSpace', coordinatesSpace );

	let count = 0;

	for ( let coordinate of coordinatesSurface ) {

		if ( coordinatesSpace.includes( coordinate ) ) {

			//console.log( 'match', 23 );
			count ++;

		}

	}

	const match = ( count === coordinatesSurface.length ) ? true : false;
	//console.log( '', count, coordinatesSurface.length  );
	if ( !match ) { console.log( 'match', match, count, coordinatesSurface.length ); }

	if ( !match ) { console.log( 'coordinatesSurface', coordinatesSurface); }

	if ( !match ) { console.log( 'coordinatesSpace', coordinatesSpace); }
	return match;

};
