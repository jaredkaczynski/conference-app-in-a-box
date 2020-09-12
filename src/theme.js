import {Platform, Dimensions} from 'react-native'

const dimensions = Dimensions.get('window');
const logo = require('./assets/logo.jpg');

const primary = 'rgba(0, 255, 153, 0.6)';
const primaryLight = '#00bd71';
const primaryDark = '#009655';
const primaryOpaque = opacity => `rgba(18, 25, 50, ${opacity})`;

const primaryText = 'white';

const highlight = '#61dafb';

const colors = {
    primary,
    highlight,
    primaryLight,
    primaryDark,
    primaryOpaque,
    primaryText
};

const typography = {
    primary: "Gotham Rounded",
    secondary: "Gotham Rounded",
    medium: "GothamRnd Medium",
    bold: "Gotham Bold"
};


export {
    colors,
    typography,
    dimensions,
    logo
}