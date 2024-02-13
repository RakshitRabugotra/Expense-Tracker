import PocketBase from 'pocketbase';

const isProduction = true;
const production_URI = "https://expense-tracker.pockethost.io"
const localhost_URI = "http://localhost:8090"

// The backend URI for our fetch requests
export const BACKEND_URI = isProduction ? production_URI : localhost_URI;

// The connection to the backend database
export const pb = new PocketBase(BACKEND_URI);