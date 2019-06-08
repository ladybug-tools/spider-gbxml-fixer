# gwv-get-watertight-vertices Read Me

[Source code]( https://github.com/ladybug-tools/spider-gbxml-fixer/tree/master/r0-4-0/gwv-get-watertight-vertices )

<details open>

<summary>Concept</summary>

1. Find all surfaces in gbXML file
2. Discard all Shade surfaces
3. Find all planar geometry in each surface
4. Discard planar geometry associated with openings
5. Find all coordinates in planar geometry
6. Identify all unique coordinates
7. Identify the number of instances or number of times used in model for each unique coordinate
8. If a coordinate is only used once then flag as issue

A typical external corner has three identical corner coordinates.

An two interior floors with continuous interior walls creates twelve identical corner coordinates.

The appearance of just two identical coordinates occurs from time to time. These may or may not be valid. A check for this condition is work to be done.

</details>

<details>

<summary>To Do / Wish List</summary>


</details>

<details>

<summary>Issues</summary>


</details>

<details>

<summary>Change Log</summary>

### 2019-06-07 ~ Theo


* F - GWV.js: First commit

</details>