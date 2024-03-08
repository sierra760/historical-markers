// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory

import {
	ViroARScene,
	ViroARSceneNavigator,
	ViroFlexView,
	ViroImage,
	ViroNode,
	ViroText,
	ViroTrackingReason,
	ViroTrackingStateConstants,
} from "@viro-community/react-viro";
import React, { Component, setState } from "react";
import {
	StyleSheet
} from "react-native";
import CompassHeading from 'react-native-compass-heading';
import * as Location from "expo-location";

import { region, theme } from "./regions";
import GLOBAL from './global.js';

const utmObj = require('utm-latlng');

class MarkerARScene extends Component {
	constructor(props) {
		super(props);
		this.utmConverter = new utmObj(),
		this.distanceThreshold = 1000,
		this.state = {
			demoText: 'Initializing AR...',
			data: [],
			heading: null,
			location: null
		};
	}
	
	// Utility methods
	// Euclidean distance with UTM coordiantes
	utmDistance = (loc1, loc2) => {
		a = loc2[0] - loc1[0];
		b = loc2[1] - loc1[1];
		return Math.sqrt(a*a + b*b);
	}
	// Calculate marker coordinates for scene from device and marker UTM coords
	utmToSceneCoords = (device_utm, marker_utm) => {
		console.log("utm inputs", device_utm, marker_utm);
		dY = marker_utm.Northing - device_utm.Northing;
		dX = marker_utm.Easting - device_utm.Easting;
		return { x: dX, z: -dY };
	}
	
	// On-load logic for AR view
	componentDidMount = () => {
		// Initialize location tracking
		const GEOLOCATION_OPTIONS = { accuracy: Location.Accuracy.High };
		Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
		// Initialize compass heading tracking
		CompassHeading.start(3, (heading) => {
		  this.setState({heading: heading});
		});
	}
	
	// AR Scene initialized callback
	onSceneInitialized = (state: any, reason: ViroTrackingReason) => {
		if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
			this.setState({demoText: "Howdy pardner!"});
		} else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
			// Handle loss of tracking
		}
	}
	
	// Location updated callback
	locationChanged = (loc) => {
		device_utm = this.utmConverter.convertLatLngToUtm(loc.coords.latitude,loc.coords.longitude, 1);
		nearbyMarkers = [];
		for (i = 0; i < GLOBAL.data.length; i++) {
			marker_utm = this.utmConverter.convertLatLngToUtm(GLOBAL.data[i].geometry.coordinates[1],GLOBAL.data[i].geometry.coordinates[0], 1);
			d = this.utmDistance([device_utm.Easting, device_utm.Northing], [marker_utm.Easting, marker_utm.Northing]);
			// Since marker list is sorted by location, we will stop looping once we hit the first marker that is beyond our threshold
			if (d > this.distanceThreshold) break;
			GLOBAL.data[i].properties["marker_utm"] = marker_utm;
			GLOBAL.data[i].properties["distance_ar"] = d;
			nearbyMarkers.push(GLOBAL.data[i]);
		}
		if (nearbyMarkers.length < 5) {
			nearbyMarkers = GLOBAL.data.slice(0,5);
			for (i = 0; i < 5; i++) {
				nearbyMarkers[i].properties["marker_utm"] = this.utmConverter.convertLatLngToUtm(GLOBAL.data[i].geometry.coordinates[1],GLOBAL.data[i].geometry.coordinates[0], 1);
				nearbyMarkers[i].properties["distance_ar"] = this.utmDistance([device_utm.Easting, device_utm.Northing], [marker_utm.Easting, marker_utm.Northing]);
			}
		}
		this.setState({data: nearbyMarkers, location: loc}, this.placeMarkers(device_utm));
	}
	
	// Called to place markers after location is ready
	placeMarkers = (device_utm) => {
		if(this.state.data.length == 0) return undefined;
		const ARMarkers = this.state.data.map((feature) => {
		  const coords = this.utmToSceneCoords(device_utm, feature.properties.marker_utm);
		  const scale = Math.abs(Math.round(coords.z/15));
		  return (
			<ViroNode key={feature.properties.marker_id} scale={[scale, scale, scale]} rotation={[0, 0, 0]} position={[coords.x, 0, coords.z]}>
			  <ViroFlexView style={{alignItems: 'center', justifyContent: 'center'}}>
				<ViroText width={4} height={0.5} text={feature.properties.title} style={styles.helloWorldTextStyle} />
				<ViroText width={4} height={0.5} text={`${Number(feature.properties.distance_ar).toFixed(2)} m`} style={styles.helloWorldTextStyle} position={[0, -0.75, 0]}/>
			  </ViroFlexView>
			</ViroNode>
		  )
		});
		return ARMarkers;
	}
	
	render() {
		return ( 
			<ViroARScene onTrackingUpdated={this.onSceneInitialized} >
				{(this.state.location != null) && this.placeMarkers()}
			</ViroARScene>
		);
	}
};

export default class ARView extends Component {
	render() {
		return ( 
			<ViroARSceneNavigator autofocus = {true}
				initialScene = {
					{
						scene: MarkerARScene,
					}
				}
				style = {styles.f1}
			/>
		);
	}
};

var styles = StyleSheet.create({
	f1: {
		flex: 1
	},
	helloWorldTextStyle: {
		fontFamily: "Arial",
		fontSize: 30,
		color: "#ffffff",
		textAlignVertical: "center",
		textAlign: "center",
	},
});