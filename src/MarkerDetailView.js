// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory

import React, { Component, useState } from "react";
import {
	ScrollView,
	View,
	ImageBackground,
	Text,
	Dimensions,
	Linking,
	TouchableHighlight,
	DeviceEventEmitter
} from "react-native";
import * as Speech from "expo-speech";
import { showLocation } from "react-native-map-link";
import MapView, { Marker } from "react-native-maps";
import { Button } from "@rneui/base";
import { Image } from 'expo-image';
import { Ionicons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';

import { styles } from "./styles";
import { formatDistance, haversine, capitalizeFirstLetter } from "./utils";

import { region, theme } from "./regions";
import GLOBAL from './global.js';

export default class MarkerDetailView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			speechButtonLabel: "Speak",
			lightboxVisible: false,
			lightboxImageIndex: 0
		};
	}

	speakModal = async (title, description) => {
		if ((await Speech.isSpeakingAsync()) == true) this.stopSpeaking();
		else {
			this.setState({ speechButtonLabel: "Stop Speaking" });
			if (region.name == "Nevada") {
				// Because iOS voices can't pronounce "Nevada" correctly without assistance :'( ...
				title = title.replaceAll("Nevada", "Nevadda");
				description = description.replaceAll("Nevada", "Nevadda");
			}
			Speech.speak(title);
			Speech.speak(description, {
				onDone: () => this.stopSpeaking(),
			});
		}
	};

	stopSpeaking = () => {
		this.setState({ speechButtonLabel: "Speak" });
		Speech.stop();
	};

	componentWillUnmount = () => {
		this.stopSpeaking();
	};

	directions = (latitude, longitude) => {
		showLocation({
			latitude: latitude,
			longitude: longitude,
			dialogTitle: "Open in Maps",
			dialogMessage:
				"View the location of this historical marker using an app of your choice.  If you pick an app that supports navigation, you may be able to navigate to this historical marker.",
			cancelText: "Cancel",
		});
	};
	
	toggleFavorite = () => {
		if (GLOBAL.favorites.indexOf(this.props.route.params.properties.marker_id) == -1) {
			GLOBAL.favorites.push(this.props.route.params.properties.marker_id);
		}
		else {
			GLOBAL.favorites = GLOBAL.favorites.filter(
				(item) => item !== this.props.route.params.properties.marker_id,
			);
		}
		AsyncStorage.setItem(
			"favorites",
			JSON.stringify(GLOBAL.favorites),
		);
		this.forceUpdate();
		DeviceEventEmitter.emit("event.filterData");
	};
	
	showLightbox = (i) => {
		this.setState({ lightboxImageIndex: i, lightboxVisible: true })
	}
	
	hideLightbox = () => {
		this.setState({ lightboxVisible: false })
	}
	
	photosVisible = () => {
		if (GLOBAL.images_downloaded == true || GLOBAL.online == true) return true;
		else return false;
	}

	render() {
		const { navigation } = this.props;
		navigation.setOptions({
			title: ``,
		});
		const win = Dimensions.get("window");
		const bgImage =
			this.props.route.params.properties.photos[
				Math.floor(
					Math.random() *
						this.props.route.params.properties.photos.length,
				)
			];
		if (GLOBAL.location != false) {
			let {d, b, bv} = haversine(
				[this.props.route.params.longitude, this.props.route.params.latitude],
				[GLOBAL.location[0], GLOBAL.location[1]]
			);
			this.props.route.params.properties.distance = d;
			this.props.route.params.properties.bearing = b;
			this.props.route.params.properties.bearing_verbose = bv;
		}
		let lightbox_photos = [];
		if (this.photosVisible() == true) {
			if (GLOBAL.images_downloaded == true) img_url_prefix = FileSystem.documentDirectory + region.abbr_lower;
			else img_url_prefix = `http://historical-markers.s3-website-us-west-1.amazonaws.com/${region.abbr_lower}/photos_compressed`;
			this.props.route.params.properties.photos.forEach((photo) => {
				if (GLOBAL.images_downloaded == true) lightbox_photos.push({uri: FileSystem.documentDirectory + `${region.abbr_lower}/${photo.filename}`})
				else lightbox_photos.push({uri: `http://historical-markers.s3-website-us-west-1.amazonaws.com/${region.abbr_lower}/photos_compressed/${photo.filename}`});
			});
			if (this.props.route.params.properties.photos.length > 0) {
				if (GLOBAL.images_downloaded == true) imageSource = {uri: FileSystem.documentDirectory + `${region.abbr_lower}/${bgImage.filename}`};
				else imageSource = {uri: `http://historical-markers.s3-website-us-west-1.amazonaws.com/${region.abbr_lower}/photos_compressed/${bgImage.filename}`};
			}
			else imageSource = 'none';
    	}
    	else imageSource = 'none';
		return (
			<View>
				{this.photosVisible() == true ? (
				<ImageView
					images={lightbox_photos}
					imageIndex={this.state.lightboxImageIndex}
					visible={this.state.lightboxVisible}
					onRequestClose={() => this.hideLightbox()}
				/>
				) : null }
				<ScrollView style={styles.modalContainer} vertical bounces={false}>
					<View style={styles.modalHero}>
						<ImageBackground
							style={styles.modalHeroBackground}
							resizeMode="cover"
							source={imageSource}
							blurRadius={5}
							imageStyle={{ opacity: 0.2 }}
						>
							<View style={styles.modalHeroFavoriteIconWrapper}>
								<TouchableHighlight onPress={this.toggleFavorite} underlayColor={"none"}>
									{GLOBAL.favorites.indexOf(this.props.route.params.properties.marker_id) > -1 ? (
											<Ionicons name="heart" style={styles.modalHeroFavoriteIcon} />
								
									) : (
										<Ionicons name="heart-outline" style={styles.modalHeroFavoriteIcon} />
									)}
								</TouchableHighlight>
							</View>
							<Text style={styles.modalHeroTitle}>
								{this.props.route.params.properties.title}
							</Text>	
							<View style={styles.modalHeroRow}>
								<Ionicons name="location-outline" color={styles.modalHeroLocation.color} size={styles.modalHeroLocation.fontSize} />
								{this.props.route.params.properties.city ? (
									<Text style={styles.modalHeroLocation}>
										{this.props.route.params.properties.city},{" "}
										{this.props.route.params.properties.county}
									</Text>
								) : (
									<Text style={styles.modalHeroLocation}>
										{this.props.route.params.properties.county}
									</Text>
								)}
							</View>
							<View style={styles.modalHeroRow}>
								{this.props.route.params.properties.distance ? (
									<Ionicons name="compass-outline" color={styles.modalHeroLocation.color} size={styles.modalHeroLocation.fontSize} />
								) : null }
								{this.props.route.params.properties.distance ? (
									<Text style={styles.modalHeroDistance}>
										{capitalizeFirstLetter(formatDistance(this.props.route.params.properties.distance))} to your {this.props.route.params.properties.bearing_verbose}
									</Text>
								) : null }
							</View>
						</ImageBackground>
					</View>
					{GLOBAL.online ? (
						<View style={styles.modalMapContainer}>
							<MapView
								style={styles.modalMap}
								mapType={'hybrid'}
								region={{
									latitude: this.props.route.params.latitude,
									longitude: this.props.route.params.longitude,
									latitudeDelta: 0.0025,
									longitudeDelta: 0.0025,
								}}
								scrollEnabled={false}
								showsPointsOfInterest={false}
							>
								<Marker
									key={this.props.route.params.properties.marker_id}
									pinColor={theme.primaryBackground}
									coordinate={{
										latitude: this.props.route.params.latitude,
										longitude: this.props.route.params.longitude,
									}}
								/>
							</MapView>
						</View>
					) : null }
					<View style={styles.buttonOuterContainer}>
						<View style={styles.buttonContainer}>
							<Button
								titleStyle={styles.buttonTitle}
								style={styles.buttonLeft}
								color={theme.primaryBackground}
								icon={{
									name: "directions",
									size: 20,
									color: theme.lighterOnBackground,
								}}
								title="View in Maps"
								onPress={() =>
									this.directions(
										this.props.route.params.latitude,
										this.props.route.params.longitude,
									)
								}
							/>
						</View>
						<View style={styles.buttonContainer}>
							<Button
								titleStyle={styles.buttonTitle}
								color={theme.primaryBackground}
								icon={{
									name: "multitrack-audio",
									size: 20,
									color: theme.lighterOnBackground,
								}}
								title={this.state.speechButtonLabel}
								onPress={() =>
									this.speakModal(
										this.props.route.params.properties.title,
										this.props.route.params.properties
											.description,
									)
								}
							/>
						</View>
					</View>
					{GLOBAL.online == false ? (
						<View style={styles.modalSpacer}></View>
					) : null }
					<View style={styles.modalTextContainer}>
						<Text style={styles.modalHeading}>Description</Text>
						<Text style={styles.modalText}>
							{this.props.route.params.properties.description.trim()}
						</Text>
					</View>
					{this.props.route.params.properties.location_notes ? (
						<View style={styles.modalTextContainer}>
							<Text style={styles.modalHeading}>Location Notes</Text>
							<Text style={styles.modalText}>
								{this.props.route.params.properties.location_notes}
							</Text>
						</View>
					) : (
						<View></View>
					)}
					{this.props.route.params.properties.erected_year ? (
						<View style={styles.modalTextContainer}>
							<Text style={styles.modalHeading}>Year Erected</Text>
							<Text style={styles.modalText}>
								{this.props.route.params.properties.erected_year}
							</Text>
						</View>
					) : (
						<View></View>
					)}
					{this.props.route.params.properties.erected_by ? (
						<View style={styles.modalTextContainer}>
							<Text style={styles.modalHeading}>Erected By</Text>
							<Text style={styles.modalText}>
								{this.props.route.params.properties.erected_by}
							</Text>
						</View>
					) : (
						<View></View>
					)}
					{this.props.route.params.properties.marker_id ? (
						<View style={styles.modalTextContainer}>
							<Text style={styles.modalHeading}>
								Content and Image Source
							</Text>
							<Text style={styles.modalText}>
								All content and images obtained from the Historical
								Marker Database (HMdb.org), where it is identified
								as marker #
								{this.props.route.params.properties.marker_id}.
							</Text>
							<Text
								style={styles.modalLink}
								onPress={() =>
									Linking.openURL(
										`https://www.hmdb.org/m.asp?m=${this.props.route.params.properties.marker_id}`,
									)
								}
							>
								Tap to view the original marker page on HMdb.org.
							</Text>
						</View>
					) : (
						<View></View>
					)}
					{this.photosVisible() == false ? (
						<View style={styles.modalSpacer}></View>
					) : null }
					{this.photosVisible() ? (
						<View style={styles.modalImageContainer}>
							{this.props.route.params.properties.photos.map(
								(photo, i) => (
									<TouchableHighlight onPress={() => this.showLightbox(i)} underlayColor={"none"}>
										<View style={styles.modalImageBox}>
											<View
												style={{
													borderRadius: 16,
													width:
														win.width -
														styles.modalImageBox.marginLeft -
														styles.modalImageBox.marginRight -
														styles.modalImageBox.padding * 2,
													height:
														(win.width -
															styles.modalImageBox
																.marginLeft -
															styles.modalImageBox
																.marginRight -
															styles.modalImageBox.padding *
																2) /
														photo.aspect,
												}}
											>
												<Image
													style={{
														borderRadius: 16,
														width: "100%",
														height: "100%",
													}}
													source={
														`${img_url_prefix}/${photo.filename}` 
													}
													resizeMethod="resize"
													resizeMode="contain"
												/>
											</View>
											{photo.caption ? (
												<Text style={styles.modalImageCaption}>
													{photo.caption}
												</Text>
											) : (
												""
											)}
											{photo.subcaption ? (
												<Text style={styles.modalImageSubcaption}>
													{photo.subcaption}
												</Text>
											) : (
												""
											)}
											{photo.submitted ? (
												<Text style={styles.modalImageCredit}>
													Submitted to HMDB.org: {photo.submitted}
												</Text>
											) : (
												""
											)}
										</View>
									</TouchableHighlight>
								),
							)}
						</View>
					) : null }
				</ScrollView>
			</View>
		);
	}
}
