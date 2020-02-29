import React from 'react';
import { Button, View, Text, AsyncStorage, StyleSheet, TextInput } from 'react-native';
import TextInputForm from '../components/TextInputForm';
import CustomButton from '../components/CustomButton';

class NewMealScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdited: false,
            mealName: "",
            token: "",
            message: "",
            messageColor: "red",
            id: ""
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.getMeal()
        );
    }

    getMeal() {
        let meal = this.props.navigation.getParam('meal', 'No meal');
        var moment = require('moment');
        moment.locale('en');
        var date = moment(meal.date);
        if (meal !== "No meal") {
            this.setState({ isEdited: true })
            this.setState({ id: meal.id })
            this.setState({ mealName: meal.name });
            this.setState({ day: String(date.date()) });
            this.setState({ month: String(date.month() + 1) });
            this.setState({ year: String(date.year()) });
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

    getCurrentDate() {
        var moment = require('moment');
        moment.locale('en');
        this.setState({ day: String(moment().date()) });
        this.setState({ month: String(moment().month() + 1)});
        this.setState({ year: String(moment().year()) });
    }

    async postMeal() {
        await this.retrieveData();
        var moment = require('moment');
        moment.locale('en');

        if (this.state.year.length !== 4 || this.state.month.length !== 2 || this.state.day.length !== 2) {
            this.setState({ message: "Invalid date input" });
            return;
        }
        var date = this.state.year + "-" + this.state.month + "-" + this.state.day;

        if (this.state.mealName !== "") {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('x-access-token', this.state.token);
            let requestType = "POST";
            let url = "https://mysqlcs639.cs.wisc.edu/meals";

            if (this.state.isEdited) {
                requestType = "PUT"
                myHeaders.append("Accept", "application/json");
                url = url + "/" + this.state.id;
            }
            var requestOptions = {
                method: requestType,
                headers: myHeaders,
                body: JSON.stringify({
                    name: this.state.mealName,
                    date: moment(date).toISOString(),
                }),
                redirect: 'follow'
            }
            try {
                let response = await fetch(url, requestOptions)
                let result = await response.json();
                this.setState({ message: result.message });
                this.props.navigation.navigate('Food');

                if (response.ok) {
                    this.setState({ messageColor: "green" })
                }
            } catch (error) {
                console.log("Error in NewMealScreen " + error);
            }
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TextInputForm
                    value={this.state.mealName}
                    placeholder={"Name of meal"}
                    onChangeText={(mealName) => this.setState({ mealName: mealName })} />
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TextInput selectionColor={'#1e90ff'}
                        style={styles.textInputWithRightMargin}
                        keyboardType='numeric'
                        placeholder="Day (dd)"
                        onChangeText={(day) => this.setState({ day: day })}
                        value={this.state.day} />
                    <TextInput selectionColor={'#1e90ff'}
                        style={styles.textInputWithRightMargin}
                        keyboardType='numeric'
                        placeholder="Month (MM)"
                        onChangeText={(month) => this.setState({ month: month })}
                        value={this.state.month} />
                    <TextInput selectionColor={'#1e90ff'}
                        style={styles.textInput}
                        keyboardType='numeric'
                        placeholder="Year (YYYY)"
                        onChangeText={(year) => this.setState({ year: year })}
                        value={this.state.year} />
                </View>
                <CustomButton buttonStyle={{
                    backgroundColor: 'transparent', alignItems: 'center', padding: 15, marginTop: -10
                }}
                    textStyle={{ color: '#1e90ff' }} text={'Use current time'}
                    onPress={() => this.getCurrentDate()} />
                <Button key="Save"
                    title="Save"
                    onPress={() => this.postMeal()} />
                <Text style={{ margin: 10, color: this.state.messageColor }}>{this.state.message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        width: 92,
        borderColor: '#c0c0c0',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 20
    },
    textInputWithRightMargin: {
        height: 40,
        width: 92,
        borderColor: '#c0c0c0',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 20,
        marginRight: 12
    }
})

export default NewMealScreen;