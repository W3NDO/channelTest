import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import { createConsumer } from '@rails/actioncable';

global.addEventListener = () => {};
global.removeEventListener = () => {};

const URL = 'ws://c8d1e1764cf3.ngrok.io/api/v1/cable'
const consumer = createConsumer(URL);

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    height: '100%',
  },
  messages: {
    flex: 1,
  },
  message: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    padding: 8,
  },
  form: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 75,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
  },
});

const Message = ({ message }) => (
  <View style={styles.message}>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const App = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const chatChannel = useMemo(() => {
    return consumer.subscriptions.create({ channel: 'TestChannel', room: 'main_room' }, {
      received(data) {
        setMessages(messages => messages.concat(data.content));
      },
    });
  }, []);

  const renderedItem = ({ item }) => (<Message message={item.message} key={item.key} />);
  const inputSubmitted = (event) => {
    const newMessage = event.nativeEvent.text;
    chatChannel.send({ message: newMessage });
    setValue('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <FlatList
        styles={styles.messages}
        data={messages}
        renderItem={renderedItem}
        keyExtractor={(item) => item.key}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          onChangeText={text => setValue(text)}
          value={value}
          placeholder="Type a Message"
          onSubmitEditing={inputSubmitted}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default App;