# iot_react_frontend
Frontend in ReactJS for a simple websocket based IoT platform. Implemented as part of the lab course IoT 2 - Aufbau eines Sensornetzwerks at TUM.

# Frontend
We are using facebook's preconfigured project to create a [ReactJS](https://reactjs.org/) frontend with focus on the code. Requirements for development:
- [Node](https://nodejs.org/en/) >= 6.0

## Component Hierarchy

In ReactJS you try to create minimal components which are then stacked together to a whole thing. That's why we try to separate as much code as we can to work independently on small reusable modules. In the following you see a tree which shows the component hierarchy of the Frontend.

Documentation of the [Components]() in detail

```
App
│    ToastContainer
│    (errors.js, highlight.js, ...)
│    (App.css, ...)
│    
└─── Router
    │
    └─── Dashboard
    │    │    
    |    └─── SensorView
    |         | 
    |         |    ValuePlot
    |         |    └─── Highlight
    |         |    Battery
    |         |    Boolean
    |         |    Wastebin
    |         |    SensorViewText
    |         |    SensorViewDateTimePicker
    |         |    SensorViewSelect
    |         |    SensorViewAlarm
    │ 
    └─── SensorList
    │    │   
    |    └─── Sensor
    |         | 
    |         └─── SensorMap
    │ 
    │ 
    └─── SensorTypeList
    │    │   
    |    └─── SensorType
    │ 
    └─── SensorListMap
    │    │   
    |    └─── SensorListMapView 
    |         | 
    |         |    Battery
    |         |    Boolean
    |         |    Wastebin
    │ 
    └─── Future Considerations*

```


## Commands
```
npm start
// also checks for changes of the filesystem by time
CHOKIDAR_USEPOLLING=true npm start
```
>  Runs the app in development mode.  
>  Open http://localhost:3000 to view it in the browser.

>  The page will automatically reload if you make changes to the code.  
>  You will see the build errors and lint warnings in the console.

```
npm test
``` 
>  Runs the test watcher in an interactive mode.  
>  By default, runs tests related to files changed since the last commit.

```
npm run build
```
>  Builds the app for production to the build folder.  
>  It correctly bundles React in production mode and optimizes the build for the best performance.

>  The build is minified and the filenames include the hashes.  
>  By default, it also includes a service worker so that your app loads from local cache on future >  visits.

```
npm run docs:build
```
Creates a html documentation in `./doc` of the frontend by going through each file in the `./src` folder and reading all JSDoc comments.  
For generating this documentation we use [DocumentationJS](https://github.com/documentationjs/documentation).

More details of the architecture can be found on [Facebook's Create React App](https://github.com/facebook/create-react-app)

## Dev Tools
I suggest using the following development tools to make ReactJS more understandable and development easier.

### React Developer Tools
[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) is an addon for the chrome browser which adds React debugging tools to the Chrome Developer Tools.

### React Sight
[React Sight](https://github.com/React-Sight/React-Sight) is a live view of the component hierarchy tree of your React application with support for React Router and Redux.

It is available as a [chrome addon](https://chrome.google.com/webstore/detail/react-sight/aalppolilappfakpmdfdkpppdnhpgifn).

### React Monocle
[React Monocle](https://github.com/team-gryff/react-monocle) is a developer tool for generating visual representations of your React app's component hierarchy. 

Doesn't work so far because of the issue [141](https://github.com/team-gryff/react-monocle/issues/141)

## Future Work
- **Reload components which are using the same resources or pass data through all related components.** 
We could use **React Redux** to handling a global state. Redux is a predictable state container for JavaScript apps. Components can subscribe to state variables and get directly rerendered if the global state changes. This would be very nice because then we don't need to pass all the data through different components.

- **Modals to verify delete method of items.** 
Here you can find a [live demo](https://getbootstrap.com/docs/4.1/components/modal/#live-demo).

- **Add authentication and user management.**
- **Fix all errors which are raised in the console.**
