// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory

import React, { Component, useState } from "react";
import { View, Image, Text, TouchableHighlight, DeviceEventEmitter } from "react-native";
import { Marker, Callout, Geojson, PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MarkerFilterHeader from "./MarkerFilterHeader";
import { getBbox, bboxToRegion } from "./utils";
import { styles } from "./styles";
import { region, theme } from "./regions";
import counties_geom from '../assets/current/counties_geom.json';

export default class MarkerMapView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mapCount: 0,
			data: global.data,
			mapType: 'mutedStandard'
		};
	}

	applyFilter = () => {
		DeviceEventEmitter.emit("event.filterData");
		this.setState({ mapCount: this.state.mapCount + 1, data: global.data });
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View>
					<MarkerFilterHeader applyFilter={this.applyFilter} />
				</View>
				<View style={{ flex: 1 }}>
					<MapView
						key={this.state.mapCount}
						style={styles.map}
						initialRegion={bboxToRegion(getBbox(this.state.data))}
						mapType={this.state.mapType}
						loadingEnabled={true}
						showsUserLocation={true}
						showsScale={true}
						tracksViewChanges={true}
						clusterColor={theme.primaryBackground}
						onRegionChange={(region) => {
							if(region.longitudeDelta <= 0.025) {
								if (this.state.mapType == 'mutedStandard') this.setState({mapType: 'hybrid'});
							}
							else {
								if (this.state.mapType == 'hybrid') this.setState({mapType: 'mutedStandard'});
							}
						}}
					>
						{this.state.data.map((marker, index) => (
							<Marker
								key={marker.properties.marker_id}
								pinColor={theme.primaryBackground}
								coordinate={{
									latitude: marker.geometry.coordinates[1],
									longitude: marker.geometry.coordinates[0],
								}}
							>
								<Callout
									style={styles.mapTooltip}
									onPress={() => 
										this.props.navigation.navigate(
											"MarkerDetailView",
											{
												properties:
													marker.properties,
												latitude:
													marker.geometry
														.coordinates[1],
												longitude:
													marker.geometry
														.coordinates[0],
												updateLastView: () => this.applyFilter()
											},
										)
									}
								>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
										}}
									>
										<Text style={styles.mapTooltipText}>
											{marker.properties.title}
										</Text>
										<Ionicons
											name="arrow-forward-circle-outline"
											color={
												styles.mapTooltipText.color
											}
											size={
												styles.mapTooltipText
													.fontSize
											}
										/>
									</View>
								</Callout>
							</Marker>
						))}
						<Geojson
						  geojson={counties_geom}
						  strokeColor="black"
						  fillColor="none"
						  strokeWidth={1}
						/>
					</MapView>
				</View>
			</View>
		);
	}
}
