import React from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { Card } from 'react-native-elements'
import CustomButton from '../components/CustomButton';

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personalInfo: {},
      token: "",
      username: "",
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.getUserInfo()
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

  async getUserInfo() {
    await this.retrieveData();
    let username = this.props.navigation.getParam('username', 'No Username');
    this.setState({ username: username })
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('x-access-token', this.state.token)

    let url = 'https://mysqlcs639.cs.wisc.edu/users/' + username;
    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: myHeaders,
        redirect: "follow",
      })
      let result = await response.json();
      this.setState({ personalInfo: result })
    } catch (error) {
      console.log(error);
    }
  }

  displayData() {
    let info = [];
    for (const data of Object.entries(this.state.personalInfo)) {
      let key = data[0];
      let infoTitle = "";
      if (data[0] === "admin" || data[0] === "username") {
        continue;
      } else {
        if (data[0] === "firstName") {
          infoTitle = "First Name";
        } else if (data[0] === "lastName") {
          infoTitle = "Last Name";
        } else if (data[0] === "goalDailyCalories") {
          infoTitle = "Daily Calories Goal";
        } else if (data[0] === "goalDailyProtein") {
          infoTitle = "Daily Protein Goal";
        } else if (data[0] === "goalDailyCarbohydrates") {
          infoTitle = "Daily Carbohydrates Goal";
        } else if (data[0] === "goalDailyFat") {
          infoTitle = "Daily Fat Goal";
        } else if (data[0] === "goalDailyActivity") {
          infoTitle = "Daily Activity Goal";
        }
        info.push(
          <Text key={key}>{infoTitle}: {data[1]}</Text>
        )
      }
    }
    return info;
  }

  editProfile() {
    this.props.navigation.navigate('SignupScreen', {
      info: this.state.personalInfo,
    });
  }

  async deleteProfile() {
    var myHeaders = new Headers();
    myHeaders.append('x-access-token', this.state.token)
    let url = "https://mysqlcs639.cs.wisc.edu//users/" + this.state.username;
    try {
      let response = await fetch(url, {
        method: 'DELETE',
        headers: myHeaders,
      });
      let result = await response.json();
      console.log(result);
      await AsyncStorage.removeItem('token');
      this.props.navigation.goBack(null)
    } catch (error) {
      console.log(error);
    }
  }

  logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      this.props.navigation.goBack(null)
    } catch (error) {
      console.log("Error retrieving data");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Card containerStyle={{ padding: 20, width: 300 }} title={this.props.navigation.getParam('username', 'No Username')}>
          {this.displayData()}
        </Card>
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
          <CustomButton buttonStyle={{
            backgroundColor: 'dodgerblue', alignItems: 'center', justifyContent: 'center', width: 140, height: 40, marginRight: 20
          }}
            textStyle={{ color: 'white' }} text={'Edit'}
            onPress={() => this.editProfile()} />
          <CustomButton buttonStyle={{
            backgroundColor: 'dodgerblue', alignItems: 'center', justifyContent: 'center', width: 140, height: 40
          }}
            textStyle={{ color: 'white' }} text={'Logout'}
            onPress={() => this.logout()} />
        </View>
        <CustomButton buttonStyle={{
          backgroundColor: 'orangered', alignItems: 'center', justifyContent: 'center', width: 300, height: 40, marginTop: 20
        }}
          textStyle={{ color: 'white' }} text={'Delete'}
          onPress={() => this.deleteProfile()} />
      </View >
    );
  }
}

export default ProfileScreen;