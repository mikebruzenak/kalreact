import ReactOnRails from 'react-on-rails';

import AppRouter from '../components/AppRouter';

// This is how react_on_rails can see the Appointments in the browser.
ReactOnRails.register({
    AppRouter,
});
