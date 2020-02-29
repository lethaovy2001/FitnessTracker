import React from 'react';
import { Button, View, Text, AsyncStorage } from 'react-native';
import base64 from 'base-64';
import TextInputForm from '../components/TextInputForm';
import CustomButton from '../components/CustomButton';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      token: "",
      message: ""
    }
  }

  async handleLogin() {
    var myHeader = new Headers();
    myHeader.append("Content-Type", "application/json");
    myHeader.append("Authorization", "Basic " + base64.encode(this.state.username + ":" + this.state.password));

    try {
      let response = await fetch('https://mysqlcs639.cs.wisc.edu/login', {
        method: 'GET',
        headers: myHeader,
        redirect: "follow"
      })
      let result = await response.json();
      if (response.ok) {
        this.setState({ token: result.token });
        AsyncStorage.setItem('token', result.token);
        this.props.navigation.navigate('Profile', {
          username: this.state.username,
          token: this.state.token,
        });
      } else {
        this.setState({ message: "Username/Password Incorrect!" })
      }
    } catch (error) {
      console.log(error);
    }
  }



  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInputForm width={300} placeholder={"Username"} onChangeText={(username) => this.setState({ username: username.trim() })} value={this.state.username} />
        <TextInputForm width={300} placeholder={"Password"} onChangeText={(password) => this.setState({ password: password })} value={this.state.password} />
        <Button
          title="Login"
          onPress={() => this.handleLogin()}
        />
        <Text style={{ marginTop: 10, color: 'red' }}>{this.state.message}</Text>
        <Text style={{ marginTop: 200, color: 'darkgrey' }}> Don't have an account?</Text>
        <CustomButton buttonStyle={{
          backgroundColor: 'transparent', alignItems: 'center', padding: 15, marginTop: -10
        }}
          textStyle={{ color: '#1e90ff' }} text={'Sign Up'}
          onPress={() => this.props.navigation.navigate('Signup')} />
      </View>
    );
  }
}

export default LoginScreen;