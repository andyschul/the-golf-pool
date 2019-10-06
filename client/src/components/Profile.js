import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(9),
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const GET_USER = gql`
  {
    user {
      firstName
      lastName
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateProfile($firstName: String, $lastName: String) {
    updateUser(firstName: $firstName, lastName: $lastName) {
      firstName
      lastName
    }
  }
`;

function Profile() {
    const classes = useStyles();
    const { loading, error, data, updateQuery } = useQuery(GET_USER);
    const [updateUser] = useMutation(UPDATE_USER);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    function handleSubmit(e) {
      e.preventDefault();
      updateUser({ variables: { firstName: data.user.firstName, lastName: data.user.lastName } });
    }

    function handleFirstChange(e) {
      updateQuery(x=>{
        return {
          user: {
            ...x.user,
            firstName: e.target.value
          }
        }
      });
    }

    function handleLastChange(e) {
      updateQuery(x=>{
        return {
          user: {
            ...x.user,
            lastName: e.target.value
          }
        }
      });
    }

    return (
      <React.Fragment>
        <Paper className={classes.root} elevation={1}>
          <form
            onSubmit={handleSubmit}
          >
            <TextField
              id="first-name"
              label="First Name"
              margin="normal"
              on
              className={classes.textField}
              value={data.user.firstName}
              onChange={handleFirstChange}
            />
            <TextField
              id="first-name"
              label="Last Name"
              margin="normal"
              on
              className={classes.textField}
              value={data.user.lastName}
              onChange={handleLastChange}
            />
            <FormControl fullWidth>
              <Button variant="contained" color="primary" type="submit">Save</Button>
            </FormControl>
          </form>
        </Paper>
      </React.Fragment>
    );
  }

  export default Profile;