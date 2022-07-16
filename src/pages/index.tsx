import type { NextPage } from 'next'
import Head from 'next/head'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Flex, Heading, useToast, VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import getAxiosErrorMessage from '../utils/getAxiosErrorMessage';
import Input from '../components/Form/Input';
import { PrimaryButton } from '../components/Form/PrimaryButton';
import { withSSRGuest } from '../utils/withSSRGuest';

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .max(200, 'Máximo de 200 caracteres')
    .email('Email inválido')
    .required('Campo obrigatório'),
    password: yup
    .string()
    .required('Campo obrigatório')
    .min(8, 'Mínimo de 8 caracteres')
    .max(48, 'Máximo de 50 caracteres'),
});

const errorMessages = {
  500: 'Erro interno no servidor',
};

const Home: NextPage = () => {
  const { signIn } = useContext(AuthContext);

  const { formState, handleSubmit, register } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const toast = useToast({
    variant: 'solid',
    duration: 7000,
    isClosable: true,
    position: 'top-right',
  });

  const handleSignIn: SubmitHandler<FormData> = async ({ email, password }) => {
    try {
      await signIn({
        email,
        password,
      });
    } catch (e) {
      const errorMessage = getAxiosErrorMessage(e, errorMessages);

      toast({
        title: 'Erro',
        description: errorMessage,
        status: 'error',
      });
    }
  };

  return (
    <>
      <Head>
        <title>Entrar | Pixit</title>
      </Head>

      <Flex flexDir="column" minHeight="100vh" justifyContent="center">

        <Flex
          my="8"
          justifyContent="center"
          gap={{ base: '2', md: '4', lg: '6', xl: '8' }}
          px={{ base: '2', md: '4', lg: '6', xl: '40' }}
        >
          {/* Login Card */}
          <Flex
            as="form"
            p="8"
            boxShadow="lg"
            bgColor="white"
            flexDir="column"
            borderRadius="md"
            alignItems="center"
            justifyContent="center"
            w={{ base: '100%', lg: '50%', xl: '40%' }}
            onSubmit={handleSubmit(handleSignIn)}
          >
            <VStack spacing="6" w="100%">
              <Heading as="h2" size="lg" w="100%">
                Login
              </Heading>

              <Input
                label="E-mail"
                type="email"
                autoComplete="email"
                error={errors.email}
                {...register('email')}
              />

              <Input
                label="Senha"
                type="password"
                autoComplete="current-password"
                error={errors.password}
                {...register('password')}
              />

              <PrimaryButton
                ml="auto"
                type="submit"
                gap="4"
                isLoading={formState.isSubmitting}
              >
                Entrar
              </PrimaryButton>

            </VStack>
          </Flex>
        </Flex>

      </Flex>
    </>
  );
}

export const getServerSideProps = withSSRGuest(
  async () => {
    return {
      props: {},
    };
  },
  {
    onlyGuest: true,
  },
);

export default Home

