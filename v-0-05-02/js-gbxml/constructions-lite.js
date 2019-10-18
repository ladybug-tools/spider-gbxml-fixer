
const constructionsLite =

`

<Construction id="Ceiling">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-ceiling" />
	<Name>Ceiling</Name>
</Construction>

	<Construction id="ExteriorWall">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-exterior-wall" />
	<Name>Exterior Wall</Name>
</Construction>

<Construction id="InteriorFloor">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-interior-floor" />
	<Name>Interior Floor</Name>
</Construction>

<Construction id="InteriorWall">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-interior-wall" />
	<Name>Interior Wall</Name>
</Construction>

<Construction id="RaisedFloor">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-raised-floor" />
	<Name>Raised Floor</Name>
</Construction>

<Construction id="Roof">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-roof" />
	<Name>Roof</Name>
</Construction>

<Construction id="SlabOnGrade">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-slab-on-grade" />
	<Name>Slab on Grade</Name>
</Construction>

<Construction id="UndergroundCeiling">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-underground-ceiling" />
	<Name>Underground Ceiling</Name>
</Construction>

<Construction id="UndergroundSlab">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-underground-slab" />
	<Name>Underground Slab</Name>
</Construction>

<Construction id="UndergroundWall">
	<U-value unit="WPerSquareMeterK">0</U-value>
	<Absorptance unit="Fraction" type="ExtIR">0</Absorptance>
	<Roughness value="Rough" />
	<LayerId layerIdRef="layer-underground-wall" />
	<Name>Underground Wall</Name>
</Construction>


<Layer id="layer-ceiling">
	<MaterialId materialIdRef="material-ceiling" />
</Layer>
<Layer id="layer-exterior-wall">
	<MaterialId materialIdRef="material-exterior-wall" />
</Layer>
<Layer id="layer-interior-floor">
	<MaterialId materialIdRef="material-interior-floor" />
</Layer>
<Layer id="layer-interior-wall">
	<MaterialId materialIdRef="material-interior-wall" />
</Layer>
<Layer id="layer-raised-floor">
	<MaterialId materialIdRef="material-raised-floor" />
</Layer>
<Layer id="layer-roof">
	<MaterialId materialIdRef="material-roof" />
</Layer>
<Layer id="layer-slab-on-grade">
	<MaterialId materialIdRef="material-slab-on-grade" />
</Layer>
<Layer id="layer-underground-ceiling">
	<MaterialId materialIdRef="material-underground-ceiling" />
</Layer>
<Layer id="layer-underground-slab">
	<MaterialId materialIdRef="material-underground-slab" />
</Layer>
<Layer id="layer-underground-wall">
	<MaterialId materialIdRef="material-underground-wall" />
</Layer>


<Material id="material-ceiling">
	<Name>Ceiling</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-exterior-wall">
	<Name>Exterior Wall</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-interior-floor">
	<Name>Interior Floor</Name>
	<R-value unit="SquareMeterKPerW">0.267</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-interior-wall">
	<Name>Interior Wall</Name>
	<R-value unit="SquareMeterKPerW">0.267</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-raised-floor">
	<Name>Raised Floor</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-roof">
	<Name>Roof</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-slab-on-grade">
	<Name>Slab on Grade</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-underground-ceiling">
	<Name>Ceiling</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-underground-slab">
	<Name>Underground Slab</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>

<Material id="material-underground-wall">
	<Name>Underground Wall</Name>
	<R-value unit="SquareMeterKPerW">0.134</R-value>
	<Thickness>0.05</Thickness>
	<Conductivity unit="WPerMeterK">0.187</Conductivity>
	<Density unit="KgPerCubicM">290</Density>
	<SpecificHeat unit="JPerKgK">14423.639958391</SpecificHeat>
</Material>


<WindowType id="Air">
<Name>Air</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>

</WindowType>

<WindowType id="FixedWindow">
<Name>WinInst : SIM_EXT_GLZ</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>

</WindowType>

<WindowType id="FixedSkylight">
<Name>Skylight_ver00 : SIM_EXT_GLZ_SKY DF01</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>

</WindowType>

<WindowType id="OperableWindow">
<Name>WinInst : SIM_EXT_GLZ</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>

</WindowType>


<WindowType id="OperableSkylight">
<Name>Skylight_ver00 : SIM_EXT_GLZ_SKY DF01</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>

</WindowType>

<WindowType id="NonSlidingDoor">
<Name>Doors_ver01 : SIM_INT_SLD</Name>
<Description>Standard Dbl Glazed</Description>
<U-value unit="WPerSquareMeterK">0</U-value>
<SolarHeatGainCoeff unit="Fraction">0</SolarHeatGainCoeff>
<Transmittance type="Visible" unit="Fraction" surfaceType="Both">0</Transmittance>
</WindowType>

`;
