// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory

import React, { Component, useState } from "react";
import { View, Text, Dimensions, DeviceEventEmitter } from "react-native";
import { SearchBar } from "@rneui/base";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from 'react-native-picker-select';

import { styles, filterSelectStyles } from "./styles";

import { region, theme } from "./regions";
import GLOBAL from './global.js';

export default class MarkerFilterHeader extends React.Component {
	changeFilter = (f, value) => {
		// Filter favorites
		if (f == "favorites") GLOBAL.filter.favorites = value;
		// Filter by county
		if (f == "county") GLOBAL.filter.county = value;
		// Handle search bar
		if (f == "search") GLOBAL.filter.search = value;
		AsyncStorage.setItem("filter", JSON.stringify(GLOBAL.filter));
		DeviceEventEmitter.emit("event.filterData");
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
					searchIcon={() => {
						return <Ionicons name="search-outline" size={16} color={theme.lighterOnBackground} />;
					}}
					placeholderTextColor={theme.lighterOnBackground}
					round
					onChangeText={(text) => this.changeFilter("search", text)}
					autoCorrect={false}
					value={GLOBAL.filter.search}
				/>
				
				<View style={styles.filterWrapper}>
					<RNPickerSelect
						placeholder={{}}
						onValueChange={(value) => this.changeFilter("favorites", value)}
						value={GLOBAL.filter.favorites}
						style={filterSelectStyles}
						items={[
							{ label: "All Markers", value: 'all' },
							{ label: "My Favorites", value: 'favorites' },
						]}
						useNativeAndroidPickerStyle={false}
						Icon={() => {
							return <Ionicons name="chevron-down-outline" size={16} color={theme.lightOnBackground} />;
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
						value={GLOBAL.filter.county}
						items={GLOBAL.counties}
						useNativeAndroidPickerStyle={false}
						Icon={() => {
							return <Ionicons name="chevron-down-outline" size={16} color={theme.lightOnBackground} />;
						}}
					/>
				</View>
			</View>
		);
	}
}
