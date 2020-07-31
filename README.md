# Disclaimer:
Please check touch behaviour only on a real tablet. See below.

## Deployments

- [Version fixed by Hardfork](https://conquery.hardfork.io) (redeploys automatically on every commit to `master`)
- [Version prior to work by Hardfork](https://deliverable.conquery.hardfork.io) (redeploys automatically on every commit to `deliverable`)
- Staging deployments automatically for each PR, see PRs, check "netlify"

## Log of work by Hardfork
**Work to solve the challenge from the tender (Übungsaufgabe)**
- [#36](https://github.com/hardforkio/secret-conquery/pull/36): We implemented touch and hold to drag for the touch backend. As a result, we have intuitive drag and drop as well as scrolling with one finger on mobile devices. 
- [#40](https://github.com/hardforkio/secret-conquery/pull/40): We removed the `SplitPane` component and use a fixed layout depending on the orientation of the device. 
This provides a nice experience on e.g. iPad or other devices that rotate the view based on 
device orientation as well as on desktop when resizing the browser. The `SplitPane` component not only created
 issues for drag on touch-devices, in our opinion it also provided no benefit
  for the user: Better to provide the user with a nice interface than with 
  a funky interface with the possibility to somehow make the interface nice themselves.
- [#40](https://github.com/hardforkio/secret-conquery/pull/40): Following UX best practices, we rearranged the main components of the application i.e. we ordered components from top left to bottom right in order of their importance for the user, making sure that the main interactive components always stay in central view.
 To that effect, the query-editor as the main interactive component is now the top central resp. leftmost component in portrait resp. landscape view, followed by the list of concepts/queries/forms and the additional info component.
- [#42](https://github.com/hardforkio/secret-conquery/pull/42): We gave the info component a fixed place in the layout and consequently removed the functionality to collapse it.
- [#46](https://github.com/hardforkio/secret-conquery/pull/46): We made the top bar (with the database selector) responsive to be usable on mobile devices. Unimportant content is simply removed on smaller screens.
- [#37](https://github.com/hardforkio/secret-conquery/pull/37), [#44](https://github.com/hardforkio/secret-conquery/pull/44): We use [bootstrap](https://getbootstrap.com/) classes to easily achieve responsiveness and also use the utility classes for spacing etc. With these it is possible to [reduce the complexity of the code](https://github.com/hardforkio/secret-conquery/pull/40/files#diff-7c4bb318ecd1764c6481f6fc6977a36d). Bootstrap is also easily themable without the need to ever mention or use the theme in the code base. White labeling the result will be quite easy. 
- [#43](https://github.com/hardforkio/secret-conquery/pull/43), [#45](https://github.com/hardforkio/secret-conquery/pull/45), and others: We do not see emotionjs as a beneficial technology over using a well established, responsive CSS-framework like bootstrap and if need be the usage of scss modules. We took the liberty to implement our styling differently and
not using emotionjs and also remove / change some styles done with emotionjs. The result partially will look different, but as there was no apparent style guide and some choices for spacing and font size were wasting precious space on the smaller mobile devices we think that these style changes are not problematic for the user.

## Known issues

- Currently, the app is near to unusable on devices smaller than tablets. In our current opinion there is no way to fix this while preserving the "drag and drop" UX. For these small devices a new UX has to be designed (e.g. working with step by step processes over multiple pages). We consider this to be out of
 scope for the challenge and reduced our QA to devices with the lowest resolution of 768px. Also we do not see users 
 analyze large datasets of public health insurers on their mobile phones. Looks like a privacy issue to us.
- The app (especially drag and drop) does not work in the "tablet emulation" in Chrome. That is in order. It works on the actual mobile device. **You have to test it with a real device.** In our opinion it is not in order to create more code and weird workarounds to make these previews work more nicely. The touch emulation in Chrome on desktop is simply broken.
- The ratio between the editor pane and the tools pane might be worth discussing. Currently, it is 70/30 in landscape and 60/40 in portrait. If one wants a different ratio, this can be set to other values quickly in future iterations. Same holds of other ratios. 

**Work done to prepare the codebase and enable productive software development**
- [#2](https://github.com/hardforkio/secret-conquery/pull/2), [#4](https://github.com/hardforkio/secret-conquery/pull/4), [#35](https://github.com/hardforkio/secret-conquery/pull/35): We added CI to enforce our very strict linting rules, passing of tests and error free compilage of the
 TypeScript code. All for the sake of higher code quality (which now will stay high because CI).
- [#10](https://github.com/hardforkio/secret-conquery/pull/10), [#13](https://github.com/hardforkio/secret-conquery/pull/13): We added `prettier`
 with `eslint-plugin-prettier` to the project to enforce consistent code formatting automatically. This speeds up development cycles (no more manual indention) and eliminates the annoying white-space and format changes in PRs. More focus on the actual changes! 
- [#14](https://github.com/hardforkio/secret-conquery/pull/14): We silenced all existing 
(prior to our work) TypeScript errors with `//@ts-ignore`. Actually fixing these errors is out
 of scope of the task at hand, but we need TypeScript to work correctly to catch and
  fix our own errors during our work on the codebase. Now we can block a PR from being merged
  if a new error comes up due to our code changes.
- [#29](https://github.com/hardforkio/secret-conquery/pull/29), [#41](https://github.com/hardforkio/secret-conquery/pull/41): We added CD to deploy not only an always [up do date version](conquery.hardfork.io)
 of the app 
but also to get [staging deployments for each pull request](https://deploy-preview-49--hardfork-conquery.netlify.app/). This is on order for others to check the acceptance criteria for a PR and do QA without having to
 checkout and build locally. It also enables non-technical personel to verify and approve work in a larger team.
- [#22](https://github.com/hardforkio/secret-conquery/pull/22): We added a Storybook to be able to work on components in isolation to speed up development cycle and ease debugging. Obviously we added [CD](https://storybook.conquery.hardfork.io) for this storybook. A staging deployment of this storybook will also happen for each PR. As this was not part of the challenge we only some simple stories that we had a use for.

# Conquery
*fast & efficient analysis*

[![Last Release](https://img.shields.io/github/release-date/bakdata/conquery.svg?logo=github)](https://github.com/bakdata/conquery/releases/latest)
[![Build Status](https://dev.azure.com/bakdata/public/_apis/build/status/Conquery%20CI?branchName=develop)](https://dev.azure.com/bakdata/public/_build/latest?definitionId=7&branchName=develop)
[![CodeFactor](https://www.codefactor.io/repository/github/bakdata/conquery/badge/develop)](https://www.codefactor.io/repository/github/bakdata/conquery)
![Heroku](https://heroku-badge.herokuapp.com/?app=conquery&svg=1)
![Code Size](https://img.shields.io/github/languages/code-size/bakdata/conquery.svg)
[![License](https://img.shields.io/github/license/bakdata/conquery.svg)](https://github.com/bakdata/conquery/blob/develop/LICENSE)

[Live-Demo](https://conquery.herokuapp.com/app/static) 

![conquery Screenshot](images/screenshot-v3.png)

Conquery is a powerful web-based tool to compose and execute queries against large event-like data sets.

Event data sets typically associate events with a certain subject (i.e. a person or a physical object). One common use case for the data is to identify groups of similar subjects based on the assumption that they share similar events in a given time frame.

Conquery supplies a powerful interface to group event types in a hierarchical *concept tree* structure. Elements of this tree represent a group of similar subjects. Those subjects can be composed into a powerful query that runs against the data set.

## Starting the demo

This repository includes the Conquery frontend along with a non-functional backend. It provides a set of example concept trees to demonstrate the capabilities of the UI: The example's use case is to search for groups of actors who appeared in movies of the same genre or received the same award.

The demo can be started using the following commands, provided that node.js (version 8.x LTS) and yarn are already installed:

```sh
cd frontend/
yarn install
yarn start
```

## Acknowledgements

This platform was created by [InGef – Institut für angewandte Gesundheitsforschung Berlin GmbH](http://www.ingef.de/) in cooperation with [bakdata GmbH](http://www.bakdata.com) and [Kai Rollmann](https://kairollmann.de/).

[<img alt="InGef – Institut für angewandte Gesundheitsforschung Berlin GmbH" src="images/ingef_logo.svg" height=50 align="top">](http://www.ingef.de/)
&emsp;
[<img alt="bakdata GmbH" src="images/bakdata_logo.svg" height=37 align="top">](http://www.bakdata.com)
&emsp;
[<img alt="Rollmann Software" src="images/rollmann_software_logo.png" height=41 align="top">](https://kairollmann.de)
