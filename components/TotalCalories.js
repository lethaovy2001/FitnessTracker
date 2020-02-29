import React from 'react';
import { Text, AsyncStorage, ScrollView, View } from 'react-native';
// import { Card } from 'react-native-elements'
// import CustomButton from '../components/CustomButton';

class TotalCalories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCalories: "",
            listOfFood: {}
        }
    }

    componentDidMount() {
        this.getFoods()
    }

    async getFoods() {
        await this.retrieveData()
        let mealId = this.props.mealId
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('x-access-token', this.state.token);

        let url = 'https://mysqlcs639.cs.wisc.edu/meals/' + mealId + "/foods";
        try {
            let response = await fetch(url, {
                method: 'GET',
                headers: myHeaders,
                redirect: "follow",
            })
            let result = await response.json();
            this.setState({ listOfFood: result })
            this.calculateTotalCalories();
        } catch (error) {
            console.log(error);
        }
        this.sendCalories();
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

    calculateTotalCalories() {
        let totalCalories = 0;
        for (const foods of Object.entries(this.state.listOfFood)) {
            for (const food of Object.entries(foods[1])) {
                totalCalories = totalCalories + food[1].calories;
            }
        }
        this.setState({ totalCalories: totalCalories })
    }

    sendCalories() {
        this.props.callback([this.props.meal, this.state.totalCalories]);
    }

    render() {
        return (
            <Text>Calories: {this.state.totalCalories} </Text>
        );
    }
}

export default TotalCalories;