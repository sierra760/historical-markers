// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of directory

import React, { Component, useState } from "react";
import { StyleSheet, Appearance } from "react-native";

const selectedTheme = Appearance.getColorScheme();

const themes = {
	light: {
		primaryBackground: "#005a9c",
		primaryBackgroundDarker: "#004b83",
		primaryBackgroundDarkest: "#003d69",
		primaryBackgroundLighter: "#0069b6",
		primaryBackgroundLightest: "#0086e9",
		lightOnBackground: "#aed1ea",
		lighterOnBackground: "#d6e8f5",
		contrastOnBackground: "#ffffff",
		splashBackground: "#519fbb",
		listBackground: "#ffffff",
		headerFont: "Rye",
		subheaderFont: "AsapCondensed",
		bodyFont: "EBGaramond",
		bodyHighlight: "#888888",
		bodyHeader: "#666666",
		bodyText: "#444444",
		bodyDark: "#222222",
		highlightedRow: "#dfedf7",
		separatorColor: "#CED0CE",
		modalHeader: "#666666",
	},
	dark: {
		primaryBackground: "#005a9c",
		primaryBackgroundDarker: "#004b83",
		primaryBackgroundDarkest: "#003d69",
		primaryBackgroundLighter: "#0069b6",
		primaryBackgroundLightest: "#0086e9",
		lightOnBackground: "#aed1ea",
		lighterOnBackground: "#d6e8f5",
		contrastOnBackground: "#ffffff",
		splashBackground: "#519fbb",
		listBackground: "#333333",
		headerFont: "Rye",
		subheaderFont: "AsapCondensed",
		bodyFont: "EBGaramond",
		bodyHighlight: "#ababab",
		bodyHeader: "#666666",
		bodyText: "#eeeeee",
		bodyDark: "#efefef",
		highlightedRow: "#666666",
		separatorColor: "#666666",
		modalBackground: "#444444",
		modalHeader: "#aaaaaa"
	}
};

export const theme = themes[selectedTheme];

