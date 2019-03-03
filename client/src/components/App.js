import React from 'react'
import TourneyGrouping from '../components/TourneyGrouping'
import Grid from '@material-ui/core/Grid';

const App = () => (
  <Grid container spacing={24} style={{paddingTop: 70, paddingLeft: 5, paddingRight: 5, paddingBottom: 60}}>
    <TourneyGrouping />
  </Grid>
)

export default App
