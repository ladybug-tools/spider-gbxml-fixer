<!--
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-fixer/#../README.md "View file as a web page." ) </span>

<div><input type=button class = "btn btn-secondary btn-sm" onclick=window.location.href="https://github.com/ladybug-tools/spider-gbxml-fixer/"
value="You are now in a GitHub web page view - Click this button to view this read me file as source code" ></div>
-->

# [Spider gbXML Fixer 'Atrax' Read Me]( #../README.md )

_JavaScript utilities to help you identify and fix common errors in [gbXML]( http://gbxml.org ) files_

<!--
<iframe src=https://www.ladybug.tools/spider-gbxml-fixer/spider-gbxml-fixer.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Fixer</small>_
-->


<a title="By Tirin at the English language Wikipedia, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=128531"
href="https://en.wikipedia.org/wiki/Sydney_funnel-web_spider">
<img width="256" alt="Sydney funnel-web spider" src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Atrax_robustus.jpg" ><br>
<i>Atrax robustus</i></a> - 'Atrax' is the code name for this release of the Ladybug Tools / Spider gbXML Fixer



### Bookmark this link for the stable release:<br>[https://www.ladybug.tools/spider-gbxml-fixer/]( https://www.ladybug.tools/spider-gbxml-fixer/ "Always links to the release that has been tested" )

<!--
### Bookmark this link for latest release:<br>https://www.ladybug.tools/spider-gbxml-fixer/dev/

* Always links to the version currently being worked on
* Loads and checks a sample file from the [Spider gbXML sample files]( https://www.ladybug.tools/spider/#gbxml-sample-files/README.md ) folder
-->

<details>

<summary class=sumHeader title="How can we help you?" >Features and Benefits</summary>

Spider gbXML Fixer enables you to:

* Access online and local gbXML files via URL, file ope dialog box and drag&drop
* Run an extensive set of checks - with most checks also providing automated fixes
* Save fixed models as .XML or .ZIP files

The following are the checks and fixes currently implemented:

* Inspect files in real-time 3D
* Check for valid text and numbers
* Check project offset distance from origin
* Check for openings with more than four vertices
* Fix missing required gbXML attributes
* Fix surfaces with invalid surface type name
* Fix surfaces with invalid ExposedToSun
* Fix surfaces with duplicate planar coordinates
* Fix surfaces with an extra adjacent space
* Fix surfaces with duplicate adjacent spaces
* Fix air surfaces with single adjacent space
* Fix Surfaces with CAD object ID missing

Using the Fixer should be much easier than doing searching for and replacing text in a gbXML file and should be faster than using the Spider Viewers.

</details>

<details>

<summary class=sumHeader title="Includes our mission and vision statements" >Concept / the problem to be solved</summary>

[GbXML]( http://www.gbxml.org/About_GreenBuildingXML_gbXML ) data files follow an industry-standard format and used to the transfer 3D building project data between computer aided design (CAD) program and energy analysis programs. The good people who create CAD and energy analysis applications are primarily software programmers. They have infrequent access to large numbers of actual building test cases nor can they simulate large varieties of practice-specific energy simulation workflows. The current often-repeated outcome is that building engineering practices devote much time to dealing with issues in transferring data back and forth between CAD applications and energy analysis programs - and thus losing time for creating better simulations.

Many of the issues to be found in parsing gbXML files are clerical matters that may be identified using simple text search and replace routines. Full 3D viewing of these types of errors is not needed and may actually slow things down.

The desired solution is a utility that enables seamless gbXML data transfer between applications without human intervention.

### Mission for Spider gbXML Fixer / currently

* Run basic text-based checks on gbXML files and uncover, identify, report and fix any errors or issues
* Help you access, edit and improve scripts that are customized for your needs and work well in your practice, your workflow and your skill set so that your projects are designed and built faster, cheaper and better

### Vision / future

* All errors are fixed and changes are saved with the click of a single button or just running the script on a server


### Notes

* Not all issues in gbXML files are simple, text-based issues. Some issues will require full a 3D visualization in order to be discovered and fixed. An intention is to make the workflow between a text-based fixer and full 3D fixer as seamless as possible.
* If you identify a frequently occurring error in gbXML files and supply sample files that exhibit the error, the Spider team will be pleased to build a an open-source module that identifies and fixes your issues
* Currently 'Atrax' links to scripts from TooToo14 and 'Maevia'. As and when this script matures, these dependencies may be eliminated
* The script is still at an early stage. Many more checks may be added. The user interface needs streamlining. And so on

</details>


<details>

<summary class=sumHeader title="How to use Atrax" >Instructions / usage / things you can do</summary>

#### Overview of the Spider menu system

* The left menu is composed of several panels that resemble the drop-down menus in desktop programs. The panels are 'File', 'Settings' and 'Help'. The 'Edit' menu in Fixer is the main content window
* Every menu panel has its own JavaScript file or files that includes help and other useful information in a pop-up window
* Click on any of the '?' links to see the pop-up window at top right - each with:
	* Short description of the module
	* Link to source code for the module
	* Wish list / to do items
	* Issues list- bugs we know about
	* Change log - see what's new
* Click the three bars( 'hamburger menu icon' ) to slide the menu in and out
	* Useful feature on a tablet or phone
* Click the Octocat icon to view or edit the source code on GitHub
* Click on title in the left menu to reload the web page
	* Reloads the data file if the source is a URL


#### File Menu - Opening files and saving changes

* 'Open gbXML sample files' - click to access the Spider gbXML sample files
	* Then click any of the buttons to to view a list of files you can open
	* Click a file title to load it
* 'Open gbXML or ZIP file' - click 'Choose file' and load a gbXML files or a ZIP file containing a gbXML file
	* Drag & drop a gbXML or ZIP file to the area inside the dotted lines in the left menu
* 'Save file' - Click on to save any changes you have made to a new file
	* You may save the changes either to an XML file or an XML file compressed into a ZIP file


#### Edit menu

* Checking and fixing errors in main content area
* Once a file is opened a menu appears in the main content area that allows you to identify and fix any issues found in the file
* Clicking any of the titles displays the text and runs the checking routines
	* Click 'Run all checks' to open all the modules' text and run all the checks. This may take quite a while on large files
* There are a numbers of types of errors to be check and needs its own style of user interface
	* Streamlining amd homogenizing the workflows of the modules is a work-in-progress. Please do report issues and insights
* In some workflows an Air surface type with duplicate adjacent spaces is acceptable. You may adjust the settings so an error is not issued.


#### Settings menu

* 2019-05-09 ~ Not yet implemented here
* Click on 'Select Theme and choose a [Bootswatch]( https://bootswatch.com/ ) theme such as 'United'


#### Help menu

* Click to see the links to many support files


#### Debugging

* Press Control-U/Command-Option-U to view the source code
* Press Control-Shift-J/Command-Option-J to see if the JavaScript console reports any errors

#### Enhancing the script

* Try adding a new menu module
* Translate into another language

</details>


<details>

<summary class=sumHeader title="What you you really want?" >To Do / Wish List</summary>

* 2019-05-18 ~ Add module to compare surfaces coordinates with coordinates in spaces
* 2019-05-10 ~ Add fix for interior surfaces with single adjacent space
* 2019-04-03 ~ Identify surface edges with multiple vertices where two are sufficient
* 2019-03-12 ~ Add check for openings larger or outside their parent surface

</details>


<details>

<summary class=sumHeader title="Bugs we know about already" >Issues</summary>

* 2019-05-10 ~ Opening a ZIP file with the dialog does not work

</details>

<details>

<summary class=sumHeader title="The back story on things"  >Links of Interest</summary>

### _Atrax robustus_

* https://en.wikipedia.org/wiki/Sydney_funnel-web_spider

> The Sydney funnel-web spider (Atrax robustus) is a species of venomous mygalomorph spider native to eastern Australia, usually found within a 100 km (62 mi) radius of Sydney. It is a member of a group of spiders known as Australian funnel-web spiders. Its bite is capable of causing serious illness or death in humans if left untreated.

</details>


<details>

<summary class=sumHeader title="Read about what's new here"  >Change Log</summary>

### Commit message prefixes

From [The case for single character git commit message prefixes]( https://smalldata.tech/blog/2018/10/04/the-case-for-single-character-git-commit-message-prefixes ):

* B, indicates a bugfix.
* F, indicates a feature or a change - this will most likely be the majority of the commits.
* a, code formatting change.
* c, comments and or documentation.
* D, dependency updates.
* R, code refactoring, note that this is different from r below.
* r, proven code refactoring - this is the original meaning of the mathematical term refactoring, where it can be mathematically proven that the code change does not change any functionality.
* T, test cases and/or test improvements
* !, unknown - i.e. for when you really need to make that commit because there's a horde of zombies waiting outside.

Additions ??

* S, changes to CSS

### Semantic Versioning

* https://semver.org/
* https://en.wikipedia.org/wiki/Software_versioning
* https://medium.com/@jameshamann/a-brief-guide-to-semantic-versioning-c6055d87c90e
* https://docs.npmjs.com/about-semantic-versioning
* https://gist.github.com/jashkenas/cbd2b088e20279ae2c8e
	* Many interesting comments to a short gist


### 2019-05-13 ~ Theo

Spider gbXML Fixer 'Atrax' R0.4.9

* Add Michal's pull request
* Add Get Surface Statistics module
* See also commit messages

### 2019-05-10 ~ Theo

Spider gbXML Fixer 'Atrax' R0.4.7

* See also commit messages

### 2019-05-06 ~ Theo

Spider gbXML Fixer 'Atrax' R0.4.1

* B - Add working "pittsburg airport.zip" demo

### 2019-04-26 ~ Theo

Spider gbXML Fixer 'Atrax' R0.4.0

* Rename to semver system
* All modules beginning to work as expected


### 2019-04-18 ~ Theo

Spider gbXML Fixer 'Atrax' R3.3.0

* F - FDPC: 'Fix all' working / waiting for testing
* F - FCIM: 'Fix all' working / waiting for testing
* F - FXA: streamlined the operation / automated 'add missing attributes' / waiting for testing

### 2019-04-15 ~ Theo

Spider gbXML Fixer 'Atrax' R3.1.1

* Add link to Maevia
* Continuing work on modules

### 2019-04-09 ~ Theo

Spider gbXML Fixer 'Atrax' R3.1.0

Fix Surface Type Invalid (FXSTI)
* F - Display the reasoning behind each issue that is identified
* B ~ Fixed issues with saving data to files
* R ~ Refactor

Fix Surfaces Exposed To Sun I(FETS)
* B ~ Fixed issues with saving data to files
* R ~ Refactor

plus other minor fixes

### 2019-04-09 ~ Theo

Spider gbXML Fixer 'Atrax' R3.0.0
* F - Add 'dev' folder with index file redirecting to r3
* F - First commit R3 dev release
* T - Add cookbook folder
* T - Add 'ft-template' folder with template files
* T - Add 'fets-fix-exposed-to-sun' folder with files


### 2019-04-08 ~ Theo

#### GH Release [Spider gbXML Fixer 'Atrax' R2.2.3]( https://github.com/ladybug-tools/spider-gbxml-fixer/releases/tag/v2.2.3 )

* F - Initial fork to spider-gbxml-repo
* D - Cookbook folders moved to R3 folder( dev release )
* B - Update many links
* D - Edit and add text to read me as per @mechSpecs' guidance

### 2019-04-04 ~ Theo

Spider gbXML Fixer 'Atrax' R2.1.0

* D - To js-tootoo13-2/mnu-menu.js/sfm-selected-files-markdown.js / checked other dependencies are OK


### 2019-04-03 ~ Theo

Spider gbXML Fixer 'Atrax' R2.0.0

* All modules refactored / see dev-notes.md
* Add module 'ocv-openings-check-vertices.js' / check openings with more than four vertices

### 2019-04-02 ~ Theo

[Spider gbXML Fixer 'Atrax' R1.7]( https://www.ladybug.tools/spider-gbxml-fixer/r1/spider-gbxml-fixer.html )
* B - Validate HTML with  https://validator.w3.org/nu / Fix all errors reported
* D - Update this read me a lot

_See also changes listed in individual JavaScript files_

### 2019-03-25 ~ Theo

Spider gbXML Fixer 'Atrax' R1.6

_See changes in individual JavaScript files_

 * Many / See pop-up help for individual checks
 * Runs just about every sample file without errors

### 2019-03-25 ~ Theo

Spider gbXML Fixer 'Atrax' R1.5

_Changes in JavaScript files_

 * Many / See pop-ups

### 2019-03-25 ~ Theo

Spider gbXML Fixer 'Atrax' R1.4

* C ~ Add 'Atrax' to menu title / Update rev and date / Update readme ~ add Commit message prefixes

_Changes in JavaScript files_
* Many / See pop-ups



### 2019-03-23 ~ Theo

Spider gbXML Fixer 'Atrax' R1.3

* Add code name: 'Atrax'


### 2019-03-22 ~ Theo

spider-gbxml-fixer.html/.js R1.2
* Almost complete rewrite
* Fast
* Uses HTML template element - my first use of

### 2019-03-19 ~ Theo

spider-gbxml-fixer.html/.js R1.0

* First commit

</details>

***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > <img src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" height=24 > </a></center>

