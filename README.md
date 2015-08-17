## Docker Micro-services Architecture Admin Console using Angular and Bootstrap 

[![Join the chat at https://gitter.im/start-angular/sb-admin-angular](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/start-angular/sb-admin-angular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This application uses Angular and Bootstrap for a Admin Console application for a Docker Micro-services architecture. It uses the Angular.js Bootstrap Theme [SB Admin Angular](http://startangular.com/product/sb-admin-angular-theme/).

The development architecture also uses [bower](http://bower.io/) for managing the client-side javascript packages and grunt [grunt-cli](https://www.npmjs.com/package/grunt-cli) for the development workflow.  

## Installation
1. Clone this project or Download the ZIP file
2. Make sure you have [bower](http://bower.io/), [grunt-cli](https://www.npmjs.com/package/grunt-cli) and  [npm](https://www.npmjs.org/) installed globally
3. On the command prompt run the following commands
- cd `project-directory`
- `npm install` - bower install is ran from the postinstall
- `npm start` - a shortcut for `grunt serve`
- `npm run dist` - a shortcut for `grunt serve:dist` to minify the files for deployment


# adminConsole

The admin console is a static HTML5 website that calls Docker REST APIs to display and update the state of a Docker microservices platform.



# architecture

![Admin console calling Docker API's](https://raw.githubusercontent.com/LesterThomas/adminConsole/master/app/images/Docker%20architecture%202.png)
