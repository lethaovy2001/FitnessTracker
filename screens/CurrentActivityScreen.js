import React from 'react';
import { Text, AsyncStorage, ScrollView, View } from 'react-native';
import { Card } from 'react-native-elements'
import CustomButton from '../components/CustomButton';

class CurrentDayScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfActivities: {},
            token: "",
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.getActivities()
        );
    }

    async getActivities() {
        await this.retrieveData();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('x-access-token', this.state.token)

        let url = 'https://mysqlcs639.cs.wisc.edu/activities';
        try {
            let response = await fetch(url, {
                method: 'GET',
                headers: myHeaders,
                redirect: "follow",
            })
            let result = await response.json();
            this.setState({ listOfActivities: result })
        } catch (error) {
            console.log(error);
        }
    }

    retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                this.setState({ token: value });
            }
        } catch (error) {
            console.log("Error retrieving data");
        }
    };

    displayData() {
        let info = [];
        let key = 0;
        for (const activities of Object.entries(this.state.listOfActivities)) {
            for (const activity of Object.entries(activities[1])) {
                var moment = require('moment');
                moment.locale('en');
                let activityDate = activity[1].date;
                info.push(
                    <Card key={key} containerStyle={{ padding: 20 }} title={activity[1].name}>
                        <Text>Duration: {activity[1].duration} minutes</Text>
                        <Text>Calories: {activity[1].calories} </Text>
                        <Text>Date: {moment(activityDate).format('MMMM DD, YYYY')}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                            <CustomButton buttonStyle={{
                                backgroundColor: 'dodgerblue', alignItems: 'center', justifyContent: 'center', width: 100, height: 40, marginRight: 20
                            }}
                                textStyle={{ color: 'white' }} text={'Edit'}
                                onPress={() => this.handleEdit(activity[1])} />
                            <CustomButton buttonStyle={{
                                backgroundColor: 'coral', alignItems: 'center', justifyContent: 'center', width: 100, height: 40
                            }}
                                textStyle={{ color: 'white' }} text={'Delete'}
                                onPress={() => this.handleDelete(activity[1].id)} />
                        </View>
                    </Card>
                )
                key = key + 1;
            }
        }
        return info;
    }

    handleEdit(activity) {
        this.props.navigation.navigate('NewActivity', {
            activity: activity,
        });
    }

    async handleDelete(activityId) {
        var myHeaders = new Headers();
        myHeaders.append('x-access-token', this.state.token)
        let url = "https://mysqlcs639.cs.wisc.edu/activities/" + activityId;
        try {
            let response = await fetch(url, {
                method: 'DELETE',
                headers: myHeaders,
            });
            let result = await response.json();
            this.getActivities();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <ScrollView containerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {this.displayData()}
            </ScrollView>
        );
    }
}

export default CurrentDayScreen;