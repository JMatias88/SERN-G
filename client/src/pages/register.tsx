import React from 'react';
import { Formik, Form } from 'formik';
import { Button,} from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
interface registerProps {

}


export const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [,register] = useRegisterMutation();
    return (
        <Wrapper variant="small">
        <Formik
            initialValues={{ username:'', password:'' }}
            onSubmit={ async (values, {setErrors}) => {
               const response = await register(values);
               if (response.data?.register.errors){                 
                setErrors(toErrorMap(response.data.register.errors));
               } else if (response.data?.register.user) {
                router.push("/")
               }
            }}
        >
            {({isSubmitting}) => (
                <Form>
                    <InputField name="username" placeholder="username" label="Username"></InputField>
                    <InputField name="password" placeholder="password" label="Password" type="password"></InputField>
                    <Button mt={4} isLoading={isSubmitting} type="submit" color="teal">Registrarse</Button>
                </Form>
            )}
        </Formik>
        </Wrapper>
        
    );

}

export default withUrqlClient(createUrqlClient)(Register)