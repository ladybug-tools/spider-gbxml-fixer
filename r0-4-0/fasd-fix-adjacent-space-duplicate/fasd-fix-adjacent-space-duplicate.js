// Copyright 2019 Ladybug Tools authors. MIT License
/* globals GBX, GBXinpIgnoreAirSurfaceType, FASDsumSpaceDuplicate,
	FASDdivAdjacentSpaceDuplicateData, FASDdivSpaceDuplicate, FASDdivCheckGbxml */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FASD = { "release": "1.2", "date": "2019-04-01" };


FASD.description = `Fix air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space`;

FASD.currentStatus =
	`
		<h3>Fix surface with adjacent space duplicates (FASD) R${ FASD.release } ~ ${ FASD.date }</h3>

		<p>
			${ FASD.description }.
		</p>

		<details>
			<summary>Wish List / To do</summary>
			<ul>
				<li>2019-03-19 ~ Pre-select the correct adjacent spaces in the select type list box</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-03 ~ First commit</li>
			</ul>
		</details>
	`;



FASD.getFixAdjacentSpaceDuplicate = function() {

	const htm =
		`
			<details ontoggle="FASDdivAdjacentSpaceDuplicate.innerHTML=FASD.getAdjacentSpaceDuplicate();" >

			<summary id=FASDsumAdjacentSpaceDuplicate class=sumHeader >Fix surfaces with duplicate adjacent spaces
				<a id=FASDSum class=helpItem href="JavaScript:MNU.setPopupShowHide(FASDSum,FASD.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>
				<div id=FASDdivAdjacentSpaceDuplicate ></div>

			</details>

		`;

	return htm;

};



