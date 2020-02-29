import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, AsyncStorage, Text } from 'react-native'
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { Circle, Line } from 'react-native-svg'
import TotalCalories from '../components/TotalCalories'

export default class TrendScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfMeals: {},
      token: "",
      caloriesArray: [150, 0, 0, 0, 0, 0, 0, 0],
      proteinArray: [150, 0, 0, 0, 0, 0, 0, 0],
      fatArray: [150, 0, 0, 0, 0, 0, 0, 0],
      carbohydrateArray: [150, 0, 0, 0, 0, 0, 0, 0]
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('didFocus', () =>
      this.getMeals()
    );
    navigation.addListener('didBlur', () =>
      this.resetData()
    );
  }

  resetData() {
    for (let i = 0; i < 7; i++) {
      this.state.caloriesArray[i + 1] = 0;
      this.state.fatArray[i + 1] = 0;
      this.state.proteinArray[i + 1] = 0;
      this.state.carbohydrateArray[i + 1] = 0;
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
      this.getFoods();
    } catch (error) {
      console.log(error);
    }
  }

  async getFoods() {
    await this.retrieveData()
    for (const meals of Object.entries(this.state.listOfMeals)) {
      for (const meal of Object.entries(meals[1])) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append('x-access-token', this.state.token);
        let url = 'https://mysqlcs639.cs.wisc.edu/meals/' + meal[1].id + "/foods";
        try {
          let response = await fetch(url, {
            method: 'GET',
            headers: myHeaders,
            redirect: "follow",
          })
          let result = await response.json();
          this.setState({ listOfFood: result })
          this.calculateTotalCalories(result, meal[1]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  calculateTotalCalories(listOfFood, meal) {
    var moment = require('moment');
    moment.locale('en');
    let date = moment(meal.date).format('MMMM DD, YYYY');
    let totalCalories = 0;
    let totalFat = 0;
    let totalCarbohydrates = 0;
    let totalProtein = 0;
    for (const foods of Object.entries(listOfFood)) {
      for (const food of Object.entries(foods[1])) {
        totalCalories = totalCalories + food[1].calories;
        totalFat = totalFat + food[1].fat;
        totalCarbohydrates = totalCarbohydrates + food[1].carbohydrates;
        totalProtein = totalProtein + food[1].protein;
      }
    }

    for (let i = 0; i < 7; i++) {
      if (date === moment().subtract(i, 'days').format('MMMM DD, YYYY')) {
        this.state.caloriesArray[i + 1] = totalCalories + this.state.caloriesArray[i + 1]
        this.state.carbohydrateArray[i + 1] = totalCarbohydrates + this.state.carbohydrateArray[i + 1]
        this.state.proteinArray[i + 1] = totalProtein + this.state.proteinArray[i + 1]
        this.state.fatArray[i + 1] = totalFat + this.state.fatArray[i + 1]
      }
    }
    // console.log(this.state.caloriesArray);
  }

  render() {
    // const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
    const data = this.state.caloriesArray;
    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 30

    const Decorator = ({ x, y, data }) => {
      return data.map((value, index) => (
        <Circle
          key={index}
          cx={x(index)}
          cy={y(value)}
          r={4}
          stroke={'rgb(134, 65, 244)'}
          fill={'white'}
        />
      ))
    }

    return (
      <ScrollView containerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        {/* calories line chart  */}
        <View style={{ height: 300, padding: 20, flexDirection: 'row' }}>
          <YAxis
            data={data}
            style={{ marginBottom: xAxisHeight + 10 }}
            contentInset={verticalContentInset}
            svg={axesSvg}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <LineChart
              style={{ flex: 1 }}
              data={data}
              contentInset={verticalContentInset}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveLinear}
            >
              <Grid />
              <Decorator />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, height: 10 }}
              data={data}
              formatLabel={(value, index) => index + 1}
              contentInset={{ left: 10, right: 10 }}
              svg={axesSvg}
            />
          </View>
        </View>
        <Text style={{textAlign: 'center', color: 'rgb(134, 65, 244)', marginTop: -10}}>Total calories consumed in a week</Text>

        {/* carbohydrate line chart  */}
        <View style={{ height: 300, padding: 20, flexDirection: 'row' }}>
          <YAxis
            data={this.state.carbohydrateArray}
            style={{ marginBottom: xAxisHeight + 10 }}
            contentInset={verticalContentInset}
            svg={axesSvg}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <LineChart
              style={{ flex: 1 }}
              data={this.state.carbohydrateArray}
              contentInset={verticalContentInset}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveLinear}
            >
              <Grid />
              <Decorator />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, height: 10 }}
              data={this.state.carbohydrateArray}
              formatLabel={(value, index) => index + 1}
              contentInset={{ left: 10, right: 10 }}
              svg={axesSvg}
            />
          </View>
        </View>
        <Text style={{textAlign: 'center', color: 'rgb(134, 65, 244)', marginTop: -10}}>Total carbohydrate consumed in a week</Text>

        {/* fat line chart  */}
        <View style={{ height: 300, padding: 20, flexDirection: 'row' }}>
          <YAxis
            data={this.state.fatArray}
            style={{ marginBottom: xAxisHeight + 10 }}
            contentInset={verticalContentInset}
            svg={axesSvg}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <LineChart
              style={{ flex: 1 }}
              data={this.state.fatArray}
              contentInset={verticalContentInset}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveLinear}
            >
              <Grid />
              <Decorator />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, height: 10 }}
              data={this.state.fatArray}
              formatLabel={(value, index) => index + 1}
              contentInset={{ left: 10, right: 10 }}
              svg={axesSvg}
            />
          </View>
        </View>
        <Text style={{textAlign: 'center', color: 'rgb(134, 65, 244)', marginTop: -10}}>Total fat consumed in a week</Text>

        {/* protein line chart  */}
        <View style={{ height: 300, padding: 20, flexDirection: 'row' }}>
          <YAxis
            data={this.state.proteinArray}
            style={{ marginBottom: xAxisHeight + 10 }}
            contentInset={verticalContentInset}
            svg={axesSvg}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <LineChart
              style={{ flex: 1 }}
              data={this.state.proteinArray}
              contentInset={verticalContentInset}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveLinear}
            >
              <Grid />
              <Decorator />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, height: 10 }}
              data={this.state.proteinArray}
              formatLabel={(value, index) => index + 1}
              contentInset={{ left: 10, right: 10 }}
              svg={axesSvg}
            />
          </View>
        </View>
        <Text style={{textAlign: 'center', color: 'rgb(134, 65, 244)', marginTop: -10}}>Total protein consumed in a week</Text>
      </ScrollView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})