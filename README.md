# General-react-dash-template

## Table of contents

1. [Test server](#test-server)
2. [Features](#features)
3. [Dependencies](#dependencies)
4. [Prerequisites](#prerequisites)
5. [Install and Use](#install-and-use)
6. [Folder Structure](#folder-structure)
7. [Backend lists Diagram](#backend-lists-diagram)

## Test server

- Domain: [http://test-preview-link](http://test-preview-link)
- Username: `test username`
- Password: `test password`

## Features

-

## Dependencies

The project is built with:

- `React.js` mainly
- `MUI` for styling
- `react-router-dom` for handling app route
- `React Hook Form` for handling forms
- `Yup` for adding a schema declaration and validation
- `Redux Toolkit` for managing app state
- `icons-material` for adding icons to the app
- `x-data-grid` for adding MUI table to the app
- `react-toastify` for showing messages to the user
- `Axios` for send requests
- `sp-rest-proxy` for connecting with SharePoint lists for development purposes
- `Vite` a JavaScript-based bundler

## Prerequisites

To use this project you should have the following on your machine:

- `Node.js` version 16.16.0
- `npm` version 8.11.0

## Install and Use

To install the project you have to:

1. Clone the repository:
   `git clone https://repo.git`

2. Install packages:
   `npm install`

3. Run the proxy server:
   `npm run proxy`

4. Add the generated proxy to local storage with the name:
   `ProxyURL`

5. Run the project:
   `npm run dev`

6. Open [http://127.0.0.1:5173](http://127.0.0.1:5173) with your browser to see the result.

## Folder Structure

The main folder structure of the code is structured like the following:

```js
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md //for documentation
├── server.js //for creating proxy server to connect with sharePoint
├── vite.config.js
|
├── public
├── sharePointConfig
|   └── private.json //for sharePointConfig (siteUrl, username, password, domain)
|
├── src
|   ├── App.jsx
|   ├── index.css //for general style
|   ├── main.jsx //the app root
|   |
|   ├── api //all needs to make a request for any api
|   |   ├── baseUrls.js //the different baseUrls
|   |   ├── constants.js //proxyUrl, requestHeaders
|   |   └── endPoints.js //all endPoints
|   |
|   ├── appState //app state using redux toolkit
|   |   ├── store.js
|   |   └── slices
|   |       ├── homeSlice.js
|   |       └── userSlice.js
|   |
|   ├── assets
|   ├── components
|   |   ├── about //for components using only on about page
|   |   ├── general //for components using in diffrent pages
|   |   ├── home
|   |   ├── layout
|   |   |   ├── aboutLayout //for components using on all about nested pages
|   |   |   └── rootLayout //for components using on all pages
|   |   |       ├── rootLayout.component.jsx
|   |   |       ├── rootLayout.module.css
|   |   |       |
|   |   |       ├── footer
|   |   |       |   ├── footer.component.jsx
|   |   |       |   └── footer.module.css
|   |   |       |
|   |   |       └── navbar
|   |   |           ├── navbar.component.jsx
|   |   |           └── navbar.module.css
|   |   |
|   ├── helpers
|   |   ├── customHooks
|   |   |   └── useGetCurrentUserQueryExtend.js //extend the default generated RTQ states
|   |   ├── utilities
|   |   |   ├── dynamicAxiosRequest.js
|   |   |   └── protectRoute.js
|   |   |
|   ├── pages
|   |   ├── about
|   |   |   ├── about.module.css
|   |   |   └── about.page.jsx
|   |   |
|   |   ├── home
|   |   |   ├── home.module.css
|   |   |   └── home.page.jsx
|   |   |
|   |   ├── notFound
|   |   |   ├── notFound.module.css
|   |   |   └── notFound.page.jsx
|   |   |
|   |   ├── serverError
|   |   |   ├── serverError.module.css
|   |   |   └── serverError.page.jsx
|   |   |
|   |   ├── unauthorized
|   |       ├── unauthorized.module.css
|   |       └── unauthorized.page.jsx
|   |
└── ├── router
    └── AppRoutes.jsx
```

## Backend lists Diagram
