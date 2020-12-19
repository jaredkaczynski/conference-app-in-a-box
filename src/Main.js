import React from 'react'
import {View, Image, StyleSheet} from 'react-native'
import {createAppContainer} from 'react-navigation'
import {Hub, Auth, API, graphqlOperation} from 'aws-amplify'
import {withAuthenticator} from 'aws-amplify-react-native'
import AmplifyTheme from 'aws-amplify-react-native/src/AmplifyTheme'
import {FontAwesome} from '@expo/vector-icons'

import Profile from './Profile'
import Map from './Map'

import {colors, logo} from './theme'
import {createBottomTabNavigator} from "react-navigation-tabs";
import * as Font from "expo-font";
import MySchedule from "./MySchedule";
import Schedule from "./Schedule";
import {getUser} from "./graphql/queries";
import {createUser} from "./graphql/mutations";

const TabNavigator = createBottomTabNavigator({
    Schedule: {
        screen: Schedule
    },
    MySchedule: {
        screen: MySchedule
    },
    Profile: {
        screen: Profile
    },
    Map: {
        screen: Map,
    }
}, {
    animationEnabled: true,
    tabBarOptions: {
        activeTintColor: colors.highlight,
        inactiveTintColor: '#fafafa',
        style: {
            backgroundColor: colors.primary
        }
    },
    defaultNavigationOptions: ({navigation}) => ({
        tabBarIcon: ({tintColor}) => {
            const {routeName} = navigation.state
            if (routeName === 'Schedule') {
                return <FontAwesome color={tintColor} size={20} name='calendar'/>
            }
            if (routeName === 'Map') {
                return <FontAwesome color={tintColor} size={20} name='map'/>
            }
            return <FontAwesome color={tintColor} size={20} name='user'/>
        }
    })
})

class TabNavWithProps extends React.Component {
    async componentDidMount() {
        Font.loadAsync({
            'Gotham Rounded': require('./assets/fonts/GothamRnd-Light.otf'),
            'GothamRnd Medium': require('./assets/fonts/GothamRnd-Medium.otf'),
            'Gotham Bold': require('./assets/fonts/GothamRnd-Bold.otf')
        });
        const user = await Auth.currentSession();
        const username = user["accessToken"]["payload"]["username"];
        const subscribedTalkData = await API.graphql(graphqlOperation(getUser, {id: username}));
        var talks = [];
        try {
            talks = subscribedTalkData.data.talks;
            console.log(talks)
            if (talks === undefined) {
                throw DOMException
            }
        } catch (e) {
            console.log("No User Created")
            try {
                await API.graphql(graphqlOperation(createUser, {
                    input: {
                        id: username,
                    }
                }))
            } catch (err) {
                console.log('error: ', err)
            }
        }
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else {
            await Notification.requestPermission();
            console.log("Notification Requested");

        }
    }

    static router = TabNavigator.router

    render() {
        return (
            <TabNavigator screenProps={{...this.props}} {...this.props}  />
        )
    }
}

const App = createAppContainer(TabNavWithProps)

const theme = {
    ...AmplifyTheme,
    button: {
        ...AmplifyTheme.button,
        backgroundColor: colors.primaryLight
    },
    sectionFooterLink: {
        ...AmplifyTheme.sectionFooterLink,
        color: colors.primaryLight
    },
    buttonDisabled: {
        ...AmplifyTheme.buttonDisabled,
        backgroundColor: colors.primaryOpaque(0.6)
    }
}

class AppWithAuth extends React.Component {
    state = {
        signedIn: true
    }

    async componentDidMount() {
        try {
            await Auth.currentAuthenticatedUser()
            this.setState({signedIn: true})
        } catch (err) {
            console.log('user not signed in')
        }
        Hub.listen('auth', (data) => {
            const {payload: {event}} = data
            if (event === 'signIn') {
                this.setState({signedIn: true})
            }
            if (event === 'signOut' && this.state.signedIn) {
                this.setState({signedIn: false})
            }
        })
    }

    render() {
        const AppComponent = withAuthenticator(App, {
            signUpConfig: {
                hiddenDefaults: ['phone_number']
            }
        }, theme)
        return (
            <View style={styles.appContainer}>
                {!this.state.signedIn && <Logo/>}
                <AppComponent {...this.props} />
            </View>
        )
    }
}

const Logo = () => (
    <View style={styles.logoContainer}>
        <Image
            style={styles.logo}
            resizeMode='contain'
            source={logo}
        />
    </View>
)

const styles = StyleSheet.create({
    appContainer: {
        flex: 1
    },
    logoContainer: {
        marginTop: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 50,
        width: 200
    }
})

export default AppWithAuth