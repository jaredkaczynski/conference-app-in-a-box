import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native'
import {dimensions, colors, typography} from './theme'
import {updateUser} from "./graphql/mutations";
import {API, graphqlOperation} from 'aws-amplify'
import {getSelected} from "./CommonFunc";

export default class Talk extends Component {
    state = {
        loading: true
    };

    componentDidMount() {
        const {navigation: {state: {params}}} = this.props;
        this.setState({
            params: params,
            loading: false,
            selected: getSelected(params.apiUser.data.getUser.talks, params.talk.id)
        })
    }

    render() {
        const {params, loading} = this.state;
        if (loading) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="white"/>
                </View>
            )
        }
        console.log('params test:', params);
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        source={{uri: 'params.talk.speakerAvatar'}}
                        resizeMode='cover'
                        style={styles.avatar}
                    />
                    <div onClick={() => this.updateSelected(params)}><Text
                        style={styles.name}>{params.talk.name} {this.state.selected}</Text>
                    </div>
                    <Text style={styles.speakerName}>{params.talk.speakerName}</Text>
                    <Text
                        style={styles.time}>{new Date(parseFloat(params.talk.start) * 1000).toLocaleTimeString()} - {new Date(parseFloat(params.talk.end) * 1000).toLocaleTimeString()}</Text>
                    <Text style={styles.title}>Summary</Text>
                    <Text style={styles.summary}>{params.talk.summary}</Text>
                    <Text style={styles.title}>Bio</Text>
                    <Text style={styles.speakerBio}>{params.talk.speakerBio}</Text>
                </View>
            </ScrollView>
        );
    }

    updateSelected(params) {
        params.toggle_selection(params.apiUser, params.talk.id);
        this.setState({selected: getSelected(params.apiUser.data.getUser.talks, params.talk.id)})
    }

}

//
// async function toggle_selection(id) {
//   if (this.state.subscribed.includes(id)) {
//     let updatedSubscribed = this.state.subscribed.filter(v => v !== id);
//     try {
//       await API.graphql(graphqlOperation(updateUser, {
//         input: {
//           id: username,
//           talks: updatedSubscribed
//         }
//       }))
//     } catch (err) {
//       console.log('error: ', err)
//     }
//   } else {
//     let updatedSubscribed = this.state.subscribed;
//     updatedSubscribed.push(id);
//     try {
//       await API.graphql(graphqlOperation(updateUser, {
//         input: {
//           id: username,
//           talks: updatedSubscribed
//         }
//       }))
//     } catch (err) {
//       console.log('error: ', err)
//     }
//   }
// }


const styles = StyleSheet.create({
    avatar: {
        borderRadius: 15,
        width: dimensions.width - 40,
        height: 300
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.primaryLight
    },
    title: {
        fontSize: 22,
        marginTop: 15,
        color: colors.primaryText,
        fontFamily: typography.medium
    },
    name: {
        fontSize: 26,
        marginBottom: 20,
        marginTop: 20,
        color: colors.highlight,
        fontFamily: typography.medium,
    },
    speakerName: {
        marginBottom: 5,
        fontSize: 16,
        color: colors.primaryText,
        fontFamily: typography.medium
    },
    time: {
        color: colors.highlight,
        fontFamily: typography.medium,
    },
    summary: {
        marginTop: 4,
        color: colors.primaryText,
        fontFamily: typography.primary,
    },
    speakerBio: {
        color: colors.primaryText,
    }
});

