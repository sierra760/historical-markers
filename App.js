// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory

import React, { Component, useState } from "react";
import { DeviceEventEmitter, Appearance } from "react-native";
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
			fontsLoaded: false,
			dataLoaded: false,
			imageSettingsLoaded: false,
			filterLoaded: false,
			locationPermissionsLoaded: false,
			deviceOnline: null
		};
	}

	loadFonts = async () => {
		await Font.loadAsync({
			AsapCondensed: require("./assets/fonts/AsapCondensed-Regular.ttf"),
			EBGaramond: require("./assets/fonts/EBGaramond-VariableFont_wght.ttf"),
			Rye: require("./assets/fonts/Rye-Regular.ttf"),
			Pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
		});
		this.setState({
			fontsLoaded: true,
		});
	};
	
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

	loadDataAndFilter = async() => {
		// LOAD LOCATION SETTINGS AND SETUP LOCATION HANDLING
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status == "granted") {
			// Location permission granted
			GLOBAL.location_permission = true;
			const GEOLOCATION_OPTIONS = { accuracy: Location.Accuracy.High, distanceInterval: 100 };
			Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
			DeviceEventEmitter.addListener("event.updateLocation", () => {
				this.updateLocation();
			});
		}
		else {
			// Location permission not granted
			GLOBAL.location_permission = false;
			GLOBAL.data_clean.sort(sortArrayofObjects("title", "asc"));
			GLOBAL.location = false;
		}
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
		this.setState({
			dataLoaded: true,
			filterLoaded: true
		});
	};

	filterData = () => {
		// Apply the filter
		let filteredData = GLOBAL.data_clean.filter((item) => {
			let match = true;
			// Favorites filter
			if (GLOBAL.filter.favorites != "all") {
				if (GLOBAL.favorites.indexOf(item.properties.marker_id) == -1)
					match = false;
			}
			// County filter
			if (GLOBAL.filter.county != "all") {
				if (item.properties.county != GLOBAL.filter.county)
					match = false;
			}
			// Search filter
			if (GLOBAL.filter.search != "") {
				const titleUpper = `${item.properties.title.toUpperCase()}`;
				const valueUpper = GLOBAL.filter.search.toUpperCase();
				if (titleUpper.indexOf(valueUpper) == -1) match = false;
			}
			return match;
		});
		if (GLOBAL.location != null && GLOBAL.location != false) this.sortByDistance(GLOBAL.location,filteredData);
		GLOBAL.data = filteredData;
		if (GLOBAL.listScreen != null) GLOBAL.listScreen.setState({data: GLOBAL.data, refreshing: false});
		if (GLOBAL.mapScreen != null) GLOBAL.mapScreen.setState({data: GLOBAL.data, region: bboxToRegion(getBbox(GLOBAL.data)), mapCount: GLOBAL.mapScreen.state.mapCount + 1 });
	};

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
							lazy: false
						}}
					/>
				) : null}
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
	
	locationChanged = (loc) => {
		if (GLOBAL.location != null) previous_location = GLOBAL.location;
		else previous_location = [0,0];
		GLOBAL.location = [loc.coords.longitude, loc.coords.latitude];
		// Sort data only once available, and do not re-sort if location has not changed
		if (GLOBAL.data != null && previous_location[0] != loc.coords.longitude && previous_location[1] != loc.coords.latitude)  {
			GLOBAL.data = this.sortByDistance([loc.coords.longitude,loc.coords.latitude],GLOBAL.data);
			if (GLOBAL.listScreen != null) GLOBAL.listScreen.setState({data: GLOBAL.data});
		}
		if (GLOBAL.listScreen != null) {
			if (GLOBAL.listScreen.state.refreshing == true) GLOBAL.listScreen.setState({refreshing: false});
		}
	}
	
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
	
	// Facilitates location on launch and manual location updates (refresh pulldown)
	updateLocation = async() => {
		if (GLOBAL.location == false)
			loc = await Location.getLastKnownPositionAsync();
		else
			loc = await Location.getCurrentPositionAsync();
		this.locationChanged(loc);
	}

	componentDidMount() {
		this.loadConnectivity();
		this.loadFonts();
		this.loadImageSettings();
		this.loadDataAndFilter();
	}

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
				headerTitleStyle: {
					fontFamily: theme.headerFont,
					fontSize: 20,
				},
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
							options={headerStyles}
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