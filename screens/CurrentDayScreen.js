import React from 'react';
import { Text, AsyncStorage, ScrollView, View } from 'react-native';
import { Card, Divider } from 'react-native-elements'
import CustomButton from '../components/CustomButton';
import TotalCalories from '../components/TotalCalories'
import { ProgressCircle } from 'react-native-svg-charts'

class CurrentDayScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfMeals: {},
            token: "",
            todayCalories: 0.0
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('didFocus', () =>
            this.getMeals()
        );
    }

    async getMeals() {
        await this.retrieveData();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('x-access-token', this.state.token)

        let url = 'https://mysqlcs639.cs.wisc.edu/meals/';
        try {
            let response = await fetch(url, {
                method: 'GET',
                headers: myHeaders,
                redirect: "follow",
            })
            let result = await response.json();
            this.setState({ listOfMeals: result })
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
        for (const meals of Object.entries(this.state.listOfMeals)) {
            for (const meal of Object.entries(meals[1])) {
                var moment = require('moment');
                moment.locale('en');
                let dateMeal = meal[1].date;
                info.push(
                    <Card key={meal[1].id} containerStyle={{ padding: 20 }} title={meal[1].name}>
                        <Text>Date: {moment(dateMeal).format('MMMM DD, YYYY')}</Text>
                        <Text>Date: {this.state.todayCalories}</Text>
                        <TotalCalories mealId={meal[1].id} meal={meal[1]} callback={this.callbackFromTotalCalories}></TotalCalories>

                        <CustomButton buttonStyle={{
                            backgroundColor: 'transparent', paddingRight: 15, paddingBottom: 15, paddingTop: 5
                        }}
                            textStyle={{ color: '#1e90ff' }} text={'See nutrition details'}
                            onPress={() => this.goToMealDetails(meal[1].id)} />
                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>

                            <CustomButton buttonStyle={{
                                backgroundColor: 'dodgerblue', alignItems: 'center', justifyContent: 'center', width: 100, height: 40, marginRight: 20
                            }}
                                textStyle={{ color: 'white' }} text={'Edit'}
                                onPress={() => this.handleEdit(meal[1])} />
                            <CustomButton buttonStyle={{
                                backgroundColor: 'coral', alignItems: 'center', justifyContent: 'center', width: 100, height: 40
                            }}
                                textStyle={{ color: 'white' }} text={'Delete'}
                                onPress={() => this.handleDelete(meal[1].id)} />
                        </View>
                    </Card>
                )
            }
        }
        return info;
    }

    callbackFromTotalCalories = (data) => {
        var moment = require('moment');
        moment.locale('en');
        let today = moment().format('MMMM DD, YYYY'); // today
        let date = moment(data[0].date).format('MMMM DD, YYYY');
        let calories = 0;
        if (date === today) {
            calories = data[1] + this.state.todayCalories;
        }
        this.setState({ todayCalories: calories })
    }

    async goToMealDetails(mealId) {
        this.props.navigation.navigate('MealDetail', {
            mealId: mealId
        });
    }

    handleEdit(meal) {
        this.props.navigation.navigate('NewMeal', {
            meal: meal,
        });
    }

    async handleDelete(mealId) {
        var myHeaders = new Headers();
        myHeaders.append('x-access-token', this.state.token)
        let url = "https://mysqlcs639.cs.wisc.edu/meals/" + mealId;
        try {
            let response = await fetch(url, {
                method: 'DELETE',
                headers: myHeaders,
            });
            let result = await response.json();
            this.getMeals();
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <ScrollView containerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Card>
                    <ProgressCircle style={{ height: 80 }} progress={0.4} progressColor={'rgb(134, 65, 244)'} />
                    <Text style={{textAlign: 'center', color: 'rgb(134, 65, 244)', padding: 10, fontSize: 24, fontWeight: 'bold'}}> 560/1500</Text>
                </Card>

                {this.displayData()}
            </ScrollView>
        );
    }
}

export default CurrentDayScreen;