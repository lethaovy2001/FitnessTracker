import React from 'react';
import { Button, View, Text, AsyncStorage } from 'react-native';
import TextInputForm from '../components/TextInputForm';
import CustomButton from '../components/CustomButton';

class SignupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            goalDailyCalories: "",
            goalDailyProtein: "",
            goalDailyCarbohydrates: "",
            goalDailyFat: "",
            goalDailyActivity: "",
            message: ""
        }
    }

    async handleSignup() {
        if (this.state.username !== "" && this.state.password !== "") {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    goalDailyCalories: this.state.goalDailyCalories,
                    goalDailyProtein: this.state.goalDailyProtein,
                    goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
                    goalDailyFat: this.state.goalDailyFat,
                    goalDailyActivity: this.state.goalDailyActivity,
                }),
                redirect: 'follow'
            }
            let response = await fetch('https://mysqlcs639.cs.wisc.edu/users', requestOptions)
            let result = await response.json();
            
            if (!response.ok) {
                this.setState({ message: result.message });
            } else {
                AsyncStorage.setItem('goalCalories', this.state.goalDailyCalories);
                console.log(this.state.goalDailyCalories);
                this.props.navigation.navigate('Login');
            }
        }
    }

    render() {
        return (
            <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TextInputForm
                    value={this.state.username}
                    placeholder={"Username"}
                    onChangeText={(username) => this.setState({ username: username.trim() })} />
                <TextInputForm value={this.state.password}
                    placeholder={"Password"}
                    onChangeText={(password) => this.setState({ password: password })}
                    value={this.state.password} />
                <TextInputForm
                    value={this.state.firstName}
                    placeholder={"First Name"}
                    onChangeText={(firstName) => this.setState({ firstName: firstName })} />
                <TextInputForm
                    value={this.state.lastName}
                    placeholder={"Last Name"}
                    onChangeText={(lastName) => this.setState({ lastName: lastName })} />
                <TextInputForm
                    keyboardType='numeric'
                    placeholder={"Goal Daily Calories"}
                    onChangeText={(goalDailyCalories) => this.setState({ goalDailyCalories: goalDailyCalories })}
                    value={this.state.goalDailyCalories} />
                <TextInputForm
                    keyboardType='numeric'
                    placeholder={"Goal Daily Protein"}
                    onChangeText={(goalDailyProtein) => this.setState({ goalDailyProtein: goalDailyProtein })}
                    value={this.state.goalDailyProtein} />
                <TextInputForm
                    keyboardType='numeric'
                    value={this.state.goalDailyCarbohydrates}
                    placeholder={"Goal Daily Carbohydrates"}
                    onChangeText={(goalDailyCarbohydrates) => this.setState({ goalDailyCarbohydrates: goalDailyCarbohydrates })} />
                <TextInputForm
                    keyboardType='numeric'
                    placeholder={"Goal Daily Fat"}
                    onChangeText={(goalDailyFat) => this.setState({ goalDailyFat: goalDailyFat })}
                    value={this.state.goalDailyFat} />
                <TextInputForm
                    keyboardType='numeric'
                    placeholder={"Goal Daily Activity"}
                    onChangeText={(goalDailyActivity) => this.setState({ goalDailyActivity: goalDailyActivity })}
                    value={this.state.goalDailyActivity} />
                <Button
                    title="Sign up"
                    onPress={() => this.handleSignup()}
                    style={{ width: 100 }} />
                <Text style={{ margin: 10, color: 'red' }}>{this.state.message}</Text>
                <Text style={{ marginTop: 50, color: 'darkgrey' }}>Already have an account?</Text>
                <CustomButton
                    buttonStyle={{ backgroundColor: 'transparent', alignItems: 'center', padding: 15, marginTop: -10 }}
                    textStyle={{ color: '#1e90ff' }} text={'Log In'}
                    onPress={() => this.props.navigation.navigate('Login')} />
            </View>
        );
    }
}

export default SignupScreen;