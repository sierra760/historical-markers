// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory

import React, { Component, useState } from "react";
import { StyleSheet } from "react-native";

import { theme, region } from "./regions";

export const styles = StyleSheet.create({
	headerTitleStyle: {
		fontFamily: theme.headerFont,
		fontSize: 20 * region.headerMultiplier,
		lineHeight: 20 * region.headerMultiplier * region.headerLineHeightMultiplier,
		color: theme.contrastOnBackground,
		textShadowColor: 'rgba(0, 0, 0, 0.65)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10,
		padding: 10
	},
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
		marginBottom: 20,
		marginTop: 10
	},
	modalHeroFavoriteIcon: {
		fontSize: 28,
		color: theme.contrastOnBackground,
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 5,
		paddingLeft: 5,
		marginLeft: -5
	},
	modalHeroTitle: {
		fontFamily: theme.headerFont,
		fontSize: 28 * region.headerMultiplier,
		color: theme.contrastOnBackground,
		marginBottom: 10,
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 5,
		paddingLeft: 5,
		marginLeft: -5
	},
	modalHeroLocation: {
		fontFamily: theme.subheaderFont,
		color: theme.contrastOnBackground,
		fontSize: 18,
		paddingLeft: 5,
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 5,
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
		paddingLeft: 5,
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 5
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
		color: theme.lighterOnBackground
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
	modalIconWithShadow: {
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 5,
		paddingLeft: 5,
		marginLeft: -5,
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
	modalSpacer: {
		marginBottom: 20
	},
	aboutText: {
		textAlign: "left",
		fontSize: 18,
		lineHeight: 28,
		marginTop: 15,
		color: theme.contrastOnSplashBackground,
		fontFamily: theme.bodyFont,
	},
	aboutLink: {
		textAlign: "left",
		fontSize: 18,
		textDecorationLine: "underline",
		lineHeight: 28,
		marginTop: 15,
		color: theme.contrastOnSplashBackground,
		fontFamily: theme.bodyFont,
	},
	aboutHeading: {
		fontWeight: "bold",
		fontSize: 18 * region.headerMultiplier,
		textShadowColor: 'rgba(0, 0, 0, 0.2)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 5,
		textAlign: "left",
		marginTop: 20,
		textTransform: "uppercase",
		color: theme.contrastOnSplashBackground,
		fontFamily: theme.headerFont,
	},
	aboutImageBox: {
		marginTop: 30,
		paddingTop: 30,
		paddingBottom: 30,
		marginBottom: 10,
		borderTopWidth: 1,
		borderTopColor: theme.contrastOnSplashBackground,
		borderBottomWidth: 1,
		borderBottomColor: theme.contrastOnSplashBackground,
	},
	aboutImageCaption: {
		marginTop: 10,
		textAlign: "left",
		fontSize: 16,
		color: theme.contrastOnSplashBackground,
		fontFamily: theme.bodyFont,
	},
	settingsWrapper: {
		backgroundColor: "rgba(0,0,0,0.15)",
		borderRadius: 16,
		marginTop: 15,
		padding: 20
	},
	settingsProgressBar: {
		borderTopWidth: 1,
		borderTopColor: theme.contrastOnSplashBackground,
		borderBottomWidth: 1,
		borderBottomColor: theme.contrastOnSplashBackground,
		paddingTop: 10,
		paddingBottom: 10,
		marginTop: 20
	},
	settingsProgressLabel: {
		color: theme.contrastOnSplashBackground,
		fontFamily: theme.subheaderFont
	},
	settingsSwitchLabel: {
		flex: 1,
		marginLeft: 10,
		color: theme.contrastOnSplashBackground,
		fontFamily: theme.subheaderFont,
		fontSize: 18
	},
	settingsCaption: {
		flex: 1,
		marginTop: 10,
		paddingTop: 10,
		color: theme.contrastOnSplashBackground,
		fontFamily: theme.subheaderFont,
		fontSize: 16,
		lineHeight: 24
	},
	modalTitle: {
		fontFamily: theme.headerFont,
		fontSize: 32 * region.headerMultiplier,
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
		borderRightColor: theme.lighterOnBackground,
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
		color: theme.lighterOnBackground,
		margin: 5,
		fontFamily: theme.subheaderFont,
		fontSize: 16,
	},
	searchLeftIconContainerStyle: {
		tintColor: theme.lighterOnBackground,
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
		color: theme.lighterOnBackground,
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
	helloWorldTextStyle: {
		fontFamily: "Arial",
		fontSize: 30,
		color: "#ffffff",
		textAlignVertical: "center",
		textAlign: "center",
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
	color: theme.lighterOnBackground,
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
	color: theme.lighterOnBackground,
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
