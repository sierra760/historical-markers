// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory

import React, { Component, useState } from "react";
import { ScrollView, View, Image, Text, Switch, Dimensions, Linking, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
import { unzip } from "react-native-zip-archive";

import { friendlyFileSize } from "./utils";
import { styles } from "./styles";

import { region, theme } from "./regions";
import GLOBAL from './global.js';

export default class SettingsView extends React.Component {

	constructor(props) {
		super(props);
		this.download = null;
		this.update_counter = 0;
		this.state = {
			progress: null,
			deviceOnline: GLOBAL.online
		};
		GLOBAL.settingsScreen = this;
	}
	
	setImagesDownloaded = (status) => {
		AsyncStorage.setItem("images_downloaded", JSON.stringify(status));
		GLOBAL.images_downloaded = status;
		this.download = null;
		this.setState({progress: null});
	}
	
	setDownloadImages = (status) => {
		AsyncStorage.setItem("download_images", JSON.stringify(status));
		GLOBAL.download_images = status;
	}

	downloadProgressUpdate = (downloadProgress) => {
		if (this.update_counter % 50 == 0) this.setState({progress: downloadProgress});
		this.update_counter += 1;
	}
	
	handleDownloadError = (e) => {
		this.download = null;
		this.setState({progress: 'error'});
	}
	
	unzipAndFinishDownload = (uri, destination) => {
		unzip(uri, destination)
			.then((path) => {
				FileSystem.deleteAsync(destination + 'images.zip');
				// After download and decompress, flag completion
				this.setImagesDownloaded(true);
			})
	}

	toggleImageDownload = async(value) => {
		// Save setting before proceeding
		this.setDownloadImages(value);
		// Executed when switch is toggled on
		if (GLOBAL.download_images == true) {
			this.forceUpdate();
			// Download region's image archive
			if (GLOBAL.images_downloaded == false && this.download == null) {
				try {
					this.download = FileSystem.createDownloadResumable(
						`http://historical-markers.s3-website-us-west-1.amazonaws.com/downloads/${region.abbr_lower}.zip`,
						FileSystem.documentDirectory + 'images.zip',
						{},
						this.downloadProgressUpdate
					);
					this.download.downloadAsync()
						.then(({ uri }) => {
							this.setState({progress: 'unzip'});
							this.unzipAndFinishDownload(uri, FileSystem.documentDirectory)
						})
				}
				catch (e) {
					this.handleDownloadError(e);
				}
			}
		}
		
		// Executed when switch is toggled off
		else {
			// If there is an active download, cancel it 
			if (this.download != null) {
				this.download.cancelAsync();
				FileSystem.deleteAsync(FileSystem.documentDirectory + 'images.zip');
				this.setImagesDownloaded(false);
			}
			if (GLOBAL.images_downloaded == true) {
				Alert.alert('Delete all downloaded images?',`All available photos of historical markers in ${region.name} are currently stored on your device.  Storing images on your device lets you view them even if your device is offline.  If you choose to proceed, all marker images will be removed from your device and approximately ${region.downloadSize} of storage will be freed.  You will still be able to view images of historical markers as long as your device is online.`,
				[
					{
						text: 'Yes, Delete All',
						onPress: () => {
							FileSystem.deleteAsync(FileSystem.documentDirectory + `${region.abbr_lower}/`);
							this.setImagesDownloaded(false);
							this.forceUpdate();
						}
					},
					{
						text: 'No, Cancel Deletion',
						onPress: () => {
							this.setDownloadImages(true);
							this.forceUpdate();
						}
					},
				]
				)
			}
		}
	};
	
	componentDidMount = async() => {
		if (GLOBAL.download_images == true && GLOBAL.images_downloaded == false) this.toggleImageDownload(true);
	}

	render() {
		const win = Dimensions.get("window");
		return (
			<ScrollView style={styles.aboutScreen} bounces={false}>
				<Image
					style={{
						width: win.width,
						height: win.width * region.aboutSplashWidth,
					}}
					source={require("../assets/current/splash-small.png")}
				/>
				<View style={styles.aboutTextContainer}>
					<Text style={styles.aboutHeading}>Settings</Text>
					<View style={styles.settingsWrapper}>
						<View style={{ flexDirection: 'row' }}>
							<Switch
								style={{marginTop: 5}}
								disabled={GLOBAL.online == false}
								trackColor={{false: theme.primaryBackgroundDarkest, true: theme.switchActiveColor}}
								ios_backgroundColor={'rgba(0,0,0,0.25)'}
								value={GLOBAL.download_images}
								onValueChange={(value) => this.toggleImageDownload(value)}
							/>
							<Text style={styles.settingsSwitchLabel}>Store Marker Photos on Device{"\n"}({region.downloadSize} storage required)</Text>
						</View>
						{GLOBAL.online == false
							?	<View style={styles.settingsProgressBar}>
									<Text style={styles.settingsProgressLabel}>Your device is currently offline.  This setting can be changed only when your device is online.</Text>
								</View>
							: null
						}
						{this.state.progress != null && this.state.progress != 'unzip'
							?	<View style={styles.settingsProgressBar}>
									<Text style={styles.settingsProgressLabel}>{friendlyFileSize(this.state.progress.totalBytesWritten)} of {friendlyFileSize(this.state.progress.totalBytesExpectedToWrite)} transferred ({Math.round(this.state.progress.totalBytesWritten / this.state.progress.totalBytesExpectedToWrite * 1000) / 10}%)</Text>
								</View>
							: null
						}
						{this.state.progress == 'error'
							?	<View style={styles.settingsProgressBar}>
									<Text style={styles.settingsProgressLabel}>An error occurred while downloading and processing the marker photos.  Toggle the switch above to reattempt.</Text>
								</View>
							: null
						}
						{this.state.progress == 'unzip'
							?	<View style={styles.settingsProgressBar}>
									<Text style={styles.settingsProgressLabel}>Processing downloading images...</Text>
								</View>
							: null
						}
						{GLOBAL.images_downloaded == true
							?	<View style={styles.settingsProgressBar}>
									<Text style={styles.settingsProgressLabel}>All marker images are currently stored on your device.</Text>
								</View>
							: null
						}
						<View>
							<Text style={styles.settingsCaption}>Storing all of the available historical marker images on your device ensures that you can view the images even while your device is offline.  If this option is not enabled, images of historical markers will only be visible if your device is online.  This option is recommended if you plan to use {region.name} Historical Markers in rural areas with limited connectivity.</Text>
						</View>
					</View>
				</View>
				<View style={styles.aboutTextContainer}>
					<Text style={styles.aboutHeading}>About This App</Text>
					<Text style={styles.aboutText}>{region.name} Historical Markers is a free app that allows you to locate and learn about the many historical markers that have been placed throughout the U.S. state of {region.name}. Historical markers serve as tangible links to the past, providing educational insights about historical events, figures, and places. By reading these markers, you can learn many things about {region.name} history, including about significant events that occurred throughout the state's history and notable individuals associated with the state.</Text>
					<Text style={styles.aboutText}>This app is meant to be a travel companion as you explore the state of {region.name}, as well as an educational tool. You can explore historical markers in a list or on a map, and by tapping on any marker's title, you can view the marker's inscription and location, and oftentimes even see several photos of the marker and its surrounding location. Markers can be filtered by name, county, and whether you have saved the marker as one of your favorites.</Text>
					<Text style={styles.aboutText}>The vast majority of the information about the historical markers in this app was derived from The Historical Marker Database (HMdb.org) under the terms of the HMdb.org content license. Marker information and images posted to HMdb.org are the property of HMdb.org and/or the users who contributed content to that website. Users must be aware that the developer has not verified the accuracy or quality of information obtained from external sources, and the developer is not responsible for any aspect of content created and/or owned by other parties, including but not limited to inaccuracies, errors, and omissions.</Text>
					<Text style={styles.aboutLink} onPress={() => Linking.openURL("https://www.hmdb.org/copyright.asp")}>
						Most of the content presented within this app is being used under the terms of the copyright license posted by the Historical Marker Database (HMdb.org). More information about HMdb.org's content ownership and copyright policy can be found here.
					</Text>
					<Text style={styles.aboutText}>Aside from system fonts, the fonts and typefaces used in this app are licensed under the terms of the SIL Open Font License.  These fonts are bundled with this application and are also available for download from Google Fonts as well as this application's GitHub repository.
					</Text>
					<Text style={styles.aboutLink} onPress={() => Linking.openURL("https://openfontlicense.org/documents/OFL.txt")}>Tap here to view the full text of the SIL Open Font license that governs the use of the bundled fonts.  The identical full text of the SIL license also accompanies the font files in this application's GitHub repository.
					</Text>
					<Text style={styles.aboutText}>Given that cellular service remains sparse in many parts of rural {region.name}, the app is designed to be fully functional even without a cellular signal or Internet connection. All marker content and images are stored on your device and will remain accessible even if your device is offline, but maps may be less detailed or hidden altogether while your device is offline.</Text>
					<Text style={styles.aboutText}>{region.name} Historical Markers is the first in a series of state historical marker applications developed by Dr. Sierra Burkhart, {region.name} history enthusiast and the Academic Director of UCLA Geospatial. This app is and always will be free to use, and its source code is available for download on Github.</Text>
					<Text style={styles.aboutLink} onPress={() => Linking.openURL("mailto:sierra@sierraburkhart.com")}>
						Please feel free to contact the developer to share any comments, ideas, corrections, or bug reports: sierra@sierraburkhart.com
					</Text>
					<Text style={styles.aboutText}>Enjoy, and happy travels throughout the beautiful {region.nickname}!</Text>
					<Text style={styles.aboutHeading}>Terms of Use</Text>
					<Text style={styles.aboutText}>Owing to the licensing of content contained within the application, nearly all of which has been derived from the Historical Markers Database (HMdb.org), commercial use of the content contained within this application is strictly prohibited. No exceptions to this commercial use prohibition are possible as the marker information and images presented in this application are the property of HMdb.org and its contributors.  The developer is not responsible for any consequences to the user related to the use or misuse of this application, including (but not limited to) any actions taken by the user related to information presented within this application. In other words, by using this application you agree that you are solely responsible for knowing how to safely use this application.</Text>
					<Text style={styles.aboutText}>The source code of this application, excluding all historical marker content which is the property of HMdb.org and its contributors, is licensed using the GNU General Public License version 3 (GPLv3) to ensure that it and any derivative products remain free and open-source software (FOSS).  This license choice reflects a commitment to the principles of open collaboration and the protection of user freedoms.</Text>
					<Text style={styles.aboutText}>Copyright © 2024, Sierra Burkhart</Text>
					<Text style={styles.aboutText}>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.</Text>
					<Text style={styles.aboutText}>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.</Text>
					<Text style={styles.aboutLink} onPress={() => Linking.openURL("https://www.gnu.org/licenses/gpl-3.0-standalone.html")}>
						See the GNU General Public License for more details.
					</Text>
				</View>
				<View style={styles.modalSpacer}></View>
			</ScrollView>
		);
	}
}