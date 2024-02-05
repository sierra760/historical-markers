// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of directory

import React, { Component, useState } from "react";
import { View, Text, Dimensions, DeviceEventEmitter } from "react-native";
import { SearchBar } from "@rneui/base";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from 'react-native-picker-select';

import { styles, theme, filterSelectStyles } from "./styles";

export default class MarkerFilterHeader extends React.Component {
	changeFilter = (f, value) => {
		// Filter favorites
		if (f == "favorites") global.filter.favorites = value;
		// Filter by county
		if (f == "county") global.filter.county = value;
		// Handle search bar
		if (f == "search") global.filter.search = value;
		AsyncStorage.setItem("filter", JSON.stringify(global.filter));
		DeviceEventEmitter.emit("event.filterData");
		this.props.applyFilter();
	};

	render() {
		const win = Dimensions.get("window");
		return (
			<View>
				<SearchBar
					placeholder="Search by marker name..."
					containerStyle={styles.searchContainer}
					inputContainerStyle={styles.searchInputContainer}
					inputStyle={styles.searchInputStyle}
					leftIconContainerStyle={styles.searchLeftIconContainerStyle}
					placeholderTextColor={theme.lightOnBackground}
					leftIconColor={theme.lightOnBackground}
					round
					onChangeText={(text) => this.changeFilter("search", text)}
					autoCorrect={false}
					value={global.filter.search}
				/>
				
				<View style={styles.filterWrapper}>
					<RNPickerSelect
						placeholder={{}}
						onValueChange={(value) => this.changeFilter("favorites", value)}
						value={global.filter.favorites}
						style={filterSelectStyles}
						items={[
							{ label: "All Markers", value: 'all' },
							{ label: "My Favorites", value: 'favorites' },
						]}
						useNativeAndroidPickerStyle={false}
						Icon={() => {
							return <Ionicons name="chevron-down-outline" size={16} color={theme.lighterOnBackground} />;
						}}
					/>
					<Text style={styles.filterWrapperCaption}> in </Text>
					<RNPickerSelect
						placeholder={{}}
						style={{...filterSelectStyles,
							inputIOSContainer: {
								width: win.width - filterSelectStyles.inputIOSContainer.width - filterSelectStyles.inputIOS.paddingHorizontal * 2 - 30
							},
							inputAndroidContainer: {
								width: win.width - filterSelectStyles.inputIOSContainer.width - filterSelectStyles.inputIOS.paddingHorizontal * 2 - 5
							}
						}}
						onValueChange={(value) => this.changeFilter("county", value)}
						value={global.filter.county}
						items={global.counties}
						useNativeAndroidPickerStyle={false}
						Icon={() => {
							return <Ionicons name="chevron-down-outline" size={16} color={theme.lighterOnBackground} />;
						}}
					/>
				</View>
			</View>
		);
	}
}
