import { createConsumer } from '@rails/actioncable';

const URL = 'ws://c8d1e1764cf3.ngrok.io/api/v1/cable'
const consumer = createConsumer(URL)

export default consumer;