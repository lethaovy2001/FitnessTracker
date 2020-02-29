import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

class TextInputForm extends React.Component {
  render() {
    return (
      <TextInput selectionColor={'#1e90ff'}
        style={styles.textInput}
        placeholder={this.props.placeholder}
        onChangeText={this.props.onChangeText}
        value={this.props.value}
        keyboardType={this.props.keyboardType} />
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width: 300,
    borderColor: '#c0c0c0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20
  }
})



export default TextInputForm;