// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory

import {
  ViroImage,
  ViroNode,
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroFlexView
} from "@viro-community/react-viro";
import React, {
	Component,
	useState
} from "react";
import {
	StyleSheet,
	Platform
} from "react-native";
import * as Location from "expo-location";
import CompassHeading from 'react-native-compass-heading';

import { region, theme } from "./regions";
import GLOBAL from './global.js';

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

// WORKING SCENE BELOW, no geo

// const HelloWorldSceneAR = () => {
// 	const [text, setText] = useState("Initializing AR...");
// 
// 	function onInitialized(state: any, reason: ViroTrackingReason) {
// 		console.log("onInitialized", state, reason);
// 		if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
// 			setText("Howdy pardner!");
// 		} else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
// 			// Handle loss of tracking
// 		}
// 	}
// 
// 	return ( 
// 		<ViroARScene onTrackingUpdated={onInitialized} >
// 			<ViroText
// 				text = {text}
// 				scale = {[0.5, 0.5, 0.5]}
// 				position = {[0, 0, -1]}
// 				style = {
// 					styles.helloWorldTextStyle
// 				}
// 			/>
// 		</ViroARScene>
// 	);
// };

const distanceBetweenPoints = (p1, p2) => {
  if (!p1 || !p2) {
      return 0;
  }

  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.latitude - p1.latitude) * Math.PI / 180;
  var dLon = (p2.longitude - p1.longitude) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1.latitude * Math.PI / 180) * Math.cos(p2.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

// Derived from https://github.com/NativeVision/geoar -- amazing example

class MarkerSceneAR extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cameraReady:        false,
      locationReady:      false,
      location:           undefined,
      nearbyPlaces:       [],
      tracking:           false,
      compassHeading:     0
    };
    this._onInitialized     = this._onInitialized.bind(this);
    this.transformGpsToAR   = this.transformGpsToAR.bind(this);
    this.latLongToMerc      = this.latLongToMerc.bind(this);
    this.placeARObjects     = this.placeARObjects.bind(this);
    this.getNearbyPlaces    = this.getNearbyPlaces.bind(this);
    this.listener           = undefined;
  }

  componentDidMount(){
	this.setState({
	  locationReady:  GLOBAL.location_permission,
	  cameraReady:    true
	}, this.getNearbyPlaces);
        
    CompassHeading.start(3, (heading) => {
      this.setState({compassHeading: heading});
    });
  }

  componentWillUnmount(){
    CompassHeading.stop();
  }


  latLongToMerc = (latDeg,  longDeg) => {
    // From: https://gist.github.com/scaraveos/5409402 
    const longRad = (longDeg / 180.0) * Math.PI;
    const latRad = (latDeg / 180.0) * Math.PI;
    const smA = 6378137.0;
    const xmeters = smA * longRad;
    const ymeters = smA * Math.log((Math.sin(latRad) + 1) / Math.cos(latRad));
    return { x: xmeters, y: ymeters };
  };

  transformGpsToAR = (lat, lng) => {
    const isAndroid = Platform.OS === 'android';
    const latObj    = lat;
    const longObj   = lng;
    const latMobile = GLOBAL.location[1];
    const longMobile = GLOBAL.location[0];

    const deviceObjPoint = this.latLongToMerc(latObj, longObj);
    const mobilePoint = this.latLongToMerc(latMobile, longMobile);
    const objDeltaY = deviceObjPoint.y - mobilePoint.y;
    const objDeltaX = deviceObjPoint.x - mobilePoint.x;

    if (isAndroid) {
      let degree      = this.state.compassHeading;
      let angleRadian = (degree * Math.PI) / 180;
      let newObjX     = objDeltaX * Math.cos(angleRadian) - objDeltaY * Math.sin(angleRadian);
      let newObjY     = objDeltaX * Math.sin(angleRadian) + objDeltaY * Math.cos(angleRadian);
      return { x: newObjX, z: -newObjY };
    }

    return { x: objDeltaX, z: -objDeltaY };
  };

  getNearbyPlaces = async () => {
//   	places = [];
//   	GLOBAL.data.forEach((feature) => {
// 		let {d, b, bv} = haversine(
// 			[feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
// 			[GLOBAL.location[0], GLOBAL.location[1]]
// 		);
// 		feature.properties.distance = d;
// 		feature.properties.bearing = b;
// 		feature.properties.bearing_verbose = bv;
// 		place = {
// 			id: feature.properties.marker_id,
// 			title: feature.properties.title,
// 			lat: feature.geometry.coordinates[1],
// 			lng: feature.geometry.coordinates[0],
// 			icon: null
// 		}
// 		if (distance <= 1000) places.push(place);
// 	});
	places = [
		{
			id: 0,
			title: 'Backyard',
			lat: 0,
			lng: 0,
			icon: 'https://play-lh.googleusercontent.com/5WifOWRs00-sCNxCvFNJ22d4xg_NQkAODjmOKuCQqe57SjmDw8S6VOSLkqo6fs4zqis'
		}
	]
	this.setState({nearbyPlaces: places});
  }

  placeARObjects = () => {
//   	console.log(GLOBAL.location, this.state.nearbyPlaces)
    if(this.state.nearbyPlaces.length == 0){
      return undefined;
    }
      const ARTags    = this.state.nearbyPlaces.map((item) => {
      const coords    = this.transformGpsToAR(item.lat, item.lng);
      const scale     = Math.abs(Math.round(coords.z/15));
      const distance  = distanceBetweenPoints({latitude: GLOBAL.location[1], longitude:  GLOBAL.location[0]}, {latitude: item.lat, longitude: item.lng});
      return (
        <ViroNode key={item.id} scale={[scale, scale, scale]} rotation={[0, 0, 0]} position={[coords.x, 0, coords.z]}>
          <ViroFlexView style={{alignItems: 'center', justifyContent: 'center'}}>
            <ViroText width={4} height={0.5} text={item.title} style={styles.helloWorldTextStyle} />
            <ViroText width={4} height={0.5} text={`${Number(distance).toFixed(2)} km`} style={styles.helloWorldTextStyle} position={[0, -0.75, 0]}/>
          </ViroFlexView>
        </ViroNode>
      )
    });
    return ARTags;
  }

  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onInitialized} >
        {(this.state.locationReady && this.state.cameraReady) && this.placeARObjects()}
      </ViroARScene>
    );
  }

  _onInitialized(state, reason) {
    this.setState({tracking: (state == ViroTrackingStateConstants.TRACKING_NORMAL || state == ViroTrackingStateConstants.TRACKING_LIMITED)}, () => {
      if(this.state.tracking){
//         Toast('All set!');
      }
      else{
        //Toast(`Move your device around gently to calibrate AR (${reason}) and compass.`);
      }
    });
  }
}

export default class ARView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: GLOBAL.data,
		};
		GLOBAL.arScreen = this;
	}
	render() {
		return ( 
			<ViroARSceneNavigator autofocus = {true}
				autofocus={true}
					initialScene={{
						scene: MarkerSceneAR,
					}}
					style={{flex: 1}}
			/>
		);
	}
}