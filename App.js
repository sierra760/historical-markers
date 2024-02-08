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

import SettingsView from "./src/SettingsView";
import MarkerListView from "./src/MarkerListView";
import MarkerMapView from "./src/MarkerMapView";
import MarkerDetailView from "./src/MarkerDetailView";
import MarkerFilterHeader from "./src/MarkerFilterHeader";
import { styles } from "./src/styles";
import { importAll, haversine, sortArrayofObjects, getBoundingBox, fulfillWithTimeLimit } from "./src/utils";

// STATE/REGION CONFIGURATION
// To change the app's state/region, edit the string literal on line 2 of the file imported below
// Make sure also to rename app-**.json (where ** is the abbreviation of your region) to app.json before running or building
import { region, theme } from "./src/regions";

// Prevent splash screen from hiding until app setup has completed
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

global.data_clean = null;
global.data = null;
global.filter = null;
global.favorites = null;
global.counties = [
	{
		label: "All Counties",
		value: "all",
	},
];
global.location_permission = false;
global.location = null;
global.online = null;

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fontsLoaded: false,
			dataLoaded: false,
			filterLoaded: false,
			deviceConnected: null,
		};
	}

	loadFonts = async () => {
		await Font.loadAsync({
			AsapCondensed: require("./assets/fonts/AsapCondensed-Regular.ttf"),
			EBGaramond: require("./assets/fonts/EBGaramond-VariableFont_wght.ttf"),
			Rye: require("./assets/fonts/Rye-Regular.ttf"),
		});
		this.setState({
			fontsLoaded: true,
		});
	};

	loadFilter = async () => {
		// Configure filter
		let empty = {
			search: "",
			favorites: "all",
			county: "all",
		};
		let filter = await AsyncStorage.getItem("filter");
		if (filter == null) global.filter = empty;
		else global.filter = JSON.parse(filter);
		// Configure favorites
		let favorites = await AsyncStorage.getItem("favorites");
		if (favorites == null) global.favorites = [];
		else global.favorites = JSON.parse(favorites);
		// Add event listener for filter changes
		DeviceEventEmitter.addListener("event.filterData", () => {
			this.filterData();
		});
		this.setState({
			filterLoaded: true,
		});
		this.loadData();
	};

	loadData = async() => {
		const markers = require("./assets/current/markers.json");
		const images = importAll(
			require.context("./assets/current/photos_compressed"),
		);
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			global.location_permission = false;
			markers.features.sort(sortArrayofObjects("title", "asc"));
			global.location = false;
		} else {
			global.location_permission = true;
			let loc = await fulfillWithTimeLimit(10000,Location.getCurrentPositionAsync({}),false);
			if (loc != false) {
				markers.features.forEach((feature) => {
					let {d, b, bv} = haversine(
						[feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
						[loc.coords.longitude, loc.coords.latitude],
					);
					feature.properties.distance = d;
					feature.properties.bearing = b;
					feature.properties.bearing_verbose = bv;
				});
				markers.features.sort(sortArrayofObjects("distance", "asc"));
				global.location = [loc.coords.longitude, loc.coords.latitude];
			}
			else {
				markers.features.sort(sortArrayofObjects("title", "asc"));
				global.location = false;
			}
		}
		let counties = [];
		markers.features.forEach((feature) => {
			if (!feature.properties.hasOwnProperty("images"))
				feature.properties.images = {};
			feature.properties.photos.forEach((photo) => {
				feature.properties.images[photo.filename] = images[photo.filename];
			});
			if (counties.indexOf(feature.properties.county) == -1) {
				counties.push(feature.properties.county);
			}
		});
		counties.sort();
		counties.forEach((feature) => {
			global.counties.push({
				label: feature,
				value: feature,
			});
		});
		global.data_clean = markers.features;
		this.setState({
			dataLoaded: true,
		});
	};

	filterData = () => {
		// Apply the filter
		let filteredData = global.data_clean.filter((item) => {
			let match = true;
			// Favorites filter
			if (global.filter.favorites != "all") {
				if (global.favorites.indexOf(item.properties.marker_id) == -1)
					match = false;
			}
			// County filter
			if (global.filter.county != "all") {
				if (item.properties.county.indexOf(global.filter.county) == -1)
					match = false;
			}
			// Search filter
			if (global.filter.search != "") {
				const titleUpper = `${item.properties.title.toUpperCase()}`;
				const valueUpper = global.filter.search.toUpperCase();
				if (titleUpper.indexOf(valueUpper) == -1) match = false;
			}
			return match;
		});
		global.data = filteredData;
	};

	HomeTabs = () => {
		return (
			<Tab.Navigator
				screenOptions={{
					tabBarActiveTintColor: theme.activeTabBackground,
					headerShown: false,
					unmountOnBlur: true,
				}}
			>
				<Tab.Screen
					name="List"
					component={MarkerListView}
					filterData={this.filterData}
					options={{
						tabBarIcon: ({ color, size }) => (
							<Ionicons name="list" color={color} size={size} />
						),
					}}
				/>
				{this.state.deviceConnected ? (
					<Tab.Screen
						name="Map"
						component={MarkerMapView}
						filterData={this.filterData}
						options={{
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="map" color={color} size={size} />
							),
						}}
					/>
				) : null}

				<Tab.Screen
					name="About"
					component={SettingsView}
					options={{
						tabBarIcon: ({ color, size }) => (
							<Ionicons
								name="information-circle-outline"
								color={color}
								size={size}
							/>
						),
					}}
				/>
			</Tab.Navigator>
		);
	};

	loadConnectivity = () => {
		NetInfo.addEventListener((state) => {
			if (state.isConnected == true) {
				this.setState({
					deviceConnected: true,
				});
				global.online = true;
			} else {
				this.setState({
					deviceConnected: false,
				});
				global.online = false;
			}
		});
	};

	componentDidMount() {
		this.loadConnectivity();
		this.loadFonts();
		this.loadFilter();
	}

	render() {
		if (
			this.state.fontsLoaded &&
			this.state.dataLoaded &&
			this.state.filterLoaded &&
			this.state.deviceConnected != null &&
			global.location != null
		) {
			this.filterData();
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
			SplashScreen.hideAsync();
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