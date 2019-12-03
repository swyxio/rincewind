# rincewind

Rincewind: Create React Apps with Parcel + React + PostCSS (with Tailwind) + TypeScript

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/rincewind.svg)](https://npmjs.org/package/rincewind)
[![CircleCI](https://circleci.com/gh/sw-yx/rincewind/tree/master.svg?style=shield)](https://circleci.com/gh/sw-yx/rincewind/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/rincewind.svg)](https://npmjs.org/package/rincewind)
[![License](https://img.shields.io/npm/l/rincewind.svg)](https://github.com/sw-yx/rincewind/blob/master/package.json)
[![Netlify Status](https://api.netlify.com/api/v1/badges/88e02ab4-ab2c-4949-8dbe-1afb7f3b2ae6/deploy-status)](https://app.netlify.com/sites/rincewind/deploys)
[![https://www.netlify.com/img/deploy/button.svg](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sw-yx/rincewin-demo)

![https://humanitysdarkerside.files.wordpress.com/2012/07/rincewind-by-lindsay-c-walker-2.jpg?w=217&h=278](https://humanitysdarkerside.files.wordpress.com/2012/07/rincewind-by-lindsay-c-walker-2.jpg?w=217&h=278)

## Usage

```sh-session
$ npm install -g rincewind
$ rincewind # or rw
```

By default it creates the new app in a directory called `rincewind-app`. If you want to specify the folder name, add an extra arg: `rw create myapp`

Once you have a scaffolded app, `cd` into the project and then either run:

- `rw build` for a production build
- `rw serve` for local development. (aliases for this: `rw dev` or `rw develop`)

`rw` is just an alias for `rincewind`, you can use `rw` interchangeably everywhere except with npx

Enjoy!

## Commands

### `rincewind create`

_Aliases: `rw create`_

Creates a Rincewind app. Only basic template available for now. You can pass an arg or a `-d` flag to specify the name of the directory it creates.

```sh-session
$ npm install -g rincewind
$ rincewind # or rw
```

These all also do the same thing

- `npx rincewind` creates a rincewind app without install
- `rw init`
- `rw create`
- `rw init myapp`
- `rw create myapp`
- `rw init -d myapp`
- `rw create -d myapp`

### `rincewind serve`

_Aliases: `rw dev`, `rw develop`_

Locally serve a rincewind app for development.

```sh-session
rincewind serve
```

These all also do the same thing

- `rw serve`
- `rw dev`
- `rw develop`

### `rincewind build`

_Aliases: `rw build`_

Build a Rincewind app for production.

```sh-session
rincewind build
```

These all also do the same thing

- `rw build`

## Roadmap

- add basic design system to draw from
- other templates to scaffold from including your own
- caching the node modules so you copy paste
- module/nomodule
- preact aliasing
- react single file components
- other ideas from Proxx: https://www.youtube.com/watch?v=fWc3Zu6A3Ws
- ???
- Give me your ideas! https://twitter.com/swyx

## Name and History

v0-v2 of this package was a different project, run by https://github.com/mmckegg over from 2013-2016

https://github.com/mmckegg kindly handed this project over to swyx in Nov 2019, because of his deep love of Terry Pratchett's Discworld series and [its bumbling Wizzard](https://en.wikipedia.org/wiki/Rincewind).
