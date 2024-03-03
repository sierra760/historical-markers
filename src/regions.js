// Copyright (c) 2024 Sierra Burkhart
// License: GNU General Public License version 3 (GPLv3)
// See full license text in file "LICENSE" at root of project directory
import { selectedRegion } from '../app-region.js'
import { Appearance } from "react-native";

const selectedTheme = Appearance.getColorScheme();

// Attributes for all available regions
const regions = {
	nv: {
		name: "Nevada",
		abbr: "NV",
		abbr_lower: "nv",
		nickname: "Silver State",
		statewideMapExtent: {lat_min: 35.003, lat_max: 42.003, lon_min: -120.0037, lon_max: -114.0436},
		aboutSplashWidth: 0.784828244274809,
		downloadSize: '360 MB',
		headerMultiplier: 1.1,
		headerLineHeightMultiplier: 1.1,
		light: {
			activeTabBackground: "#005a9c",
			primaryBackground: "#005a9c",
			primaryBackgroundDarker: "#004b83",
			primaryBackgroundDarkest: "#003d69",
			primaryBackgroundLighter: "#0069b6",
			primaryBackgroundLightest: "#0086e9",
			lightOnBackground: "#aed1ea",
			lighterOnBackground: "#d6e8f5",
			contrastOnBackground: "#d6e8f5",
			contrastOnSplashBackground: "#ffffff",
			splashBackground: "#004b83",
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
			switchActiveColor: "#0069b6"
		},
		dark: {
			activeTabBackground: "#aed1ea",
			primaryBackground: "#005a9c",
			primaryBackgroundDarker: "#004b83",
			primaryBackgroundDarkest: "#003d69",
			primaryBackgroundLighter: "#0069b6",
			primaryBackgroundLightest: "#0086e9",
			lightOnBackground: "#aed1ea",
			lighterOnBackground: "#d6e8f5",
			contrastOnBackground: "#d6e8f5",
			contrastOnSplashBackground: "#ffffff",
			splashBackground: "#004b83",
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
			modalHeader: "#aaaaaa",
			switchActiveColor: "#0069b6"
		}
	},
	nm: {
		name: "New Mexico",
		abbr: "NM",
		abbr_lower: "nm",
		nickname: "Land of Enchantment",
		statewideMapExtent: {lat_min: 31.3337, lat_max: 36.9982, lon_min: -109.0489, lon_max: -103.0023},
		aboutSplashWidth: 0.657919847328244,
		downloadSize: '427 MB',
		headerMultiplier: 1.15,
		headerLineHeightMultiplier: 1.0,
		light: {
			activeTabBackground: "#3891a4",
			primaryBackground: "#06768d",
			primaryBackgroundDarker: "#055e71",
			primaryBackgroundDarkest: "#033b47",
			primaryBackgroundLighter: "#3891a4",
			primaryBackgroundLightest: "#83bbc6",
			lightOnBackground: "#C9E1E6",
			lighterOnBackground: "#E0EDF0",
			contrastOnBackground: "#E0EDF0",
			contrastOnSplashBackground: "#232622",
			splashBackground: "#b1bfae",
			listBackground: "#ffffff",
			headerFont: "BigshotOne",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#888888",
			bodyHeader: "#666666",
			bodyText: "#444444",
			bodyDark: "#222222",
			highlightedRow: "#E0EDF0",
			separatorColor: "#CED0CE",
			modalHeader: "#666666",
			switchActiveColor: "#D8DFD6"
		},
		dark: {
			activeTabBackground: "#3891a4",
			primaryBackground: "#06768d",
			primaryBackgroundDarker: "#055e71",
			primaryBackgroundDarkest: "#033b47",
			primaryBackgroundLighter: "#3891a4",
			primaryBackgroundLightest: "#83bbc6",
			lightOnBackground: "#C9E1E6",
			lighterOnBackground: "#E0EDF0",
			contrastOnBackground: "#E0EDF0",
			contrastOnSplashBackground: "#232622",
			splashBackground: "#b1bfae",
			listBackground: "#333333",
			headerFont: "BigshotOne",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#ababab",
			bodyHeader: "#666666",
			bodyText: "#eeeeee",
			bodyDark: "#efefef",
			highlightedRow: "#666666",
			separatorColor: "#666666",
			modalBackground: "#444444",
			modalHeader: "#aaaaaa",
			switchActiveColor: "#D8DFD6"
		}
	},
	ca: {
		name: "California",
		abbr: "CA",
		abbr_lower: "ca",
		nickname: "Golden State",
		aboutSplashWidth: 0.647900763358779,
		downloadSize: '4.98 GB',
		statewideMapExtent: {lat_min: 32.5121, lat_max: 42.0126, lon_min: -124.6509, lon_max: -114.1315},
		headerMultiplier: 1.15,
		headerLineHeightMultiplier: 1.2,
		light: {
			activeTabBackground: "#2774AE",
			primaryBackground: "#2774AE",
			primaryBackgroundDarker: "#005587",
			primaryBackgroundDarkest: "#003B5C",
			primaryBackgroundLighter: "#8BB8E8",
			primaryBackgroundLightest: "#DAEBFE",
			lightOnBackground: "#bed5e7",
			lighterOnBackground: "#d4e3ef",
			contrastOnBackground: "#ffffff",
			contrastOnSplashBackground: "#444444",
			splashBackground: "#b6d6e2",
			listBackground: "#ffffff",
			headerFont: "Pacifico",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#888888",
			bodyHeader: "#666666",
			bodyText: "#444444",
			bodyDark: "#222222",
			highlightedRow: "#fffae6",
			separatorColor: "#CED0CE",
			modalHeader: "#666666",
			switchActiveColor: "#d6e8f5"
		},
		dark: {
			activeTabBackground: "#8BB8E8",
			primaryBackground: "#2774AE",
			primaryBackgroundDarker: "#005587",
			primaryBackgroundDarkest: "#003B5C",
			primaryBackgroundLighter: "#8BB8E8",
			primaryBackgroundLightest: "#DAEBFE",
			lightOnBackground: "#bed5e7",
			lighterOnBackground: "#d4e3ef",
			contrastOnBackground: "#fffae6",
			contrastOnSplashBackground: "#444444",
			splashBackground: "#b6d6e2",
			listBackground: "#333333",
			headerFont: "Pacifico",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#ababab",
			bodyHeader: "#666666",
			bodyText: "#eeeeee",
			bodyDark: "#efefef",
			highlightedRow: "#666666",
			separatorColor: "#666666",
			modalBackground: "#444444",
			modalHeader: "#aaaaaa",
			switchActiveColor: "#d6e8f5"
		}
	},
	co: {
		name: "Colorado",
		abbr: "CO",
		abbr_lower: "co",
		nickname: "Centennial State",
		downloadSize: '512 MB',
		statewideMapExtent: {lat_min: 36.9949, lat_max: 41.0006, lon_min: -109.0489, lon_max: -102.0424},
		aboutSplashWidth: 0.68344465648855,
		headerMultiplier: 0.9,
		headerLineHeightMultiplier: 1.15,
		light: {
			activeTabBackground: "#2d6952",
			primaryBackground: "#2d6952",
			primaryBackgroundDarker: "#245442",
			primaryBackgroundDarkest: "#173529",
			primaryBackgroundLighter: "#6c9686",
			primaryBackgroundLightest: "#abc3ba",
			lightOnBackground: "#eef3f1",
			lighterOnBackground: "#f5f8f7",
			contrastOnBackground: "#f9f6ee",
			contrastOnSplashBackground: "#444444",
			splashBackground: "#fff4dc",
			listBackground: "#ffffff",
			headerFont: "Ultra",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#888888",
			bodyHeader: "#666666",
			bodyText: "#444444",
			bodyDark: "#222222",
			highlightedRow: "#eaf0ee",
			separatorColor: "#CED0CE",
			modalHeader: "#666666",
			switchActiveColor: "#f5f2ec"
		},
		dark: {
			activeTabBackground: "#abc3ba",
			primaryBackground: "#2d6952",
			primaryBackgroundDarker: "#245442",
			primaryBackgroundDarkest: "#173529",
			primaryBackgroundLighter: "#6c9686",
			primaryBackgroundLightest: "#abc3ba",
			lightOnBackground: "#eef3f1",
			lighterOnBackground: "#f5f8f7",
			contrastOnBackground: "#FDFBF8",
			contrastOnSplashBackground: "#fff4dc",
			splashBackground: "#514d46",
			listBackground: "#333333",
			headerFont: "Ultra",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#ababab",
			bodyHeader: "#666666",
			bodyText: "#eeeeee",
			bodyDark: "#efefef",
			highlightedRow: "#555555",
			separatorColor: "#666666",
			modalBackground: "#444444",
			modalHeader: "#aaaaaa",
			switchActiveColor: "#9C8546"
		}
	},
	az: {
		name: "Arizona",
		abbr: "AZ",
		abbr_lower: "az",
		nickname: "Grand Canyon State",
		downloadSize: '606 MB',
		headerMultiplier: 1.1,
		headerLineHeightMultiplier: 1.25,
		statewideMapExtent: {lat_min: 31.3325, lat_max: 37.0004, lon_min: -114.8126, lon_max: -109.0475},
		aboutSplashWidth: 0.704914122137405,
		light: {
			activeTabBackground: "#9c322f",
			primaryBackground: "#9c322f",
			primaryBackgroundDarker: "#7C2825",
			primaryBackgroundDarkest: "#5D1E1C",
			primaryBackgroundLighter: "#0069b6",
			primaryBackgroundLightest: "#0086e9",
			lightOnBackground: "#fef6d4",
			lighterOnBackground: "#FFFBED",
			contrastOnBackground: "#FFFBED",
			contrastOnSplashBackground: "#232622",
			splashBackground: "#c9b9af",
			listBackground: "#ffffff",
			headerFont: "BioRhyme",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#888888",
			bodyHeader: "#666666",
			bodyText: "#444444",
			bodyDark: "#222222",
			highlightedRow: "#FFFBED",
			separatorColor: "#CED0CE",
			modalHeader: "#666666",
			switchActiveColor: "#fef6d4"
		},
		dark: {
			activeTabBackground: "#fef6d4",
			primaryBackground: "#9c322f",
			primaryBackgroundDarker: "#7C2825",
			primaryBackgroundDarkest: "#5D1E1C",
			primaryBackgroundLighter: "#0069b6",
			primaryBackgroundLightest: "#0086e9",
			lightOnBackground: "#fef6d4",
			lighterOnBackground: "#FFFBED",
			contrastOnBackground: "#FFFBED",
			contrastOnSplashBackground: "#232622",
			splashBackground: "#c9b9af",
			listBackground: "#333333",
			headerFont: "BioRhyme",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#ababab",
			bodyHeader: "#666666",
			bodyText: "#eeeeee",
			bodyDark: "#efefef",
			highlightedRow: "#666666",
			separatorColor: "#666666",
			modalBackground: "#444444",
			modalHeader: "#aaaaaa",
			switchActiveColor: "#fef6d4"
		}
	},
	mt: {
		name: "Montana",
		abbr: "MT",
		abbr_lower: "mt",
		nickname: "Treasure State",
		downloadSize: '552 MB',
		headerMultiplier: 1.0,
		headerLineHeightMultiplier: 1.35,
		statewideMapExtent: {lat_min: 44.3563, lat_max: 48.9991, lon_min: -116.0458, lon_max: -104.0186},
		aboutSplashWidth: 0.611402671755725,
		light: {
			activeTabBackground: "#335087",
			primaryBackground: "#335087",
			primaryBackgroundDarker: "#29406c",
			primaryBackgroundDarkest: "#1f3051",
			primaryBackgroundLighter: "#0069b6",
			primaryBackgroundLightest: "#0086e9",
			lightOnBackground: "#aed1ea",
			lighterOnBackground: "#d6e8f5",
			contrastOnBackground: "#d6e8f5",
			contrastOnSplashBackground: "#ffffff",
			splashBackground: "#44a1a1",
			listBackground: "#ffffff",
			headerFont: "Bevan",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#888888",
			bodyHeader: "#666666",
			bodyText: "#444444",
			bodyDark: "#222222",
			highlightedRow: "#d6dce7",
			separatorColor: "#CED0CE",
			modalHeader: "#666666",
			switchActiveColor: "#8EC6C6"
		},
		dark: {
			activeTabBackground: "#839dd0",
			primaryBackground: "#335087",
			primaryBackgroundDarker: "#29406c",
			primaryBackgroundDarkest: "#1f3051",
			primaryBackgroundLighter: "#0069b6",
			primaryBackgroundLightest: "#0086e9",
			lightOnBackground: "#aed1ea",
			lighterOnBackground: "#d6e8f5",
			contrastOnBackground: "#d6e8f5",
			contrastOnSplashBackground: "#ffffff",
			splashBackground: "#519fbb",
			listBackground: "#333333",
			headerFont: "Bevan",
			subheaderFont: "AsapCondensed",
			bodyFont: "EBGaramond",
			bodyHighlight: "#ababab",
			bodyHeader: "#666666",
			bodyText: "#eeeeee",
			bodyDark: "#efefef",
			highlightedRow: "#666666",
			separatorColor: "#666666",
			modalBackground: "#444444",
			modalHeader: "#aaaaaa",
			switchActiveColor: "#8EC6C6"
		}
	},
}

export const region = regions[selectedRegion];
export let theme = regions[selectedRegion][selectedTheme];