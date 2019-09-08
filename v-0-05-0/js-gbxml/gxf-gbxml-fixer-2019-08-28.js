/* globals */
// jshint esversion: 6
// jshint loopfunc: true

//"use strict";

var GXF = {
	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-08-27",
		description: "Parse gbXML surfaces",
		helpFile: "../js-gbxml/gxf-gbxml-fixer.md",
		license: "MIT License",
		urlSourceCode: "../js-gbxml/gxf-gbxml-fixer.js",
		version: "0.05.00-1gxfx"
	}

};




GXF.init = function( target ) {

	//console.log( 'target', target );
	//change to custom event with data passing via event details??

	FOB.xhr.addEventListener( 'load', GXF.onXhrResponse, false );
	FOB.reader.addEventListener( 'load', GXF.onReaderResult, false );
	document.body.addEventListener( 'FOBonZipFileLoad', GXF.onFileZipLoad, false );
	document.body.addEventListener( 'onZipFileParse', GXF.onFileZipLoad, false );

	//document.body.addEventListener( 'onGbxParse', GXFU.onGbxParse, false );

	//GXF.messageDiv = target || "";

};



GXF.onXhrResponse = function( event ) { GXF.parseFile( event.target.response ); };

GXF.onReaderResult = function() { GXF.parseFile( FOB.reader.result ); };

GXF.onFileZipLoad = function() { GXF.parseFile( FOB.text ); };



GXF.parseFile = function( gbxml )  {

	if ( !gbxml || gbxml.includes( "xmlns" ) === false ) { return; }

	console.log( '', gbxml.length );

	GXF.gbxml = gbxml;

	//console.log( 'gbxml', gbxml );

	GXF.timeStart = performance.now();

	GXF.openings = GXF.gbxml.match( /<Opening(.*?)<\/Opening>/gis );

	if ( GXF.openings ) {

		GXF.openings.forEach( opening => {

			const openingType = opening.match( /openingType="(.*?)"/i );

			const idRef = opening.match( /windowTypeIdRef="(.*?)"/i );

			if ( !idRef ) {

				const txt = `${ openingType[ 0 ] } windowTypeIdRef="${ openingType[ 1 ] }"`;
				//console.log( 'txt', txt );

				const newOpening = opening.replace( openingType[ 0 ], txt );
				//console.log( 'newOpening', newOpening );

				GXF.gbxml = GXF.gbxml.replace( opening, newOpening );
				//console.log( 'surface', surface );
			}

		} );
	}



	GXF.surfaces = GXF.gbxml.match( /<Surface(.*?)<\/Surface>/gis );

	GXF.surfaces.forEach( surface => {

			const type = surface.match( /surfaceType="(.*?)"/i );

			if ( type !== "Air" && type !== "Shade") {

			const construction = surface.match( /constructionIdRef="(.*?)"/i );

			if ( !construction ) {

				//console.log( 'construction', construction );

				const txt = `${ type[ 0 ] } constructionIdRef="${ type[ 1 ] }"`

				//console.log( 'txt', txt );

				const newSurface = surface.replace( type[ 0 ], txt )

				GXF.gbxml = GXF.gbxml.replace( surface, newSurface );

			}

		}

	} );

	GXF.gbxml = GXF.gbxml.replace( /<\/Campus>/i, `</Campus> ${ constructions2 }` );

	GXF.gbxml = GXF.gbxml.replace( /encoding="UTF-16"/i, `encoding="UTF-8"` );


	divContents.innerHTML =
	`
		<p>${ GXF.gbxml.length } bytes</p>
		<p>Ready to save</p>
	`;

	FSB.sourceContents = GXF.gbxml;

	FSB.name = FOB.name;

};


constructions2 =

