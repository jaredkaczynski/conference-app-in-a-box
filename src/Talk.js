import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Image} from 'react-native'
import {dimensions, colors, typography} from './theme'
import {updateUser} from "./graphql/mutations";
import {API, graphqlOperation} from 'aws-amplify'
import {getSelected} from "./CommonFunc";

export default class Talk extends Component {

    render() {
        const {navigation: {state: {params}}} = this.props;
        console.log('params:', params);

        return (
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        source={{uri: 'params.talk.speakerAvatar'}}
                        resizeMode='cover'
                        style={styles.avatar}
                    />
                    <div onClick={() => params.toggle_selection(params.apiUser, params.talk.id)}><Text
                        style={styles.name}>{params.talk.name} {getSelected(params.apiUser.data.getUser.talks, params.talk.id)}</Text>
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

    //
    // async toggle_selection(apiUser, id) {
    //     console.log('updating');
    //     let subscribed = apiUser.data.getUser.talks;
    //     let username = apiUser.data.getUser.id;
    //     if (subscribed.includes(id)) {
    //         let updatedSubscribed = subscribed.filter(v => v !== id);
    //         this.props.apiUser.data.getUser.talks = updatedSubscribed;
    //         // this.forceUpdate();
    //         try {
    //             await API.graphql(graphqlOperation(updateUser, {
    //                 input: {
    //                     id: username,
    //                     talks: updatedSubscribed
    //                 }
    //             }))
    //         } catch (err) {
    //             console.log('error: ', err)
    //         }
    //     } else {
    //         let updatedSubscribed = subscribed;
    //         updatedSubscribed.push(id);
    //         // this.props.apiUser.data.getUser.talks = updatedSubscribed;
    //         // this.forceUpdate();
    //         try {
    //             await API.graphql(graphqlOperation(updateUser, {
    //                 input: {
    //                     id: username,
    //                     talks: updatedSubscribed
    //                 }
    //             }))
    //         } catch (err) {
    //             console.log('error: ', err)
    //         }
    //     }
    // }

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

