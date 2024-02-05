
# Nevada Historical Markers

Nevada Historical Markers is a free and open source software (FOSS) mobile application that serves as an interactive guide to the nearly 1,000 historical markers located throughout the Silver State.

This application is build with Expo and React Native and is currently optimized for iOS (both iPhone and iPad).  Comprehensive Android testing and support is forthcoming.

Note that while this app is and always will be FOSS, the textual and graphical content used in the published version of the application is mostly owned by the Historial Marker Database (HMdb.org) and its contributors.  The source code in this repository is therefore distributed *without* the app's complete content; sample content is included for the purpose of demonstrating functionality and data structures.


## Features

- View markers in a list (optionally sorted by distance to the user's location) or in an interactive map that uses marker clustering and multiple basemaps;
- See details of each historical marker, including the marker's location, its inscription, relevant background information, and (for most markers) photos of each marker itself and its surrounding area;
- Interact with marker content and photos even if your device is offline -- all marker data is designed to be fully contained within the app, with the exception of map tiles;
- Create your own variant of this app easily by using this code as a plug-and-play template, as historical marker content is stored in a simple and standardized JSON data structure.
## Roadmap

The developer plans the following improvements for the app's next minor version:

- Finalize comprehensive support for Android devices
- General code audit and clean-up to reflect best practices of React Native development (this is the developer's first solo mobile app and the current codebase is disorganized and probably violates a bunch of optimal practices for using React Native)
- Refactor code to allow for more straightforward creation of additional regional variants (i.e., historical markers within other states aside from Nevada)

In addition to the state of Nevada, the developer will soon be extending this codebase to release applications for historical markers in the following U.S. states:

- New Mexico
- California
- Arizona
- Colorado
- Montana

Users interested in versions of this app for other states or locations are encouraged to use this codebase as a template to create their own applications.
## Screenshots

![Viewing Markers on a Map](/screenshots/mapview.jpg') ![Viewing Markers in a List](/screenshots/listview.jpg') ![Viewing an Individual Marker's Content](/screenshots/detailview.jpg')


## Installation

First, install [Node.js](https://nodejs.org/en) and [Expo](https://docs.expo.dev/get-started/installation/).  You may also wish to install Xcode with appropriate iOS SDKs or Android Studio, but you will still be able to run the app using Expo Go without installing those tools/SDKs.

Begin by cloning this repository and changing into the corresponding directory:

```bash
git clone https://github.com/sierra760/historical-markers.git
cd historical-markers
```

Then, use expo to install dependencies:

```bash
npx expo install
```

You can then run the app on iOS or Android simulators and/or devices by executing the following command to launch Expo's server and Metro Builder:

```bash
npx expo start
```
## Contributing

**Contributions and issue reports are always welcome!**

Please open issues and/or pull requests to suggest bug fixes, changes, and/or improvements.  All pull requests should remain consistent with the app's purpose, which is to provide intuitive and user-friendly access to information about historical markers in western U.S. states.  Changes that are inconsistent with this purpose may not be accepted, though developers are welcome to fork this project and use it as a foundation or template for similar projects for which substantive modifications to the codebase are required.
## Authors

- Sierra Burkhart, Ph.D. (Academic Director, UCLA Geospatial): [@sierra760](https://www.github.com/sierra760)


## License

[GNU General Public License version 3](https://www.gnu.org/licenses/gpl-3.0.en.html#license-text)

