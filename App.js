// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory

import React, { Component, useState } from "react";
import { DeviceEventEmitter, Appearance, AppState, View, Text } from "react-native";
import {
	useNavigation,
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

import SettingsView from "./src/SettingsView";
import MarkerListView from "./src/MarkerListView";
import MarkerMapView from "./src/MarkerMapView";
import MarkerDetailView from "./src/MarkerDetailView";
import MarkerFilterHeader from "./src/MarkerFilterHeader";
import ARView from "./src/ARView";
import { styles } from "./src/styles";
import { importAll, haversine, sortArrayofObjects, getBbox, bboxToRegion } from "./src/utils";

import { region, theme } from "./src/regions";
import GLOBAL from './src/global.js';

// Prevent splash screen from hiding until app setup has completed
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appearanceMode: Appearance.getColorScheme(),
			fontsLoaded: false,
			dataLoaded: false,
			imageSettingsLoaded: false,
			filterLoaded: false,
			locationPermissionsLoaded: false,
			deviceOnline: null
		};
	}
	
	// APP-WIDE DATA FILTERING METHOD
	filterData = () => {
		// Apply the filter
		let filteredData = [];
		for (i = 0; i < GLOBAL.data_clean.length; i++) {
			let match = true;
			// Favorites filter
			if (GLOBAL.filter.favorites != "all") {
				if (GLOBAL.favorites.indexOf(GLOBAL.data_clean[i].properties.marker_id) == -1)
					match = false;
			}
			// County filter
			if (GLOBAL.filter.county != "all") {
				if (GLOBAL.data_clean[i].properties.county != GLOBAL.filter.county)
					match = false;
			}
			// Search filter
			if (GLOBAL.filter.search != "") {
				const titleUpper = GLOBAL.data_clean[i].properties.title_upper;
				const valueUpper = GLOBAL.filter.search.toUpperCase();
				if (titleUpper.indexOf(valueUpper) == -1) match = false;
			}
			if (match == true) filteredData.push(GLOBAL.data_clean[i]);
		}
		if (GLOBAL.location_permission == true && GLOBAL.location != null && GLOBAL.location != false) this.sortByDistance(GLOBAL.location,filteredData);
		GLOBAL.data = filteredData;
		if (GLOBAL.listScreen != null) GLOBAL.listScreen.setState({data: GLOBAL.data, refreshing: false});
		if (GLOBAL.mapScreen != null) GLOBAL.mapScreen.setState({data: GLOBAL.data, region: bboxToRegion(getBbox(GLOBAL.data)), mapCount: GLOBAL.mapScreen.state.mapCount + 1 });
	};

	// FONT LOADER
	loadFonts = async () => {
		await Font.loadAsync({
			AsapCondensed: require("./assets/fonts/AsapCondensed-Regular.ttf"),
			EBGaramond: require("./assets/fonts/EBGaramond-VariableFont_wght.ttf"),
			Rye: require("./assets/fonts/Rye-Regular.ttf")
		});
		if (region.abbr_lower == "az") await Font.loadAsync({ BioRhyme: require("./assets/fonts/BioRhyme-Bold.ttf") });
		if (region.abbr_lower == "ca") await Font.loadAsync({ Pacifico: require("./assets/fonts/Pacifico-Regular.ttf") });
		if (region.abbr_lower == "co") await Font.loadAsync({ Ultra: require("./assets/fonts/Ultra-Regular.ttf") });
		if (region.abbr_lower == "mt") await Font.loadAsync({ Bevan: require("./assets/fonts/Bevan-Regular.ttf") });
		if (region.abbr_lower == "nm") await Font.loadAsync({ BigshotOne: require("./assets/fonts/BigshotOne-Regular.ttf") });
		if (region.abbr_lower == "nv") await Font.loadAsync({ Rye: require("./assets/fonts/Rye-Regular.ttf") });
		this.setState({
			fontsLoaded: true,
		});
	};
	
	// IMAGE DOWNLOAD STATUS LOADER
	loadImageSettings = async() => {
		download_images = await AsyncStorage.getItem("download_images");
		download_images = JSON.parse(download_images);
		if (download_images != null) GLOBAL.download_images = download_images;
		else GLOBAL.download_images = false;
		images_downloaded = JSON.parse(await AsyncStorage.getItem("images_downloaded"));
		if (images_downloaded != null) GLOBAL.images_downloaded = images_downloaded;
		else GLOBAL.images_downloaded = false;
		this.setState({
			imageSettingsLoaded: true,
		});
	}

	// DATA AND FILTER LOADER
	loadDataAndFilter = async() => {
		// LOAD LOCATION SETTINGS AND SETUP LOCATION HANDLING
		await this.getLocationPermissions();
		// Trigger method to re-check location permission any time app comes into focused state
		AppState.addEventListener('change', this.appStateChanged);
		this.setState({locationPermissionsLoaded: true});
	
		// LOAD DATA
		// Requiring large marker JSON files results in stack overflows with hermes
		// The issue for future reference:  https://github.com/expo/expo/issues/18365
		const markers_asset = await Asset.loadAsync(require('./assets/current/markers.txt'));
		const markers_raw = await FileSystem.readAsStringAsync(markers_asset[0].localUri);
		const markers = JSON.parse(markers_raw);
		
		let counties = [];
		markers.features.forEach((feature) => {
			if (counties.indexOf(feature.properties.county) == -1) {
				counties.push(feature.properties.county);
			}
			feature.properties.title_upper = feature.properties.title.toUpperCase();
		});
		counties.sort();
		counties.forEach((feature) => {
			GLOBAL.counties.push({
				label: feature,
				value: feature,
			});
		});
		GLOBAL.data_clean = markers.features;
		
		// LOAD FILTERS
		// Get list of favorites if saved to start filter preparation
		let favorites = await AsyncStorage.getItem("favorites");
		if (favorites == null) GLOBAL.favorites = [];
		else GLOBAL.favorites = JSON.parse(favorites);
		let empty = {
			search: "",
			favorites: "all",
			county: "all",
		};
		let filter = await AsyncStorage.getItem("filter");
		// If a filter was not saved, use clean data and do not run filtering logic
		if (filter == null) {
			GLOBAL.filter = empty;
			GLOBAL.data = GLOBAL.data_clean;
		}
		else {
			// If a filter was saved, parse and apply to data prior to rendering
			GLOBAL.filter = JSON.parse(filter);
			this.filterData();
		}
		// Add event listener for filter changes
		DeviceEventEmitter.addListener("event.filterData", () => {
			this.filterData();
		});
		if (GLOBAL.location_permission == true) await this.updateLocation();
		else GLOBAL.data.sort(sortArrayofObjects("title", "asc"));
		this.setState({
			dataLoaded: true,
			filterLoaded: true
		});
	};

	// DEVICE CONNECTIVITY HANDLER
	loadConnectivity = () => {
		NetInfo.addEventListener((state) => {
			if (state.isConnected == true) GLOBAL.online = true;
			else GLOBAL.online = false;
			this.setState({
				deviceOnline: GLOBAL.online,
			});
			if (GLOBAL.settingsScreen != null) GLOBAL.settingsScreen.setState({deviceOnline: GLOBAL.online})
		});
	};
	
	// DEVICE LOCATION HANDLERS
	// Check location permissions and refresh location if changed
	getLocationPermissions = async() => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		updated_location_permission = (status === 'granted');
		// Only handle if location permissions have not yet been set or have been changed
		if (GLOBAL.location_permission != updated_location_permission) {
			if (status == "granted") {
				// Location permission granted
				GLOBAL.location_permission = true;
				const GEOLOCATION_OPTIONS = { accuracy: Location.Accuracy.High, distanceInterval: 100 };
				Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
				GLOBAL.location_listener = DeviceEventEmitter.addListener("event.updateLocation", () => {
					this.updateLocation();
				});
			}
			else {
				// Location permission not granted
				GLOBAL.location_permission = false;
				GLOBAL.location = false;
				if (GLOBAL.location_listener != null) {
					GLOBAL.location_listener.remove();
					GLOBAL.location_listener = null;
					GLOBAL.data.sort(sortArrayofObjects("title", "asc"));
					if (GLOBAL.listScreen != null) GLOBAL.listScreen.setState({data: GLOBAL.data});
				}
			}
		}
	}
	// Facilitates location on launch and manual location updates (refresh pulldown)
	updateLocation = async() => {
		if (GLOBAL.location_permission == true) {
			if (GLOBAL.location == null) loc = await Location.getLastKnownPositionAsync();
			// Prevent app from waiting on a current position fix by loading the last known position until the list view renders for the first time
			else if (GLOBAL.listScreen != null) {
				if (GLOBAL.listScreen.state.initialized == false) loc = await Location.getLastKnownPositionAsync();
				else loc = await Location.getCurrentPositionAsync();
			}
			else loc = await Location.getLastKnownPositionAsync();
			this.locationChanged(loc);
		}
	}
	// Called after location update is available
	locationChanged = (loc) => {
		GLOBAL.location = [loc.coords.longitude, loc.coords.latitude];
		// Sort data only once available, and sort by distance only if the current location is actually different from the last time data were sorted
		if (GLOBAL.data != null && (GLOBAL.location_lastsorted[0] != GLOBAL.location[0] && GLOBAL.location_lastsorted[1] != GLOBAL.location[1]))  {
			GLOBAL.location_lastsorted = GLOBAL.location;
			GLOBAL.data = this.sortByDistance([loc.coords.longitude,loc.coords.latitude],GLOBAL.data);
			if (GLOBAL.listScreen != null) GLOBAL.listScreen.setState({data: GLOBAL.data});
		}
		if (GLOBAL.listScreen != null) GLOBAL.listScreen.setState({refreshing: false});
	}
	// Utility for calculating distances to markers and sorting marker list by distance
	sortByDistance = (loc, data) => {
		data.forEach((feature) => {
			let {d, b, bv} = haversine(
				[feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
				[loc[0], loc[1]]
			);
			feature.properties.distance = d;
			feature.properties.bearing = b;
			feature.properties.bearing_verbose = bv;
		});
		data.sort(sortArrayofObjects("distance", "asc"));
		return data;
	}
	// Listener to handle changes in location permissions
	appStateChanged = async() => {
		if (AppState.currentState == "active") {
			await this.getLocationPermissions();
		}
	};
	
	// USER INTERFACE COMPONENTS
	HomeTabs = () => {
		return (
			<Tab.Navigator
				screenOptions={{
					tabBarActiveTintColor: theme.activeTabBackground,
					headerShown: false
				}}
			>
				<Tab.Screen
					name="List"
					component={MarkerListView}
					options={{
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="list" color={color} size={size} />
						),
						lazy: false
					}}
				/>
				{this.state.deviceOnline ? (
					<Tab.Screen
						name="Map"
						component={MarkerMapView}
						options={{
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="map" color={color} size={size} />
							),
							lazy: true
						}}
					/>
				) : null}
				<Tab.Screen
					name="AR"
					component={ARView}
					options={{
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="camera" color={color} size={size} />
						),
						lazy: true
					}}
				/>
				<Tab.Screen
					name="Settings"
					component={SettingsView}
					options={{
						tabBarIcon: ({ color, size }) => (
							<Ionicons
								name="settings-outline"
								color={color}
								size={size}
							/>
						),
						lazy: false
					}}
				/>
			</Tab.Navigator>
		);
	};
	ScreenTitle = (props) => {
		return(
			<View>
				<Text style={styles.headerTitleStyle}>{props.children}</Text>
			</View>
		);
	};
	
	// LOAD ALL CORE SETTINGS AND DATA BEFORE RENDERING
	componentDidMount() {
		this.loadConnectivity();
		this.loadFonts();
		this.loadImageSettings();
		this.loadDataAndFilter();
	}
	
	// PRIMARY APP RENDERING METHOD
	render() {
		if (
			this.state.fontsLoaded &&
			this.state.dataLoaded &&
			this.state.imageSettingsLoaded &&
			this.state.filterLoaded &&
			this.state.locationPermissionsLoaded &&
			this.state.deviceOnline != null
			
		) {
			const headerStyles = {
				headerStyle: {
					backgroundColor: theme.primaryBackground,
				},
				headerTintColor: theme.contrastOnBackground,
			
				headerBackTitle: "Back",
				headerBackTitleStyle: {
					fontFamily: theme.headerFont
				}
			};
			return (
				<NavigationContainer
					theme={
						Appearance.getColorScheme() === "dark" ? DarkTheme : DefaultTheme
					}
				>
					<RootStack.Navigator>
						<RootStack.Screen
							name={`${region.name} Historical Markers`}
							component={this.HomeTabs}
							options={{
								headerStyle: {backgroundColor: theme.primaryBackground},
								headerTitle: (props) => <this.ScreenTitle {...props} />
							}}
						/>
						<RootStack.Screen
							name="MarkerDetailView"
							component={MarkerDetailView}
							options={headerStyles}
						/>
					</RootStack.Navigator>
				</NavigationContainer>
			);
		} else {
			return null;
		}
	}
}