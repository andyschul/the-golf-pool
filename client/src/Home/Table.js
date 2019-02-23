import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const tableColor = {
  0: '#9C27B0',
  1: '#F44336',
  2: '#E91E63',
  3: '#009688',
  4: '#03A9F4',
  5: '#CDDC39',
  6: '#9E9E9E',
  7: '#795548',
  8: '#FFEB3B',
  9: '#4CAF50'
}

function SimpleTable(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead style={{backgroundColor: tableColor[props.tableIndex]}}>
          <TableRow>
            <TableCell>Group {props.tableIndex + 1}</TableCell>
            <TableCell align="right">Tee Time</TableCell>
          </TableRow>
        </TableHead>

        {props.rows.map(row => (
        <TableBody key={row.tee_time}>
          {row.players.map(player => (
          <TableRow key={player.id}>
            <TableCell component="th" scope="row">
              {player.first_name} {player.last_name} ({player.country})
            </TableCell>
            <TableCell align="right">{row.tee_time}</TableCell>
          </TableRow>
          ))}
        </TableBody>
        ))}

      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
