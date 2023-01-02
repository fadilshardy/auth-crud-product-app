
import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Container,
    Button,
    Text
} from '@mantine/core';

interface ILoginFormProps {
    formData: {
        email: string;
        password: string;
    }
    error: string;
    isLoading: boolean;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogin: (event: React.FormEvent<HTMLFormElement>) => void;
}


const LoginForm: React.FC<ILoginFormProps> = ({ formData, error, isLoading, handleInputChange, handleLogin }) => {
    return (
        <Container size={420} my={120} >

            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Welcome!
            </Title>

            <form onSubmit={handleLogin}>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">

                    <TextInput
                        label="Email"
                        name="email"
                        placeholder="test@mail.com"
                        onChange={handleInputChange}
                        value={formData.email}
                        disabled={isLoading}
                        required
                    />
                    <PasswordInput
                        name="password"
                        label="Password"
                        placeholder="Your password"
                        mt="md"
                        onChange={handleInputChange}
                        value={formData.password}
                        disabled={isLoading}
                        required
                    />

                    <Button fullWidth mt="xl" disabled={isLoading} type="submit">
                        {isLoading ? 'Loading...' : 'Login'}
                    </Button>
                </Paper>
                {error && <Text c="red" size="xs" pt={5} ta="center">{error}</Text>}

            </form>
        </Container>
    );
}

export default LoginForm;