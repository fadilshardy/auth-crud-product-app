

import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import LoginForm from '../src/components/LoginForm/LoginForm';
import { useRouter } from 'next/router'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
interface ILoginProps {
}



const Login: React.FC<ILoginProps> = (props) => {
    const router = useRouter();
    const { status } = useSession();

    console.log(status);


    // useEffect(() => {

    //     if (status === 'authenticated') router.push('/')

    // }, [status]);


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const { email, password } = formData;

            const res = await signIn('login',
                {
                    callbackUrl: `${window.location.origin}/home`,
                    redirect: false,
                    email,
                    password,
                }
            )

            if (res?.error) setError(res.error)
            if (res?.ok) router.push('/')

            setIsLoading(false);
            setFormData({
                email: '',
                password: ''
            });


        } catch (error) {
            setError('Invalid email or password');
            setIsLoading(false);
        }
    };



    return <>
        <LoginForm formData={formData} error={error} isLoading={isLoading} handleInputChange={handleInputChange} handleLogin={handleLogin} />
    </>
};

export default Login;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    // @ts-ignore
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {
            session,
        },
    }
}