FASD.getAdjacentSpaceDuplicate = function() {

	const timeStart = performance.now();
	const twoSpaces = [ "Air", "InteriorWall", "InteriorFloor", "Ceiling" ];
	let invalidAdjacentSpaceDuplicate = [];

	GBX.surfaces.forEach( ( surface, index ) => {

		const spaceIdRef = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( spaceIdRef && spaceIdRef.length && spaceIdRef[ 0 ] === spaceIdRef[ 1 ] ) {
			//console.log( 'spaceIdRef', spaceIdRef );

			const surfaceType = surface.match( /surfaceType="(.*?)"/i )[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			if ( twoSpaces.includes( surfaceType ) ) {

				invalidAdjacentSpaceDuplicate.push( index );

			}

		}

	} );
	//console.log( 'invalidAdjacentSpaceDuplicate', invalidAdjacentSpaceDuplicate );

	if ( GBXinpIgnoreAirSurfaceType.checked === true ) {

		invalidAdjacentSpaceDuplicate = invalidAdjacentSpaceDuplicate.filter( id => {

			const surfaceText = GBX.surfaces[ id ];
			//console.log( 'surfaceText', surfaceText );

			const surfaceType = surfaceText.match( /surfaceType="(.*?)"/)[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			return surfaceType !== "Air";

		}) ;

	}

	const help = `<a id=FASDHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(FASDHelp,FASD.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FASDsumAdjacentSpaceDuplicate.innerHTML =
	`Fix surfaces with duplicate adjacent spaces ~ ${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found ${ help }`;

	const options = invalidAdjacentSpaceDuplicate.map( index => {

		const surface = GBX.surfaces[ index ];
		//console.log( 'sf', surface );

		const id = surface.match( / id="(.*?)"/i )[ 1 ];
		//console.log( 'id', id );

		let name = surface.match( /<Name>(.*?)<\/Name>/gi );
		name = name? name.pop() : id;
		//console.log( 'name', name );

		return `<option value=${ index } title="${ id ? id[ 1 ] : 44 }" >${ name ? name : "no name" }</option>`;

	} );
	//console.log( 'options', options );

	const asdHtm =
		`
			<p><i>Air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space</i></p>

			${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found<br>

			<p>
				<select onclick=FASD.setSpaceDuplicateData(this); size=5 style=min-width:8rem; >${ options }</select>
			</p>

			<div id="FASDdivAdjacentSpaceDuplicateData" >Click a surface name above to view its details and update its adjacent spaces</div>

			<div id=FASDdivCheckGbxml ></div>

			<p>
				<button onclick=FASDdivSpaceDuplicate.innerHTML=FASD.getFixAdjacentSpaceDuplicate(); >Run check again</button>
			</p>

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;

	return asdHtm;

};



FASD.setSpaceDuplicateData = function( select ) {
	//console.log( 'iv', select.value );

	const surfaceText = GBX.surfaces[ select.value ];
	//console.log( 'surface', surface );

	const adjacentSpaces = surfaceText.match( /<AdjacentSpaceId (.*?)\/>/gi );
	//console.log( 'adjSpaces', adjSpaces );

	const spaceIds = adjacentSpaces.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );
	//console.log( 'spaceId', spaceId );

	const spaceText = GBX.spaces.find( item => item.includes( spaceIds[ 0 ] ) );
	//console.log( 'spaceText1', spaceText1 );
	const spaceName = spaceText.match( /<Name>(.*?)<\/Name>/i )[ 1 ];


	const options = GBX.spaces.map( (space, index ) => {

		const id = space.match( / id="(.*?)"/i )[ 1 ];

		const selected = id === spaceIds[ 0 ] ? "selected" : "";

		return `<option value=${ id } title="${ id }" ${ selected } >${ id } // ${ space.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }</option>`;

	} );
	//console.log( 'options', options );

	const htm = spaceIds.reduce( ( text, spaceId, index ) => text +
		`
			<p>
				spaceIdRef ${ index + 1 }: from <span class=attributeValue >${ spaceId } / ${ spaceName }</span> to
				<select id=FASDselSpaceIdNew${ index } >${ options }</select>
				<button onclick=FASD.adjacentSpaceUpdate(${ index },${ select.value }); value=${ index } >update reference</button>
			</p>
		`,
	"" );

	const attributes = GSA.getSurfacesAttributesByIndex( select.value, select.options[ select.selectedIndex ].innerText );

	FASDdivAdjacentSpaceDuplicateData.innerHTML =
		`
			${ attributes }

			${ htm }

			<p>
				<button onclick=FASD.showSurfaceGbxml(${ select.value }); >view gbXML text</button>
			</p>

		`;

		FASDdivAdjacentSpaceDuplicateData.querySelectorAll( "details" )[ 0 ].open = true;

};



FASD.adjacentSpaceUpdate = function( index, surfaceId ) {
	//console.log( 'index/id', index,  surfaceId );

	const spaceIdNew = document.body.querySelector( `#FASDselSpaceIdNew${ index }` ).value;
	//console.log( 'spaceIdNew', spaceIdNew );

	const surfaceTextCurrent = GBX.surfaces[ surfaceId ];

	const adjacentSpacesTextCurrent = surfaceTextCurrent.match( /<AdjacentSpaceId (.*?)\/>(.*?)<AdjacentSpaceId (.*?)\/>/ );

	const adjacentSpaces = surfaceTextCurrent.match( /<AdjacentSpaceId (.*?)\/>/gi );
	//console.log( 'adjacentSpaces', adjacentSpaces );

	let spaceIdCurrent = adjacentSpaces[ index ].match( /<AdjacentSpaceId spaceIdRef="(.*?)"(.*?)\/>/i );
	//console.log( 'spaceIdCurrent', spaceIdCurrent );
	spaceIdCurrent = spaceIdCurrent ? spaceIdCurrent[ 1 ] : spaceIdCurrent;

	const newText = adjacentSpaces[ index ].replace( spaceIdCurrent, spaceIdNew );

	adjacentSpaces[ index ] = newText;

	const adjacentSpacesTextNew = adjacentSpaces.join( adjacentSpacesTextCurrent[ 2 ] );
	//console.log( 'adjacentSpacesTextNew', adjacentSpacesTextNew );

	const surfaceTextNew = surfaceTextCurrent.replace( adjacentSpacesTextCurrent[ 0 ], adjacentSpacesTextNew );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	GBX.text =  GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FASDdivSpaceDuplicate.innerHTML = FASD.getFixAdjacentSpaceDuplicate();

};



FASD.showSurfaceGbxml = function( id ) {

	const surfaceText = GBX.surfaces[ id ];

	FASDdivCheckGbxml.innerText = surfaceText;

};
