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
import MySchedule from "./MySchedule";
import Auth from "@aws-amplify/auth";
import {createUser, updateUser} from "./graphql/mutations";

import {getDatesBetweenDates, getSelected, getSelectedBool, getTimes} from "./CommonFunc";
import {webNotifications} from "./NotificationManager";
import {PAXSchedule} from "./RealSchedule";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

var schedule = new PAXSchedule();

// const day2 = 'November 11'

class Schedule extends Component {
    static navigationOptions = props => ({
        headerLeft: <Image
            source={logo}
            resizeMode='contain'
            style={styles.logo}
        />
    })
    state = {
        talks: [],
        date_strings: [],
        loading: true
    }
    toggleDate = date => {
        this.setState({date})
    }

    async update() {
        try {
            var alttalkData = [];
            var tempTalkData = await API.graphql(graphqlOperation(listTalks));
            alttalkData = tempTalkData.data.listTalks.items;
            while (tempTalkData.data.listTalks.nextToken !== undefined && tempTalkData.data.listTalks.nextToken !== null) {
                tempTalkData = await API.graphql(graphqlOperation(listTalks, {nextToken: tempTalkData.data.listTalks.nextToken}));
                alttalkData = alttalkData.concat(tempTalkData.data.listTalks.items);
            }
            tempTalkData.data.listTalks.items = alttalkData;
            const talkData = tempTalkData;
            const user = await Auth.currentSession();
            const username = user["accessToken"]["payload"]["username"];
            const apiUser = await API.graphql(graphqlOperation(getUser, {id: username}));
            var talks = apiUser.data.getUser.talks;
            if (talks === undefined || talks === null) {
                apiUser.data.getUser.talks = [];
            }
            console.log(talks);
            console.log(apiUser);
            let start = 2247999999;
            let end = 0;
            for (var talk of talkData.data.listTalks.items) {
                if (talk.start < start) {
                    start = talk.start;
                }
                if (talk.end > end) {
                    end = talk.end;
                }
            }
            var dates = getDatesBetweenDates(start, end);
            this.setState({
                allTalks: talkData.data.listTalks.items,
                talks: talkData.data.listTalks.items,
                loading: false,
                apiUser: apiUser,
                date_strings: dates,
                date: dates[0],
            });
            var selectedTalks = [];
            for (var tempTalk of talkData.data.listTalks.items) {
                if (getSelectedBool(apiUser.data.getUser.talks, tempTalk.id)) {
                    selectedTalks.push(tempTalk)
                }
            }
            for (var timeout of webNotifications) {
                clearTimeout(timeout);
            }
            for (var selectedTalk of selectedTalks) {
                var eventDate = parseFloat(selectedTalk.start) * 1000 - Date.now() - (900 * 1000);
                if (eventDate > 840 * 1000) {
                    const title = selectedTalk.name;
                    var myTimeout = setTimeout(function () {
                        new Notification('Event ' + title + ' occuring in 15 minutes');
                    }, eventDate);
                    webNotifications.push(myTimeout)
                }
            }
        } catch (err) {
            console.log('err: ', err)
            this.setState({loading: false})
        }
    }

    async componentDidMount() {
        this.props.navigation.addListener('willFocus', (route) => {
            this.update()
        });
        this.update();
    }

    async toggle_selection(apiUser, id) {
        console.log('updating');
        let apiUSer = JSON.parse(JSON.stringify(this.state.apiUser))
        let subscribed = apiUSer.data.getUser.talks;
        let username = apiUser.data.getUser.id;
        if (subscribed.includes(id)) {
            let updatedSubscribed = subscribed.filter(v => v !== id);
            apiUser.data.getUser.talks = updatedSubscribed;
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
            let updatedSubscribed = subscribed;
            updatedSubscribed.push(id);
            apiUser.data.getUser.talks = updatedSubscribed;
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
        // this.setState({apiUser: apiUSer})
        this.update()
    }

    render() {
        const {talks, date_strings, date, loading, apiUser} = this.state;
        if (loading) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="white"/>
                </View>
            )
        }

        const talkData = talks
            .filter(t => new Date(parseFloat(t.start * 1000)).getMonthName() + ' ' + new Date(parseFloat(t.start * 1000)).getDate() === date)
            .sort((a, b) => new Date(parseInt(a.timeStamp)) - new Date(parseInt(b.timeStamp)));
        const pax1 = this.setupSizes(talkData.filter(t => t.tags.includes(139)));
        const pax2 = this.setupSizes(talkData.filter(t => t.tags.includes(140)));
        const pax3 = this.setupSizes(talkData.filter(t => t.tags.includes(141)));

        let rooms = {'PAX 1': pax1, 'PAX 2': pax2, 'PAX 3': pax3};

