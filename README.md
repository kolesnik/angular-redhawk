# Angular REDHAWK

The angular-redhawk library is a back-end interface to the REST and socket services of Geon's fork of REST-Python.  It provides minimal examples of very low-level interfaces to these services.  For higher-level interfaces, see the Angualr-REDHAWK UIKit (angular-redhawk-uikit).

The rest of this document has been OBE -- Overcome by Elvis.

This AngularJS 2 library interfaces with the REST-Python server from Geon Technologies.  It provides two modules top-level, Support and UI Kit.  The former contains the high-level Components users can implement in their designs to facilitate easy access to the underlying Services.  It also contains the generic REST Model definitions that are returned by those Services.  The UI Kit contains re-usable UI Components that use those support module Component interfaces to view and manipulate the Models.

## Installing Angular-REDHAWK

Presumably you have already installed it by including it in your `package.json` file and ran `npm install` for your app.  Now if you're using SystemJS for packaging, you need to configure your map for the name.  Assuming you have a `paths: { 'npm:': 'node_modules/' }` already listed, you can add to your map: `'angular-redhawk': 'npm:angular-redhawk/dist'`.  You will also need to add the name to the `packages`: `'angular-redhawk': { defaultExtension: 'js' }`.  These changes allow the app to locate the `angular-redhawk` module when the app loads.

For compiling your app, update your `tsconfig.json` to include `node_modules/angular-redhawk/angular-redhawk.d.ts` in your `files`.  This change will allow the compiler to type map your app against Angular-REDHAWK.

## Developing the Library

So you want to develop more things for the library.  Great!  A number of utilities have been added to facilitate development with an existing application.

### Configure Environment

First, clone the repository somewhere outside of your test application and instruct NPM you'll be linking it:

    git clone http://github.com/GeonTech/angular-redhawk.git
    cd angular-redhawk
    vi package.json
    # change the postinstall script to postinstalld
    npm install
    vi package.json
    # change postinstalld back to postinstall
    npm link

Next, in your project directory establish the link:

    cd PROJECT_DIR
    npm link angular-redhawk

This will have NPM treat the link like you did `npm install angular-redhawk`, however now you can develop back in your cloned directory.

### Development

There are two main modules, support and uikit.  So let's set some ground rules:

1. If you're developing in the UIKit, please refrain from importing the services in the Support module.  Integrate your components with the Components' interfaces from the Support module.
2. Please leave all REST calls to the support module Components
3. The support module Components are prefixed `ar` in the kabob-case and their classes are named similarly: `ArDeviceManager -> ar-device-manager`, the definition of which can be found in `components/devicemanager.component.ts`.  Please stick to this convention _in the support module_.
4. Components in the UI kit should be prefied `arkit` in the kabob-case.  Please follow a similar class naming convention as found in the Support module.
0. Certainly more to come... just trying to establish some friendly MVC ground rules.

> **NOTE:** If you use comment blocks, `/* block */`, you'll likely find that the typescript compiler works but your code fails to execute in the browser.  One error seen so far was a failure to load a module that is unrelated to this module (i.e., some dependency in node_modules that should be okay).  Remove the code block and everything should be happy.

### Publishing

Use the NPM task `lint` to quality check your code (it runs TSLint).

    npm run lint

Please correct all "errors" generated by TSlint.  Once those errors are resolved, use the `prepublish` task to run the compiler which may generate more errors.  Once both of those are successful, you should be in pretty good shape to go test with your app (refresh your browser, etc.).