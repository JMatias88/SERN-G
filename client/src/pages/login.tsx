import React from 'react';
import { Formik, Form, Field } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from "next-urql"
import { useLoginMutation } from '../generated/graphql';
import { Button, LinearProgress, Grid} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { TextField } from 'formik-material-ui';
import { makeStyles } from '@material-ui/core/styles';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    root:{
        height: '100vh'
    },
    image : {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',  
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    form: {
        width:'100%',
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
      },
      avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
      },
}))

export const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation();
    const classes = useStyles();
    return (     
        <Grid container component="main" className={classes.root}>
            <Grid item xs={false} sm={4} md={7} className={classes.image}></Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square >
                <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    M
                </Avatar>
                <Typography component="h1" variant="h5">
                    Ingresar
                </Typography>
                <Formik 
                    initialValues={{ username:'', password:'' }}
                    onSubmit={ async (values, {setErrors}) => {
                    console.log(values)
                    const response = await login({options:values});
                    console.log(response)
                    if (response.data?.login.errors){                 
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        router.push("/")
                    }
                    }}
        >
            {({isSubmitting}) => (
                <Form className={classes.form}>
                <Field
                  component={TextField}
                  name="username"
                  type="text"
                  label="username"     
                  variant="outlined"
                  fullwidth                            
                />
                <br />
                <Field
                  component={TextField}
                  type="password"
                  label="Password"
                  name="password"
                  className={classes.form}
                />
                {isSubmitting && <LinearProgress />}
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  className={classes.submit}
                  
                >
                  Submit
                </Button>
              </Form>
            )}
                </Formik>
                </div>
            </Grid>
        </Grid>   
   
        
    );

}

export default withUrqlClient(createUrqlClient)(Login)