`

<Construction id="Ceiling">
<U-value unit="WPerSquareMeterK">0</U-value>
<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
<Roughness value="Rough" />
<LayerId layerIdRef="layer-InternalSide-ExternalSideground" />
<Name>Floor : SIM_EXT_GRD_FLR FLR01</Name>
</Construction>

<Construction id="ExteriorWall">
<U-value unit="WPerSquareMeterK">0</U-value>
<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
<Roughness value="Rough" />
<LayerId layerIdRef="layer-ExternalSideWall-InternalSide" />
<Name>Basic Wall : SIM_EXT_SLD</Name>
</Construction>

<Construction id="InteriorFloor">
<U-value unit="WPerSquareMeterK">0</U-value>
<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
<Roughness value="Rough" />
<LayerId layerIdRef="layer-InternalSide-ExternalSideground" />
<Name>Floor : SIM_EXT_GRD_FLR FLR01</Name>
</Construction>

<Construction id="InteriorWall">
<U-value unit="WPerSquareMeterK">0</U-value>
<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
<Roughness value="Rough" />
<LayerId layerIdRef="layer-CoreWall" />
<Name>Basic Wall : SIM_INT_SLD_Core</Name>
</Construction>

<Construction id="RaisedFloor">
<U-value unit="WPerSquareMeterK">0</U-value>
<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
<Roughness value="Rough" />
<LayerId layerIdRef="layer-InternalSide-ExternalSideground" />
<Name>Floor : SIM_EXT_GRD_FLR FLR01</Name>
</Construction>


<Construction id="Roof">
<U-value unit="WPerSquareMeterK">0</U-value>
<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
<Roughness value="Rough" />
<LayerId layerIdRef="layer-ExternalSideRoof-InternalSide" />
<Name>Basic Roof : SIM_EXT_SLD_Roof DA01</Name>
</Construction>


<Construction id="SlabOnGrade">
<U-value unit="WPerSquareMeterK">0</U-value>
<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
<Roughness value="Rough" />
<LayerId layerIdRef="layer-InternalSide-ExternalSideground" />
<Name>Floor : SIM_EXT_GRD_FLR FLR01</Name>
</Construction>



<Construction id="UndergroundSlab">
<U-value unit="WPerSquareMeterK">0</U-value>
<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
<Roughness value="Rough" />
<LayerId layerIdRef="layer-InternalSide-ExternalSideground" />
<Name>Floor : SIM_EXT_GRD_FLR FLR01</Name>
</Construction>


<Construction id="UndergroundWall">
<U-value unit="WPerSquareMeterK">0</U-value>
<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
<Roughness value="Rough" />
<LayerId layerIdRef="layer-ExternalSideWall-InternalSide" />
<Name>Basic Wall : SIM_EXT_SLD</Name>
</Construction>



<Layer id="layer-ExternalSideWall-InternalSide">
<MaterialId materialIdRef="material-ExternalSideWall" />
<MaterialId materialIdRef="material-InternalSide" />
</Layer>

<Layer id="layer-InternalSide-ExternalSideground">
<MaterialId materialIdRef="material-InternalSide" />
<MaterialId materialIdRef="material-ExternalSideground" />
</Layer>

<Layer id="layer-ExternalSideRoof-InternalSide">
<MaterialId materialIdRef="material-ExternalSideRoof" />
<MaterialId materialIdRef="material-InternalSide" />
</Layer>

<Layer id="layer-CoreWall">
<MaterialId materialIdRef="material-CoreWall" />
</Layer>

<Layer id="layer-InternalPartition">
<MaterialId materialIdRef="material-InternalPartition" />
</Layer>

<Material id="material-ExternalSideWall">
<Name>External Side Wall</Name>
<R-value unit="SquareMeterKPerW">0.134</R-value>
<Thickness>0.025</Thickness>
<Conductivity unit="WPerMeterK">0.187</Conductivity>
<Density unit="KgPerCubicM">290</Density>
<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-InternalSide">
<Name>Inernal Side</Name>
<R-value unit="SquareMeterKPerW">0.134</R-value>
<Thickness>0.025</Thickness>
<Conductivity unit="WPerMeterK">0.187</Conductivity>
<Density unit="KgPerCubicM">290</Density>
<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-ExternalSideground">
<Name>External Side(ground)</Name>
<R-value unit="SquareMeterKPerW">0.134</R-value>
<Thickness>0.025</Thickness>
<Conductivity unit="WPerMeterK">0.187</Conductivity>
<Density unit="KgPerCubicM">290</Density>
<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-ExternalSideRoof">
<Name>External Side Roof</Name>
<R-value unit="SquareMeterKPerW">0.134</R-value>
<Thickness>0.025</Thickness>
<Conductivity unit="WPerMeterK">0.187</Conductivity>
<Density unit="KgPerCubicM">290</Density>
<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-CoreWall">
<Name>Core Wall</Name>
<R-value unit="SquareMeterKPerW">0.267</R-value>
<Thickness>0.05</Thickness>
<Conductivity unit="WPerMeterK">0.187</Conductivity>
<Density unit="KgPerCubicM">290</Density>
<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-InternalPartition">
<Name>Internal Partition</Name>
<R-value unit="SquareMeterKPerW">0.267</R-value>
<Thickness>0.05</Thickness>
<Conductivity unit="WPerMeterK">0.187</Conductivity>
<Density unit="KgPerCubicM">290</Density>
<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>


<Zone id="ZoneID">
<AirChangesPerHour>0</AirChangesPerHour>
<OAFlowPerArea unit="LPerSecPerSquareM">0</OAFlowPerArea>
<OAFlowPerPerson unit="LPerSec">0</OAFlowPerPerson>
<DesignHeatT unit="C">0</DesignHeatT>
<DesignCoolT unit="C">0</DesignCoolT>
<TypeCode>0</TypeCode>
<Name>Zone</Name>
<CADObjectId>Unknown</CADObjectId>
</Zone>


<WindowType id="OperableWindow">
<Name>WinInst : SIM_EXT_GLZ</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
<Glaze id="glaze-e0a05">
  <Name />
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Solar" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
  <Emittance type="IntIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
<Gap id="GapIdentificationbbbec" gas="Argon">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
</Gap>
<Glaze id="GlazingIdentification423ab">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
</WindowType>


<WindowType id="OperableSkylight">
<Name>Skylight_ver00 : SIM_EXT_GLZ_SKY DF01</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
<Glaze id="glaze-295cf">
  <Name />
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Solar" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
  <Emittance type="IntIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
<Gap id="GapIdentificationd3e73" gas="Argon">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
</Gap>
<Glaze id="GlazingIdentification46ee2">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
</WindowType>

<WindowType id="NonSlidingDoor">
<Name>Doors_ver01 : SIM_INT_SLD</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
<Glaze id="glaze-83731">
  <Name />
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Solar" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntSolar" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Reflectance type="IntVisible" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
  <Emittance type="IntIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
<Gap id="GapIdentification622df" gas="Argon">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
</Gap>
<Glaze id="GlazingIdentificationc4103">
  <Name>Glazing</Name>
  <Description>Standard Dbl Glazed</Description>
  <Thickness unit="Meters">0</Thickness>
  <Conductivity unit="WPerMeterK">0</Conductivity>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
  <Reflectance type="ExtIR" unit="Fraction" surfaceType="Both">0</Reflectance>
  <Emittance type="ExtIR" unit="Fraction" surfaceType="Both">0</Emittance>
</Glaze>
</WindowType>

`;

