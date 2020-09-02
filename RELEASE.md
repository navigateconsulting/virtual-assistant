# Release X.X.X

<INSERT SMALL BLURB ABOUT RELEASE FOCUS AREA AND POTENTIAL TOOLCHAIN CHANGES>

## Breaking Changes

* <DOCUMENT BREAKING CHANGES HERE>
* <THIS SECTION SHOULD CONTAIN API, ABI AND BEHAVIORAL BREAKING CHANGES>

## Known Caveats

* <CAVEATS REGARDING THE RELEASE (BUT NOT BREAKING CHANGES). E.G. ADDING A NEW DEPENDENCY, BUMPING A DEPENDENCY NUMBER, LACK OF SUPPORT ON SOME PLATFORM, ETC>

## Major Features and Improvements

* <INSERT MAJOR FEATURE HERE, USING MARKDOWN SYNTAX>
* <IF RELEASE CONTAINS MULTIPLE FEATURES FROM SAME AREA, GROUP THEM TOGETHER>

## Bug Fixes and Other Changes

* <SIMILAR TO ABOVE SECTION, BUT FOR OTHER IMPORTANT CHANGES / BUG FIXES>
* <IF A CHANGE CLOSES A GITHUB ISSUE, IT SHOULD BE DOCUMENTED HERE>
* <NOTES SHOULD BE GROUPED PER AREA>


# Release Candidate 

Bug fixes
    
## Major Features and Improvements

* [223](https://github.com/navigateconsulting/eva/pull/223) Added authentication for mongo, and redis containers<br/>
Lazy loading for conversations API and UI<br/>
Changes In Routes (Separate for each component eg: Actions, Conversations, Projects, etc.)<br/>
CSS Tweaks in Conversations Chat Components
Added Entity Display feature respective to the intent selected in the chat

## Bug Fixes and Other Changes

* [213](https://github.com/navigateconsulting/eva/pull/213) Updated documentation
* [214](https://github.com/navigateconsulting/eva/pull/214) Spinner was continously spinning in loop even after the training had completed and getting the completed status in the front end.
* [215](https://github.com/navigateconsulting/eva/pull/215) npm dependancy in package.json file upgraded from 6.13.4 to 6.14.6
* [216](https://github.com/navigateconsulting/eva/pull/216) and [217](https://github.com/navigateconsulting/eva/pull/217) loadash dependancy in package.json file upgraded from 4.17.15 to 4.17.19
* [218](https://github.com/navigateconsulting/eva/pull/218) and [219](https://github.com/navigateconsulting/eva/pull/219) changes in populating default actions for projects
* [220](https://github.com/navigateconsulting/eva/pull/220) elliptic dependancy in package-lock.json upgraded from 6.5.2 to 6.5.3.
* [221](https://github.com/navigateconsulting/eva/pull/221) removed Credentials yml file from rasa container, presence of this caused rasa to assume channels are used. 
* [222](https://github.com/navigateconsulting/eva/pull/222) Sorted Conversations in descending order with respect to timestamp of comversation date and added Full Date on the right side panel in try now page 

# Release 2.0.3

Bug fixes
    
## Major Features and Improvements

* [209](https://github.com/navigateconsulting/eva/pull/209) Rasa version upgrade to 1.10.3

## Bug Fixes and Other Changes

* [207](https://github.com/navigateconsulting/eva/pull/207) changes to UI
* [210](https://github.com/navigateconsulting/eva/pull/210) Spinner issue on Manage Project Page has now been resolved, earlier there was a delay in showing the spinner. Conversations Chat was not displaying the slot values earlier, now the issue is fixed.
* [211](https://github.com/navigateconsulting/eva/pull/211) Displaying Conversations In Descending Order so that the latest conversation would be displayed first in the list.
