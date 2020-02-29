import React from 'react';
import { Text, AsyncStorage, ScrollView, View } from 'react-native';
import { Card } from 'react-native-elements'
import CustomButton from '../components/CustomButton';

class MealDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfFood: {},
            token: "",
            mealId: ""
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.getFoods()
        );
    }

    async getFoods() {
        await this.retrieveData()
        let mealId = this.props.navigation.getParam('mealId', 'No meal id');
        this.setState({ mealId: mealId })
        if (mealId !== "No meal id") {
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
            } catch (error) {
                console.log(error);
            }
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
        let list = [];
        let key = 0;
        for (const foods of Object.entries(this.state.listOfFood)) {
            for (const food of Object.entries(foods[1])) {
                list.push(
                    <Card key={key} containerStyle={{ padding: 20 }} title={food[1].name.toUpperCase()}>
                        <Text>Calories: {food[1].calories}</Text>
                        <Text>Protein: {food[1].protein}</Text>
                        <Text>Fat: {food[1].fat}</Text>
                        <Text>Carbohydrates: {food[1].carbohydrates}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                            <CustomButton buttonStyle={{
                                backgroundColor: 'dodgerblue', alignItems: 'center', justifyContent: 'center', width: 100, height: 40, marginRight: 20
                            }}
                                textStyle={{ color: 'white' }} text={'Edit'}
                                onPress={() => this.handleEdit(food[1])} />
                            <CustomButton buttonStyle={{
                                backgroundColor: 'coral', alignItems: 'center', justifyContent: 'center', width: 100, height: 40
                            }}
                                textStyle={{ color: 'white' }} text={'Remove'}
                                onPress={() => this.handleDelete(food[1].id)} />
                        </View>
                    </Card>
                )
                key = key + 1;
            }
        }
        return list;
    }

    handleEdit(food) {
        this.props.navigation.navigate('NewFood', {
            food: food,
            mealId: this.state.mealId
        });
    }

    async handleDelete(foodId) {
        await this.retrieveData();
        var myHeaders = new Headers();
        myHeaders.append('x-access-token', this.state.token)
        let url = "https://mysqlcs639.cs.wisc.edu/meals/" + this.state.mealId + "/foods/" + foodId;
        try {
            let response = await fetch(url, {
                method: 'DELETE',
                headers: myHeaders,
            });
            let result = await response.json();
            this.getFoods();
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

export default MealDetailScreen;