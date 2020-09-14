import React, {Component} from 'react'
import {
    ActivityIndicator,
    Image,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    Text,
    View
} from 'react-native'
import Pager from './Pager'
import {colors, typography, dimensions, logo} from './theme'

import {API, graphqlOperation} from 'aws-amplify'
import {getUser, listTalks} from './graphql/queries'
import {createStackNavigator} from "react-navigation-stack";
import Auth from "@aws-amplify/auth";
import {createUser, updateUser} from "./graphql/mutations";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from '@fortawesome/free-solid-svg-icons'
import {faStar as faStarO} from '@fortawesome/free-regular-svg-icons'
import {getSelected, getSelectedBool} from "./CommonFunc";

const day1 = 'November 10'
const day2 = 'November 11'

class MySchedule extends Component {
    static navigationOptions = props => ({
        headerLeft: <Image
            source={logo}
            resizeMode='contain'
            style={styles.logo}
        />
    })
    state = {
        talks: [],
        date: day1,
        loading: true
    }
    toggleDate = date => {
        this.setState({date})
    }

    async componentDidMount() {
        try {
            const talkData = await API.graphql(graphqlOperation(listTalks))
            const user = await Auth.currentSession();
            const username = user["accessToken"]["payload"]["username"];
            const apiUser = await API.graphql(graphqlOperation(getUser, {id: username}));
            var talks = apiUser.data.getUser.talks;
            if (talks === undefined || talks === null) {
                apiUser.data.getUser.talks = [];
            }
            console.log(talks);
            console.log(apiUser);
            this.setState({
                talks: talkData.data.listTalks.items,
                loading: false,
                apiUser: apiUser
            })
        } catch (err) {
            console.log('err: ', err)
            this.setState({loading: false})
        }
    }

    render() {
        const {talks, date, loading, apiUser} = this.state
        if (loading) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="white"/>
                </View>
            )
        }
        const tempTalkData = talks
            .filter(t => t.date === date)
            .sort((a, b) => new Date(parseInt(a.timeStamp)) - new Date(parseInt(b.timeStamp)))
        let talkData = [];
        for (var talk of tempTalkData) {
            if (getSelectedBool(apiUser.data.getUser.talks, talk.id)) {
                talkData.push(talk)
            }
        }
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.listContainer}>
                        {
                            talkData.map((talk, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={
                                        () => this.props.navigation.push('Talk', {talk: talk, apiUser: apiUser})
                                    }
                                >
                                    <View style={styles.talk}>
                                        <View style={styles.speakerContainer}>
                                            <View style={styles.avatarContainer}>
                                                <Image
                                                    style={styles.avatar}
                                                    resizeMode='cover'
                                                    source={{uri: 'talk.speakers[0].speakerAvatar'}}
                                                />
                                            </View>
                                            <View style={styles.infoContainer}>
                                                <div><Text
                                                    style={styles.name}
                                                >{talk.name} {getSelected(apiUser.data.getUser.talks, talk.id)}</Text>
                                                </div>
                                                <Text style={styles.speakerName}>{'talk.speakers[0].speakerName'}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.timeContainer}>
                                            <Text style={styles.talkTime}>{talk.time}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </ScrollView>
                <View style={styles.tabBottomContainer}>
                    <TouchableHighlight
                        underlayColor={colors.primaryDark}
                        onPress={() => this.toggleDate(day1)}
                    >
                        <View style={[getButtonStyle(day1, date), styles.bottomButton]}>
                            <Text style={[styles.bottomButtonText]}>{day1}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={colors.primaryDark}
                        onPress={() => this.toggleDate(day2)}
                    >
                        <View style={[getButtonStyle(day2, date), styles.bottomButton]}>
                            <Text style={[styles.bottomButtonText]}>{day2}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    async toggle_selection(id) {
        if (this.state.subscribed.includes(id)) {
            let updatedSubscribed = this.state.subscribed.filter(v => v !== id);
            try {
                await API.graphql(graphqlOperation(updateUser, {
                    input: {
                        id: username,
                        talks: updatedSubscribed
                    }
                }))
            } catch (err) {
                console.log('error: ', err)
            }
        } else {
            let updatedSubscribed = this.state.subscribed;
            updatedSubscribed.push(id);
            try {
                await API.graphql(graphqlOperation(updateUser, {
                    input: {
                        id: username,
                        talks: updatedSubscribed
                    }
                }))
            } catch (err) {
                console.log('error: ', err)
            }
        }
    }
}

function getButtonStyle(day, currentDay) {
    const backgroundColor = day === currentDay ? colors.primaryLight : colors.primary
    const borderTopColor = day === currentDay ? colors.highlight : colors.primary
    return {backgroundColor, borderTopColor}
}

const MyScheduleNav = createStackNavigator({
    Schedule: {screen: MySchedule},
    Talk: {screen: Pager}
}, {
    animationEnabled: true,
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: colors.primary,
            borderBottomColor: colors.primaryLight,
            borderBottomWidth: 1
        },
    }
})

export default MyScheduleNav

const styles = StyleSheet.create({
    bottomButton: {
        width: dimensions.width / 2,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1
    },
    bottomButtonText: {
        color: colors.highlight,
        fontFamily: typography.primary,
    },
    tabBottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        width: dimensions.width,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: "rgba(255, 255, 255, .2)",
        borderBottomColor: "rgba(255, 255, 255, .2)",
        left: 0,
        bottom: -1
    },
    listContainer: {
        paddingBottom: 70,
    },
    speakerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingBottom: 10
    },
    logo: {
        marginLeft: 10,
        marginBottom: 4,
        width: 120,
        height: 35
    },
    container: {
        backgroundColor: colors.primaryLight,
        flex: 1
    },
    loading: {
        backgroundColor: colors.primaryLight,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    talk: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        margin: 15,
        marginBottom: 0,
        paddingTop: 15,
        paddingBottom: 0,
    },
    timeContainer: {
        // backgroundColor: "#ddd",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor: colors.primaryDark
    },
    talkTime: {
        color: colors.primaryText,
        fontFamily: typography.primary,
    },
    infoContainer: {
        flex: 8,
        paddingLeft: 20
    },
    name: {
        fontFamily: typography.medium,
        fontSize: 17,
        marginBottom: 5,
        color: colors.primaryText,
    },
    avatarContainer: {
        flex: 2,
        borderRadius: 4,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    avatar: {
        width: 60,
        height: 70,
    },
    speakerName: {
        fontSize: 14,
        color: colors.primaryText,
        fontFamily: typography.primary,
    }
});
