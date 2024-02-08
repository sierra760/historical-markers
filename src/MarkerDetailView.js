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
	TouchableHighlight
} from "react-native";
import * as Speech from "expo-speech";
import { showLocation } from "react-native-map-link";
import MapView, { Marker } from "react-native-maps";
import { Button } from "@rneui/base";
import { Image } from 'expo-image';
import { Ionicons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "./styles";
import { region, theme } from "./regions";
import { formatDistance, haversine, capitalizeFirstLetter } from "./utils";

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
		if (global.favorites.indexOf(this.props.route.params.properties.marker_id) == -1) {
			global.favorites.push(this.props.route.params.properties.marker_id);
		}
		else {
			global.favorites = global.favorites.filter(
				(item) => item !== this.props.route.params.properties.marker_id,
			);
		}
		AsyncStorage.setItem(
			"favorites",
			JSON.stringify(global.favorites),
		);
		this.forceUpdate();
		this.props.route.params.updateLastView();
	};
	
	showLightbox = (i) => {
		this.setState({ lightboxImageIndex: i, lightboxVisible: true })
	}
	
	hideLightbox = () => {
		this.setState({ lightboxVisible: false })
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
		if (global.location != false) {
			let {d, b, bv} = haversine(
				[this.props.route.params.longitude, this.props.route.params.latitude],
				[global.location[0], global.location[1]]
			);
			this.props.route.params.properties.distance = d;
			this.props.route.params.properties.bearing = b;
			this.props.route.params.properties.bearing_verbose = bv;
		}
		let lightbox_photos = [];
		this.props.route.params.properties.photos.forEach((photo) => {
    		lightbox_photos.push(this.props.route.params.properties.images[photo.filename]);
    	});
    	if (this.props.route.params.properties.photos.length > 0) imageSource = this.props.route.params.properties.images[bgImage.filename];
    	else imageSource = 'none';
		return (
			<View>
				<ImageView
					images={lightbox_photos}
					imageIndex={this.state.lightboxImageIndex}
					visible={this.state.lightboxVisible}
					onRequestClose={() => this.hideLightbox()}
				/>
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
									{global.favorites.indexOf(this.props.route.params.properties.marker_id) > -1 ? (
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
					{global.online ? (
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
									color: "#fff",
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
									color: "#fff",
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
													this.props.route.params.properties
														.images[photo.filename]
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
				</ScrollView>
			</View>
		);
	}
}
