
# Historical Markers

Historical Markers is a free and open source software (FOSS) mobile application that serves as an interactive guide to historical markers, allowing users to find historical markers near them and even view the contents of the markers on their mobile devices.

This project began on a barstool in Gold Hill, Nevada (just downhill from iconic Virginia City) when the developer came up empty-handed in a search for a mobile app that could ably serve as a guide for exploring the history of the Comstock.  The first prototype of this project was a simple list-based guide to the official historical markers designated by the Nevada State Historic Preservation Office, and the project has since evolved into a codebase that can be easily repurposed for creating location-driven guides to regional history.

The code in this repository supports the following published iOS applications (in the order they were released):

- [Nevada Historical Markers](https://apps.apple.com/us/app/nevada-historical-markers/id6477352146)
- [New Mexico Historical Markers](https://apps.apple.com/us/app/new-mexico-historical-markers/id6477751451)
- [Arizona Historical Markers](https://apps.apple.com/us/app/arizona-historical-markers/id6477751420)
- [Colorado Historical Markers](https://apps.apple.com/us/app/colorado-historical-markers/id6477751225)
- [Montana Historical Markers](https://apps.apple.com/us/app/montana-historical-markers/id6477809186)

Following these will be a release for California (the developer's home state).  California would have come much sooner were it not for the challenges involved in bundling images of the more than 12,000 catalogued historical markers within the state without creating an unacceptably large binary.

Developers interested in creating versions of this app for other regions or topics are encouraged to use this codebase as a template to create their own applications.

This application is built with Expo and React Native and is optimized for iOS (both iPhone and iPad).  Android is also supported, though the developer has not yet conducted extensive testing of an Android build.

Note that while this app is and always will be FOSS, the textual and graphical content used in the published version of the application is mostly owned by the Historial Marker Database (HMdb.org) and its contributors.  The source code in this repository is therefore distributed *without* the app's complete content; sample content is included for the purpose of demonstrating functionality and data structures.


## Features

- View markers in a list (optionally sorted by distance to the user's location) or in an interactive map that uses marker clustering and multiple basemaps;
- See details of each historical marker, including the marker's location, its inscription, relevant background information, and (for most markers) photos of each marker itself and its surrounding area;
- Interact with marker content and photos even if your device is offline -- all marker data is designed to be fully contained within the app, with the exception of map tiles;
- Create your own variant of this app easily by using this code as a plug-and-play template, as historical marker content is stored in a simple and standardized JSON data structure.

## Roadmap

The developer plans the following improvements for the app's next minor version:

- Support for in-app management of marker media (i.e., downloading subsets of data for offline use; necessary for California and other areas with lots of markers)
- Refactor to avoid use of global variables (no judgement please!)
- Conduct testing on Android devices and correct any related issues
- General code audit and clean-up to reflect best practices of React Native development (this is the developer's first solo mobile app and the current codebase is disorganized and probably violates a bunch of optimal practices for using React Native)
- Refactor code to allow for more straightforward creation of additional regional variants (i.e., historical markers within other states aside from Nevada)

## Screenshots

![Viewing Markers on a Map](screenshots/mapview.jpg?raw=true' "Viewing Markers on a Map") ![Viewing Markers in a List](screenshots/listview.jpg?raw=true' "Viewing Markers in a List") ![Viewing an Individual Marker's Content](screenshots/detailview.jpg?raw=true' "Viewing an Individual Marker's Content")


## Installation

First, install [Node.js](https://nodejs.org/en) and [Expo](https://docs.expo.dev/get-started/installation/).  You may also wish to install Xcode with appropriate iOS SDKs or Android Studio, but you will still be able to run the app using Expo Go without installing those tools/SDKs.

Begin by cloning this repository and changing into the corresponding directory:

```bash
git clone https://github.com/sierra760/historical-markers.git
cd historical-markers
```

Then, use expo to install dependencies:

```bash
npm install
```

Note that since this project offers support for creating apps for multiple regions from a single codebase, the state of Nevada is used as the default region for this repository.  You can change the region at any time by running a shell script in the root directory of this repository that applies the necessary configuration changes.  For example, the following command switches configuration to the state of Colorado (two-letter abbreviation "co"):

```bash
./select_region.sh co
```

Regions can be modified, added, and removed by editing src/regions.js as well as creating symlinks to a valid app.json file and assets directory for each region.

This project's source code is not bundled with historical marker content as this content is not owned by the developer.  This repository hosts some very basic sample data containing the JSON data for one historical marker per region.  To ensure that this sample data is loaded when launching the app, you will need to rename "markers_sample.json" to "markers.json", and the directory "photos_compressed_sample" to "photos_compressed" using the following commands (to be executed from the project directory; uses Nevada as an example):

```bash
mv assets/nv/markers_sample.json assets/nv/markers.json
mv assets/nv/photos_compressed_sample assets/nv/photos_compressed
```

You can then run the app on iOS or Android simulators and/or devices by executing the following command to launch Expo's app server and Metro Builder:

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