export const styles = StyleSheet.create({
	map: { height: "100%" },
	listTitle: {
		fontFamily: theme.bodyFont,
		marginBottom: 5,
		fontSize: 22,
		color: theme.bodyDark
	},
	listSubtitle: {
		color: theme.bodyHighlight,
		fontFamily: theme.subheaderFont,
	},
	modalHero: {
		backgroundColor: theme.primaryBackgroundDarker,
	},
	modalHeroBackground: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 40,
		paddingTop: 20,
	},
	modalHeroFavoriteIconWrapper: {
		marginBottom: 20
	},
	modalHeroFavoriteIcon: {
		fontSize: 28,
		color: theme.contrastOnBackground
	},
	modalHeroTitle: {
		fontFamily: theme.headerFont,
		fontSize: 28,
		color: theme.contrastOnBackground,
		marginBottom: 10,
	},
	modalHeroLocation: {
		fontFamily: theme.subheaderFont,
		color: theme.contrastOnBackground,
		fontSize: 18,
		marginLeft: 5
	},
	modalHeroRow: {
		flexDirection: "row",
		alignItems: "left",
		marginTop: 10,
	},
	modalHeroDistance: {
		fontFamily: theme.subheaderFont,
		color: theme.contrastOnBackground,
		fontSize: 18,
		marginLeft: 5
	},
	modalMapContainer: {
		backgroundColor: "white",
		alignItems: "center",
		position: "relative",
		height: 200,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
	},
	modalMap: {
		height: 200,
		width: "100%",
		...StyleSheet.absoluteFillObject,
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "left",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalImageContainer: {
		marginBottom: 35,
	},
	modalImageBox: {
		borderRadius: 16,
		marginLeft: 15,
		marginRight: 15,
		marginTop: 20,
		backgroundColor: theme.listBackground,
		padding: 15,
	},
	modalImageCaption: {
		marginBottom: 5,
		marginTop: 20,
		textAlign: "left",
		fontSize: 20,
		lineHeight: 26,
		color: theme.bodyText,
		fontFamily: theme.bodyFont,
	},
	modalImageSubcaption: {
		marginBottom: 5,
		marginTop: 5,
		textAlign: "left",
		fontSize: 16,
		lineHeight: 18,
		color: theme.bodyText,
		fontFamily: theme.bodyFont,
	},
	modalImageCredit: {
		marginBottom: 5,
		marginTop: 5,
		textAlign: "left",
		fontSize: 12,
		lineHeight: 14,
		color: theme.bodyDark,
		fontFamily: theme.bodyFont,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonTitle: {
		fontFamily: theme.subheaderFont,
		textTransform: "uppercase",
	},
	modalTextContainer: {
		padding: 15,
		marginRight: 15,
		marginLeft: 15,
		marginBottom: 5,
		marginTop: 5,
	},
	aboutScreen: {
		backgroundColor: theme.splashBackground,
	},
	aboutTextContainer: {
		padding: 15,
		marginRight: 15,
		marginLeft: 15,
		marginBottom: 30,
	},
	modalContainer: {
		backgroundColor: theme.modalBackground,
	},
	modalText: {
		textAlign: "left",
		fontSize: 18,
		lineHeight: 26,
		color: theme.bodyText,
		fontFamily: theme.bodyFont,
	},
	modalLink: {
		textAlign: "left",
		fontSize: 18,
		lineHeight: 26,
		marginTop: 15,
		color: theme.bodyText,
		fontFamily: theme.bodyFont,
		textDecorationLine: "underline",
	},
	aboutText: {
		textAlign: "left",
		fontSize: 18,
		lineHeight: 28,
		marginTop: 15,
		color: theme.contrastOnBackground,
		fontFamily: theme.bodyFont,
	},
	aboutLink: {
		textAlign: "left",
		fontSize: 18,
		textDecorationLine: "underline",
		lineHeight: 28,
		marginTop: 15,
		color: theme.contrastOnBackground,
		fontFamily: theme.bodyFont,
	},
	aboutHeading: {
		fontWeight: "bold",
		fontSize: 18,
		textAlign: "left",
		marginTop: 25,
		textTransform: "uppercase",
		color: theme.lighterOnBackground,
		fontFamily: theme.headerFont,
	},
	aboutImageBox: {
		marginTop: 30,
		paddingTop: 30,
		paddingBottom: 30,
		marginBottom: 10,
		borderTopWidth: 1,
		borderTopColor: theme.lighterOnBackground,
		borderBottomWidth: 1,
		borderBottomColor: theme.lighterOnBackground,
	},
	aboutImageCaption: {
		marginTop: 10,
		textAlign: "left",
		fontSize: 16,
		color: theme.lighterOnBackground,
		fontFamily: theme.bodyFont,
	},
	modalTitle: {
		fontFamily: theme.headerFont,
		fontSize: 32,
		marginBottom: 15,
	},
	modalHeading: {
		fontSize: 18,
		marginBottom: 10,
		textAlign: "left",
		textTransform: "uppercase",
		color: theme.modalHeader,
		fontFamily: theme.subheaderFont,
	},
	buttonOuterContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.primaryBackground,
		paddingLeft: 30,
		paddingRight: 30,
		paddingBottom: 5,
		paddingTop: 5,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
	},
	buttonContainer: {
		flex: 1,
	},
	buttonLeft: {
		borderRightColor: theme.contrastOnBackground,
		borderRightWidth: 1,
		marginLeft: -30
	},
	mapTooltipText: {
		fontFamily: theme.subheaderFont,
		fontSize: 20,
		marginRight: 5,
		color: theme.primaryBackgroundDarker,
	},
	filterWrapper: {
		backgroundColor: theme.primaryBackgroundDarker,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 10,
	},
	filterWrapperCaption: {
		color: theme.lightOnBackground,
		margin: 5,
		fontFamily: theme.subheaderFont,
		fontSize: 16,
	},
	searchLeftIconContainerStyle: {
		color: theme.lightOnBackground,
	},
	searchContainer: {
		backgroundColor: theme.primaryBackgroundDarker,
		borderTopWidth: 0, //works
		borderBottomWidth: 0, //works
	},
	searchInputContainer: {
		backgroundColor: theme.primaryBackgroundDarkest,
	},
	searchInputStyle: {
		color: theme.lightOnBackground,
		fontFamily: theme.subheaderFont,
	},
	emptyList: {
		fontWeight: "bold",
		fontSize: 16,
		margin: 20,
		textAlign: "center",
		color: theme.lighterOnBackground,
		fontFamily: theme.subheaderFont,
	},
	listFavorite: {
		backgroundColor: theme.highlightedRow,
	},
	listNonfavorite: {
		backgroundColor: theme.listBackground,
	},
});

export const filterSelectStyles = StyleSheet.create({
  inputIOSContainer: {
  	width: 140
  },
  inputAndroidContainer: {
  	width: 120
  },
  inputIOS: {
  	backgroundColor: theme.primaryBackgroundDarkest,
    fontSize: 16,
	color: theme.lightOnBackground,
	fontFamily: theme.subheaderFont,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    paddingRight: 30,
  },
  inputAndroid: {
    backgroundColor: theme.primaryBackgroundDarkest,
    fontSize: 16,
    lineHeight: 16,
	color: theme.lightOnBackground,
	fontFamily: theme.subheaderFont,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    paddingRight: 30,
  },
  iconContainer: {
	top: 14,
	right: 12,
  }
});