        schedule.dayData = talkData;
        schedule.buildGrid(talkData);
        let timeData = getTimes();
        let todayCode = new Date(parseFloat(pax1[0].start * 1000)).toLocaleString('en-us', {weekday: 'long'}).substring(0, 3).toUpperCase();
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Container fluid style={{paddingBottom: '5em'}}>
                        <Row>
                            <Col md={1}>
                                <Row>
                                    <Card style={{width: '100%'}}>
                                        <Card.Body>
                                            <Card.Title>Times</Card.Title>
                                            {/*<Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>*/}
                                            {/*<Card.Text>*/}
                                            {/*    Some quick example text to build on the card title and make up the bulk of*/}
                                            {/*    the card's content.*/}
                                            {/*</Card.Text>*/}
                                            {/*<Card.Link href="#">Card Link</Card.Link>*/}
                                            {/*<Card.Link href="#">Another Link</Card.Link>*/}
                                        </Card.Body>
                                    </Card>
                                </Row>
                                {timeData.map((time, i) => (
                                    <Row>
                                        <Card style={{width: '100%', minHeight: '5rem'}}>
                                            <Card.Body>
                                                <Card.Title>{todayCode} <em style={{color: '#00bd71'}}></em>
                                                    {time}</Card.Title>
                                                {/*<Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>*/}
                                                {/*<Card.Text>*/}
                                                {/*    Some quick example text to build on the card title and make up the bulk of*/}
                                                {/*    the card's content.*/}
                                                {/*</Card.Text>*/}
                                                {/*<Card.Link href="#">Card Link</Card.Link>*/}
                                                {/*<Card.Link href="#">Another Link</Card.Link>*/}
                                            </Card.Body>
                                        </Card>
                                    </Row>
                                ))}
                            </Col>
                            {Object.keys(rooms).map((key, index) => (
                                <Col>
                                    <Row>
                                        <Card style={{width: '100%'}}>
                                            <Card.Body>
                                                <Card.Title>{key}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Row>
                                    {rooms[key].map((talk, i) => (
                                        <Row md={2} style={{
                                            minHeight: talk.height,
                                            maxHeight: talk.height,
                                            paddingTop: talk.topPad
                                        }}>
                                            <TouchableOpacity
                                                key={i}
                                                onPress={
                                                    () => this.props.navigation.push('Talk', {
                                                        talk: talk,
                                                        apiUser: apiUser,
                                                        toggle_selection: this.toggle_selection.bind(this)
                                                    })
                                                }
                                            >
                                                <Card style={{width: '100%', minHeight: talk.height}}>
                                                    <Card.Body>
                                                        <Card.Title>{talk.name} {getSelected(apiUser.data.getUser.talks, talk.id)}</Card.Title>
                                                        <Card.Subtitle
                                                            className="mb-2 text-muted">{'talk.speakers[0].speakerName'}</Card.Subtitle>
                                                        <Card.Text>
                                                            Some quick example text to build on the card title and make
                                                            up
                                                            the bulk of
                                                            the card's content.
                                                        </Card.Text>
                                                        <Card.Text>{new Date(parseFloat(talk.start) * 1000).toLocaleTimeString()} - {new Date(parseFloat(talk.end) * 1000).toLocaleTimeString()}</Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </TouchableOpacity>
                                        </Row>
                                    ))}
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </ScrollView>
                <View style={styles.tabBottomContainer}>
                    {date_strings.map((selectedDate, i) => (
                            <TouchableHighlight
                                underlayColor={colors.primaryDark}
                                onPress={() => this.toggleDate(selectedDate)}
                            >
                                <View style={[getButtonStyle(date, selectedDate), styles.bottomButton]}>
                                    <Text style={[styles.bottomButtonText]}>{selectedDate}</Text>
                                </View>
                            </TouchableHighlight>
                        )
                    )}
                </View>
            </View>
        );
    }

    setupSizes(pax1) {
        let previousTalk = null;
        for (let talk of pax1) {
            let start = new Date(parseFloat(talk.start * 1000));
            let end = new Date(parseFloat(talk.end * 1000));
            talk.startSlot = (start.getHours() * 60 + start.getMinutes()) / 15;
            talk.endSlot = (end.getHours() * 60 + end.getMinutes()) / 15;
            talk.height = (5 * (talk.endSlot - talk.startSlot)).toString() + 'rem'
            talk.heightInt = (5 * (talk.endSlot - talk.startSlot))
            talk.topPad = '0rem';
            if (talk.height < 0) {
                console.log("HOW?")
            }
            if (previousTalk === null && talk.startSlot > 0) {
                talk.topPad = 5 * (talk.startSlot);
            } else {
                if (previousTalk !== null && previousTalk.endSlot < talk.startSlot) {
                    talk.topPad = 5 * (talk.startSlot - previousTalk.endSlot)
                }
            }
            console.log(talk.topPad);
            console.log(talk.height);
            if (talk.topPad < 0) {
                console.log("HOW?")
            }
            if (previousTalk !== null) {
                talk.topPad += previousTalk.heightInt;
            }
            talk.topPad = talk.topPad.toString() + 'rem'
            previousTalk = talk;
        }
        return pax1;
    }
}

function getButtonStyle(day, currentDay) {
    const backgroundColor = day === currentDay ? colors.primaryLight : colors.primary
    const borderTopColor = day === currentDay ? colors.highlight : colors.primary
    return {backgroundColor, borderTopColor}
}

const ScheduleNav = createStackNavigator({
    Schedule: {screen: Schedule},
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
});

export default ScheduleNav

const styles = StyleSheet.create({
    bottomButton: {
        width: dimensions.width / 9,
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
