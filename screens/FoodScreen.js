import React from 'react';
import { Text, ScrollView, View, AsyncStorage, Button } from 'react-native';
import { Card } from 'react-native-elements'
import CustomButton from '../components/CustomButton';
import TextInputForm from '../components/TextInputForm';

class FoodScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfFood: {},
            mealId: "",
            foodName: "",
            calories: "",
            fat: "",
            protein: "",
            carbohydrates: ""
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.getAllFoods(),
            this.getMealId()
        );
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

    async getMealId() {
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
            //get the most recent added meal to get mealID
            for (const meals of Object.entries(result)) {
                let info = Object.entries(meals[1])[Object.entries(meals[1]).length - 1];
                console.log(info[1].id);
                this.setState({ mealId: info[1].id });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getAllFoods() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let url = 'https://mysqlcs639.cs.wisc.edu/foods';
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

    displayData() {
        let list = [];
        for (const foods of Object.entries(this.state.listOfFood)) {
            for (const food of Object.entries(foods[1])) {
                list.push(
                    <Card key={food[1].id} containerStyle={{ padding: 20 }} title={food[1].name.toUpperCase()}>
                        <Text>Calories: {food[1].calories}</Text>
                        <Text>Protein: {food[1].protein}</Text>
                        <Text>Fat: {food[1].fat}</Text>
                        <Text>Carbohydrates: {food[1].carbohydrates}</Text>

                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                            <CustomButton buttonStyle={{
                                backgroundColor: 'dodgerblue', alignItems: 'center', justifyContent: 'center', width: 100, height: 40, marginRight: 20
                            }}
                                textStyle={{ color: 'white' }} text={'Add'}
                                onPress={() => this.postFood(food[1])} />
                        </View>
                    </Card>
                )
            }
        }
        return list;
    }

    async postFood(food) {
        if (this.state.mealId !== "") {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('x-access-token', this.state.token);
            let requestType = "POST";
            let url = "https://mysqlcs639.cs.wisc.edu/meals/" + this.state.mealId + "/foods";
            var requestOptions = {
                method: requestType,
                headers: myHeaders,
                body: JSON.stringify({
                    name: food.name,
                    fat: food.fat,
                    protein: food.protein,
                    calories: food.calories,
                    carbohydrates: food.carbohydrates
                }),
                redirect: 'follow'
            }
            try {
                let response = await fetch(url, requestOptions)
                let result = await response.json();
                console.log(result);
                this.setState({ message: result.message });
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
            <ScrollView containerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ padding: 20, fontWeight: "bold", fontSize: 24 }}>Choose the food in each meal</Text>
                {this.displayData()}
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <CustomButton buttonStyle={{
                        backgroundColor: 'dodgerblue', alignItems: 'center', justifyContent: 'center', width: 180, height: 40, marginRight: 20
                    }}
                        textStyle={{ color: 'white' }} text={'Enter Food'}
                        onPress={() => this.props.navigation.navigate('NewFood', {
                            mealId: this.state.mealId
                        })} />
                    <CustomButton buttonStyle={{
                        backgroundColor: 'dodgerblue', alignItems: 'center', justifyContent: 'center', width: 180, height: 40
                    }}
                        textStyle={{ color: 'white' }} text={'Done'}
                        onPress={() => this.props.navigation.navigate('CurrentDay')} />
                </View>
            </ScrollView>
        );
    }
}

export default FoodScreen;