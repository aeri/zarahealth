import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
    primary: { main: '#2f3542', contrastText: '#ffffff', light: '#585f6d', dark: '#070e1b'},
    secondary: { main: '#F4323A', contrastText: '#000000', light: '#ff6c65', dark: '#b90013' },
    background: {
        default: "#2f3542"
    },
    overrides: {
        Button: { // Name of the component ⚛️ / style sheet
            root: { // Name of the rule
                background: '#DDB61A', // Some CSS
            },
        },
    },

};

export default createMuiTheme({ palette});
