import React from 'react'
import NavTabs from './Tabs'
import Grid from '@material-ui/core/Grid';
import withRoot from '../withRoot';

const App = () => (
  <Grid container spacing={24} style={{paddingTop: 70, paddingLeft: 5, paddingRight: 5, paddingBottom: 60}}>
    <NavTabs />
  </Grid>
)

export default withRoot(App);
