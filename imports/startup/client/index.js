import injectTapEventPlugin from 'react-tap-event-plugin';

console.log('Importing ./Router.jsx ...');
import './Router.jsx';

// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();