import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const CustomButton = withStyles((theme) => ({
    root: {
        color: 'rgba(0, 0, 0, 0.87)',
        backgroundColor: 'rgb(255, 255, 255)',
        boxSizing: 'border-box',
        display: 'inline-block',
        minWidth: '88px',
        borderRadius: '2px',
        fontSize: '14px',
        paddingLeft: '16px',
        paddingRight: '16px',
        '&:hover': {
            backgroundColor: 'rgb(200, 200, 200)'
        }
    }
}))(Button);

export default CustomButton;
