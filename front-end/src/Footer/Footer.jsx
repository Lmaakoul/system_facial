// Footer.js
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
    padding: theme.spacing(2),
    position: 'relative',
    width: '100%',
    height: '70px',
    top:'200px', // Set a fixed height
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Typography variant="body1">
        Mangement by facial
      </Typography>
      <Typography variant="body2" color="inherit">
        © {new Date().getFullYear()} Facial.com
      </Typography>
    </footer>
  );
};

export default Footer;