/////////////////////////////////////////////////////

constructions =

`

<Construction id="Ceiling">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layerCeiling" />
	<Name>Ceiling</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="ExteriorWall">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Exterior Wall</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>


<Construction id="InteriorWall">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Interior Wall</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="RaisedFloor">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Raised Floor</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="Roof">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Roof</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="Shade">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Shade</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="SlabOnGrade">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Slab on Grade</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="UndergroundSlab">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Underground Slab</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="UndergroundWall">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Underground Wall</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>


<Construction id="FixedWindow">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Fixed Window</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="FixedSkylight">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Fixed Skylight</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="Operable Window">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Operable Window</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="OperableSkylight">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Operable Skylight</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="NonSlidingDoor">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Non Sliding Door</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>

<Construction id="SlidingDoor">
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<LayerId layerIdRef="layer" />
	<Name>Sliding Door</Name>
	<Roughness value="Rough" />
	<U-value unit="WPerSquareMeterK">0.999999</U-value>
</Construction>


<Layer id="layerCeiling">
	<MaterialId materialIdRef="aim2309" />
</Layer>

<Layer id="layer">
	<MaterialId materialIdRef="material" />
</Layer>

<Material id="material">
<Name>No insulation</Name>
<Description>No insulation</Description>
<R-value unit="SquareMeterKPerW">0.00001</R-value>
</Material>
`

