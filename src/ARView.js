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
import { View } from "react-native";
import CompassHeading from 'react-native-compass-heading';
import * as Location from "expo-location";

import MarkerFilterHeader from "./MarkerFilterHeader";
import { styles } from "./styles";

import { region, theme } from "./regions";
import GLOBAL from './global.js';

const utmObj = require('utm-latlng');

class MarkerARScene extends Component {
	constructor(props) {
		super(props);
		this.utmConverter = new utmObj(),
		this.locationListener = null,
		this.distanceThreshold = 1000,
		this.state = {
			data: [],
			heading: null,
			location: null,
			device_utm: null
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
	utmToSceneCoords = (loc1, loc2) => {
		dX = loc2.Easting - loc1.Easting;
		dY = loc2.Northing - loc1.Northing;
// 		h = (this.state.heading.heading * Math.PI) / 180;
// 		dX = dX * Math.cos(h) - dY * Math.sin(h);
// 		dY = dX * Math.sin(h) - dY * Math.cos(h);
// 		console.log(dY, dX, h);
		return { x: dX, z: -dY };
	}
	
	// On-load and on-unfocus logic for AR view
	componentDidMount = async() => {
		// Initialize location tracking
		const GEOLOCATION_OPTIONS = { accuracy: Location.Accuracy.High, distanceInterval: 10 };
		this.locationListener = await Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
		// Initialize compass heading tracking
		CompassHeading.start(3, (heading) => {
		  this.setState({heading: heading});
		});
	}
	componentWillUnmount = () => {
		CompassHeading.stop();
		this.locationListener.remove();
	}
	
	// AR Scene initialized callback
	onSceneInitialized = (state: any, reason: ViroTrackingReason) => {
		if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
			// Tracking is working fine
		}
		else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
			// Handle loss of tracking
			console.log("No AR tracking");
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
		this.setState({data: nearbyMarkers, location: loc, device_utm: device_utm});
	}
	
	// Called to place markers after location is ready
	placeMarkers = () => {
		if (this.state.data.length == 0 || this.state.device_utm == null || this.state.heading == null) return undefined;
		const ARMarkers = this.state.data.map((feature) => {
		  const coords = this.utmToSceneCoords(this.state.device_utm, feature.properties.marker_utm);
		  const scale = Math.abs(Math.round(coords.z/7.5));
		  return (
			<ViroNode key={feature.properties.marker_id} scale={[scale, scale, scale]} rotation={[0, 0, 0]} position={[coords.x, 0, coords.z]}>
				<ViroText width={4} height={0.5} text={feature.properties.title} style={styles.helloWorldTextStyle} />
				<ViroText width={4} height={0.5} text={`${Number(feature.properties.distance_ar).toFixed(2)} m`} style={styles.helloWorldTextStyle} position={[0, -0.75, 0]}/>
				<ViroImage width={1} height={1} source={{uri: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-1024.png'}} position={[0,-1.5,0]}/>
			</ViroNode>
		  )
		});
		return ARMarkers;
	}
	
	render() {
		if (this.state.location != null) {
			return ( 
				<ViroARScene onTrackingUpdated={this.onSceneInitialized} >
					{this.placeMarkers()}
				</ViroARScene>
			);
		}
	}
};

export default class ARView extends Component {
	render() {
		return ( 
			<View style={{ flex: 1 }}>
				<View>
					<MarkerFilterHeader />
				</View>
				<ViroARSceneNavigator
					worldAlignment = {'GravityAndHeading'}
					autofocus = {true}
					initialScene = {{ scene: MarkerARScene }}
					style = {{flex: 1}}
				/>
			</View>
		);
	}
};