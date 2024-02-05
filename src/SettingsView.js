// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of directory

import React, { Component, useState } from "react";
import { ScrollView, View, Image, Text, Dimensions, Linking } from "react-native";

import { styles, theme } from "./styles";

export default class SettingsView extends React.Component {
	render() {
		const win = Dimensions.get("window");
		return (
			<ScrollView style={styles.aboutScreen} bounces={false}>
				<Image
					style={{
						width: win.width,
						height: win.width * 0.912109375,
					}}
					source={require("../assets/nevada/splash-small.png")}
				/>
				<View style={styles.aboutTextContainer}>
					<Text style={styles.aboutHeading}>About This App</Text>
					<Text style={styles.aboutText}>Nevada Historical Markers is a free app that allows you to locate and learn about the nearly one thousand historical markers that have been placed throughout the U.S. state of Nevada. Historical markers serve as tangible links to the past, providing educational insights about historical events, figures, and places. By reading these markers, you can learn many things about Nevada history, including about significant events that occurred throughout the state's history and notable individuals associated with the state.</Text>
					<Text style={styles.aboutText}>This app is meant to be a travel companion as you explore the the state of Nevada, as well as an educational tool. You can explore historical markers in a list or on a map, and by tapping on any marker's title, you can view the marker's inscription and location, and oftentimes even see several photos of the marker and its surrounding location. Markers can be filtered by name, county, and whether you have saved the marker as one of your favorites.</Text>
					<Text style={styles.aboutText}>The vast majority of the information about the historical markers in this app was derived from The Historical Marker Database (HMdb.org) under the terms of the HMdb.org content license. Marker information and images posted to HMdb.org are the property of HMdb.org and/or the users who contributed content to that website. Users must be aware that the developer has not verified the accuracy or quality of information obtained from external sources, and the developer is not responsible for any aspect of content created and/or owned by other parties, including but not limited to inaccuracies, errors, and omissions.</Text>
					<Text style={styles.aboutLink} onPress={() => Linking.openURL("https://www.hmdb.org/copyright.asp")}>
						Most of the content presented within this app is being used under the terms of the copyright license posted by the Historical Marker Database (HMdb.org). More information about HMdb.org's content ownership and copyright policy can be found here.
					</Text>
					<Text style={styles.aboutText}>Aside from system fonts, the fonts and typefaces used in this app, including Rye (major headings), Asap Condensed (minor headings and filters), and EB Garamond (body text) are licensed under the terms of the SIL Open Font License.  These fonts are bundled with this application and are also available for download from Google Fonts as well as this application's GitHub repository.
					</Text>
					<Text style={styles.aboutLink} onPress={() => Linking.openURL("https://openfontlicense.org/documents/OFL.txt")}>Tap here to view the full text of the SIL Open Font license that governs the use of the bundled fonts.  The idential full text of the SIL license also accompanies the font files in this application's GitHub repository.
					</Text>
					<Text style={styles.aboutText}>Given that cellular service remains sparse in many parts of rural Nevada, the app is designed to be fully functional even without a cellular signal or Internet connection. All marker content and images are stored on your device and will remain accessible even if your device is offline, but maps may be less detailed or hidden altogether while your device is offline.</Text>
					<Text style={styles.aboutText}>Nevada Historical Markers is the first in a series of state historical marker applications developed by Dr. Sierra Burkhart, Nevada history enthusiast and the Academic Director of UCLA Geospatial. This app is and always will be free to use, and its source code is available for download on Github.</Text>
					<Text style={styles.aboutLink} onPress={() => Linking.openURL("mailto:sierra@sierraburkhart.com")}>
						Please feel free to contact the developer to share any comments, ideas, corrections, or bug reports: sierra@sierraburkhart.com
					</Text>
					<Text style={styles.aboutText}>Enjoy, and happy travels throughout the beautiful Silver State!</Text>
					<View style={styles.aboutImageBox}>
						<Image
							style={{
								borderRadius: 16,
								width: win.width -
									styles.aboutTextContainer.marginLeft -
									styles.aboutTextContainer.marginRight -
									styles.aboutTextContainer.padding * 2,
								height:
									(win.width -
										styles.aboutTextContainer
											.marginLeft -
										styles.aboutTextContainer
											.marginRight -
										styles.aboutTextContainer.padding *
											2) /
									0.75,
							}}
							source={require('../assets/nevada/developer.jpg')}
							resizeMethod="resize"
							resizeMode="contain"
						/>
						<Text style={styles.aboutImageCaption}>
							Your developer while touring the Historic Fourth Ward School Museum in Virginia City, Storey County.
						</Text>
				</View>
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
			</ScrollView>
		);
	}
}