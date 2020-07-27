## Log of work by Hardfork

- We silenced all TypeScript errors with @ts-ignore. Fixing these errors is out of scope of the task at hand but we need TypeScript to work correctly to catch and fix errors during our own work on the codebase. Now we can block a PR from being merged if a new error comes up due to our code changes.
- We added CI to enforce our very strict linting rules, passing of tests and error free compilage of the TypeScript code
- We added CD to deploy not only an always up do date version of the app under conquery.hardfork.io but also to get staging deployments for each pull request. This is on order for others to check the acceptance criteria for a PR without having to checkout and build locally.
- We added a Storybook to be able to work on components in isolation to speed up development cycle and ease debugging. Obviously we added CD for this storybook which can be found on storybook.conquery.hardfork.io. A staging deployment of this storybook will also happen for each PR.


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
