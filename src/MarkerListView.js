// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of directory

import React, { Component, useState } from "react";
import {
	View,
	Text,
	FlatList,
	RefreshControl,
	TouchableWithoutFeedback,
	DeviceEventEmitter
} from "react-native";
import { ListItem } from "@rneui/base";
import * as Location from "expo-location";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import { Button } from "@rneui/base";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MarkerFilterHeader from "./MarkerFilterHeader";
import { sortArrayofObjects, formatDistance, haversine, fulfillWithTimeLimit } from "./utils";
import { styles, theme } from "./styles";

export default class MarkerListView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			refreshing: false,
			data: null,
		};
	}

	applyFilter = () => {
		this.setState({ data: global.data });
		this.sortByLocation();
	};
	
	updateFromDetailView = () => {
		if (global.filter.favorites == 'favorites') DeviceEventEmitter.emit("event.filterData");
		this.applyFilter();
	};

	_listEmptyComponent = () => {
		return (
			<View>
				<Text style={styles.emptyList}>
					No markers found matching search or filter criteria.
				</Text>
			</View>
		);
	};
	
	callRefreshControl = () => {
		this.setState({ refreshing: true });
		this.sortByLocation();
	};

	sortByLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			global.location_permission = false;
			this.setState({ location: false });
			return;
		} else {
			global.location_permission = true;
			let loc = await fulfillWithTimeLimit(10000,Location.getCurrentPositionAsync({}),false);
			if (loc != false) {
				if (global.location == false) {
					global.data_clean.forEach((feature) => {
						let {d, b, bv} = haversine(
							[feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
							[loc.coords.longitude, loc.coords.latitude],
						);
						feature.properties.distance = d;
						feature.properties.bearing = b;
						feature.properties.bearing_verbose = bv;
					});
					global.data_clean.sort(sortArrayofObjects("distance", "asc"));
				}
				global.data.forEach((feature) => {
					let {d, b, bv} = haversine(
						[feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
						[loc.coords.longitude, loc.coords.latitude],
					);
					feature.properties.distance = d;
					feature.properties.bearing = b;
					feature.properties.bearing_verbose = bv;
				});
				global.data.sort(sortArrayofObjects("distance", "asc"));
				global.location = [loc.coords.longitude, loc.coords.latitude];
				this.setState({ data: global.data, refreshing: false  });
			}
			else {
				this.state.data.sort(sortArrayofObjects("title", "asc"));
				global.location = false;
				this.setState({ data: global.data, location: false, refreshing: false });
			}
		}
	};

	async componentDidMount() {
		this.applyFilter();
	}

	renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: "100%",
					backgroundColor: theme.separatorColor,
				}}
			/>
		);
	};

	toggleFavorite = (marker_id) => {
		if (global.favorites.indexOf(marker_id) == -1) {
			global.favorites.push(marker_id);
		} else {
			global.favorites = global.favorites.filter(
				(item) => item !== marker_id,
			);
		}
		AsyncStorage.setItem(
			"favorites",
			JSON.stringify(global.favorites),
		);
		if (global.filter.favorites == 'favorites') DeviceEventEmitter.emit("event.filterData");
		this.applyFilter();
	};

	renderItem = ({ item }) => {
		const favoriteIcon = (marker_id) => {
			if (global.favorites.indexOf(marker_id) != -1) return "favorite";
			else return "favorite-border";
		};
		let subtitle = item.properties.county;
		let distance = Number(item.properties.distance);
		let unit = "miles";
		if (global.location != false) {
			renderedDistance = formatDistance(distance);
			subtitle = `${subtitle}   |   ${renderedDistance} ${item.properties.bearing}`;
		}
		if (item.properties.city != "---" && item.properties.city != "") {
			subtitle = `${item.properties.city}, ${subtitle}`;
		}
		let payload = {
			properties: item.properties,
			latitude: item.geometry.coordinates[1],
			longitude: item.geometry.coordinates[0],
			updateLastView: () => this.updateFromDetailView()
		};
		if (global.favorites.indexOf(item.properties.marker_id) > -1)
			rowStyle = styles.listFavorite;
		else rowStyle = styles.listNonfavorite;
		return (
			<TouchableWithoutFeedback
				onPress={() =>
					this.props.navigation.navigate("MarkerDetailView", payload)
				}
			>
				<ListItem.Swipeable
					leftContent={(reset) => (
						<Button
							onPress={() => {
								this.toggleFavorite(item.properties.marker_id);
								reset();
							}}
							icon={{
								name: favoriteIcon(item.properties.marker_id),
								color: "white",
							}}
							radius={0}
							raised={false}
							buttonStyle={{
								minHeight: "100%",
								backgroundColor: theme.primaryBackgroundDarker,
							}}
						/>
					)}
					containerStyle={rowStyle}
				>
					<ListItem.Content>
						<ListItem.Title style={styles.listTitle}>
							{item.properties.title}
						</ListItem.Title>
						<ListItem.Subtitle style={styles.listSubtitle}>
							{subtitle}
						</ListItem.Subtitle>
					</ListItem.Content>
					<ListItem.Chevron />
				</ListItem.Swipeable>
			</TouchableWithoutFeedback>
		);
	};

	render() {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: theme.primaryBackgroundDarker,
				}}
			>
				<FlatList
					bounces={global.location_permission}
					data={this.state.data}
					keyExtractor={(item) => item.properties.marker_id}
					ListEmptyComponent={this._listEmptyComponent}
					renderItem={this.renderItem}
					ItemSeparatorComponent={this.renderSeparator}
					ListHeaderComponent={
						<MarkerFilterHeader applyFilter={this.applyFilter} />
					}
					initialNumToRender={20}
					stickyHeaderIndices={[0]}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={() => this.callRefreshControl()}
							title="Pull down to update marker distances..."
							tintColor={theme.lighterOnBackground}
							titleColor={theme.lighterOnBackground}
						/>
					}
				/>
			</View>
		);
	}
}
