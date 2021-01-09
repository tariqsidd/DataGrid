**Sales portal is developed for use by the sales/demand team at Dastgyr, where they can generate manual orders by calling retailers.**


---



## How to set up the project?

In order to start the project for the first time, you need to: 

1. Clone the project using command **git clone https://gitlab.com/dastgyr1/dastgyr-sales.git**.
2. Have node and npm installed on your machine.
3. Once installed, go to the cmd from the project directory and run **npm start** to start the project on your local machine.


## How to create build?

Following steps need to be followed while creating a build:

1. First things first. Before creating a build, always check to which environment server is your application connected to. (dev, qa or prod)
2. To create an optimized build for this project in windows please run **npm run winBuild**. For any other OS you can simply use **npm run build** command.
3. Once a build is created, it is ready for deployment.


## Code Structure

Lets discuss the files and folder structure now.

1. The **src** folder is the one which contains all the source code. The **node_modules** folder contains all the packages/libraries/third-party dependencies that React itself or some developer would have installed that serves a purpose. When you create a build as described above, you get a folder named as **build** inside the project's root directory.
2. Inside the **src** folder, you will find a **common** folder, where you can find any reusable/general pieces of code (usually function that are used across many components for eg: validators).
3. Inside the components folder, you may find a few reusable components, that will increase over time and based on the need.
4. In the **constants** folder, you will find an **index.js** file, where you can find base-urls to all environments (dev, qa and prod), so if you need to talk to production server and DB you can simply change the url and there you go (but do that with care)!
5. In the **Layouts** folder, you may find, the **main** and **minimal** layout folders. Main layout refers to the layout with sidebar and minimal layout does not contain the sidebar. You may find the sidebar and topbar components inside these folders.
6. In the **helpers** folder, there is a **NW** folder, where you can find a **NetworkHandler.js** file which contains all the network related requests (POST, GET, PUT, DELETE, Refresh Token, etc). Also you will find the **Api.js** file which is responsible of passing the requested api route, params, token, success and failure callbacks to the **NetworkHandler.js**.
6. In the **models** folder, please find a **UserModel.js** file, where all the methods that are used for calling apis first-hand are present. The methods in UserModel call relevant methods in the **Api.js** file as described above. These usermodel functions are currently being called from the components to call any Api.
7. In the **views** folder, you may find all the pages/views of the application.
8. The **theme** folder contains all the generic components of material-ui theme, that are being used through-out the application.
9. Inside the **Routes.js** file, you may find all the routes/urls for all pages in the application.
10. All components/pages are exported from the **index.js** from within each component/pages related folders inside the **src/views** folder, which are altogether exported from **src/views/index.js**, and are used in **Routes.js** file to map the correct route with the correct page component to display.


## Packages used

Following major packages are used in the project:

1. Material-Table is used to display data in tabular form.
2. Material-ui is used for utilizing reusable UI component.

