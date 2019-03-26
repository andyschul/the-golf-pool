
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import LayoutBody from './LayoutBody';

const styles = theme => ({
  root: {
    color: theme.palette.common.white,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginRight: -8,
    marginLeft: -8,
    [theme.breakpoints.up('sm')]: {
      height: '80vh',
      minHeight: 500,
      maxHeight: 1300,
    },
  },
  layoutBody: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 14,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 500
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: theme.spacing.unit * 7,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.3,
    zIndex: -1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: theme.spacing.unit * 7,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -2,
  },
});

function Layout(props) {
  const { backgroundClassName, children, classes } = props;

  return (
    <section className={classes.root}>
      <LayoutBody className={classes.layoutBody} width="full">
        {children}
        <div className={classes.backdrop} />
        <div className={classNames(classes.background, backgroundClassName)} />
      </LayoutBody>
    </section>
  );
}

Layout.propTypes = {
  backgroundClassName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Layout);
