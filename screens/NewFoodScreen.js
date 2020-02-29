import React from 'react';
import { Button, View, Text, AsyncStorage, StyleSheet, TextInput, ScrollView } from 'react-native';
import TextInputForm from '../components/TextInputForm';

class NewFoodScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdited: false,
            foodName: "",
            // token: "",
            // message: "",
            // messageColor: "red",
            id: "",
            calories: "",
            fat: "",
            protein: "",
            carbohydrates: ""
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.getFood()
        );
    }

    getFood() {
        let food = this.props.navigation.getParam('food', 'No food');
        if (food !== "No food") {
            this.setState({ isEdited: true })
            this.setState({ id: String(food.id) })
            this.setState({ foodName: food.name});
            this.setState({ fat: String(food.fat) });
            this.setState({ protein: String(food.protein)});
            this.setState({ carbohydrates: String(food.carbohydrates)});
            this.setState({ calories: String(food.calories) });
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

    async postFood() {
        await this.retrieveData();
        let mealId = this.props.navigation.getParam('mealId', 'No meal id');

        if (this.state.foodName !== "") {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('x-access-token', this.state.token);
            let requestType = "POST";
            let url = "https://mysqlcs639.cs.wisc.edu/meals/" + mealId + "/foods";

            if (this.state.isEdited) {
                requestType = "PUT"
                myHeaders.append("Accept", "application/json");
                url = url + "/" + this.state.id;
            }
            var requestOptions = {
                method: requestType,
                headers: myHeaders,
                body: JSON.stringify({
                    name: this.state.foodName,
                    fat: this.state.fat,
                    protein: this.state.protein,
                    carbohydrates: this.state.carbohydrates,
                    calories: this.state.calories
                }),
                redirect: 'follow'
            }
            try {
                let response = await fetch(url, requestOptions)
                let result = await response.json();
                this.setState({ message: result.message });

                if (response.ok) {
                    this.setState({ messageColor: "green" })
                    this.props.navigation.navigate('CurrentDay');
                }
            } catch (error) {
                console.log("Error in NewfoodScreen " + error);
            }
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TextInputForm
                    placeholder={"Name of food"}
                    onChangeText={(name) => this.setState({ foodName: name })}
                    value={this.state.foodName} />
                <TextInputForm
                    keyboardType='numeric'
                    placeholder={"Calories"}
                    onChangeText={(calories) => this.setState({ calories: calories })}
                    value={this.state.calories} />
                <TextInputForm
                    keyboardType='numeric'
                    placeholder={"Protein"}
                    onChangeText={(protein) => this.setState({ protein: protein })}
                    value={this.state.protein} />
                <TextInputForm
                    keyboardType='numeric'
                    value={this.state.carbohydrates}
                    placeholder={"Carbohydrates"}
                    onChangeText={(carbohydrates) => this.setState({ carbohydrates: carbohydrates })} />
                <TextInputForm
                    keyboardType='numeric'
                    placeholder={"Fat"}
                    onChangeText={(fat) => this.setState({ fat: fat })}
                    value={this.state.fat} />
                <Button
                    title="Save"
                    onPress={() => this.postFood()} />
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

export default NewFoodScreen;