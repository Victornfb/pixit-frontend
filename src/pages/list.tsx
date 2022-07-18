import Head from 'next/head';
import {
  Box,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  VStack,
  Tr as ChakraTr,
  useToast,
  Heading,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  IconButton,
  Icon
} from '@chakra-ui/react';

import { withSSRAuth } from '../utils/withSSRAuth';
import { useEffect, useRef, useState } from 'react';
import getAxiosErrorMessage from '../utils/getAxiosErrorMessage';
import { api } from '../services/apiClient';
import { ActivityTr as Tr } from '../components/Table/Tr';
import { IoExitOutline } from 'react-icons/io5';
import { signOut } from '../contexts/AuthContext';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../components/Form/Input';

interface IUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

type FormData = {
  name: string;
  password: string;
}

const schema = yup.object({
  name: yup
    .string()
    .required('Campo obrigatório.'),
  password: yup
    .string()
    .required('Campo obrigatório')
    .min(8, 'Mínimo de 8 caracteres')
    .max(48, 'Máximo de 50 caracteres'),
});

const errorMessages = {
	500: 'Erro interno no servidor',
};

export default function ListUsers() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditUserOpen,
    onOpen: onEditUserOpen,
    onClose: onEditUserClose
  } = useDisclosure();
  const cancelRef = useRef(null);

  const { formState, handleSubmit, register } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const { errors } = formState;

  const [ isTableLoading, setIsTableLoading ] = useState(true);
  const [ users, setUsers ] = useState<IUser[]>([]);
  const [ actionUserId, setActionUserId ] = useState<number>();

  const toast = useToast({
    variant: 'solid',
    duration: 7000,
    isClosable: true,
    position: 'top-right',
  });

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await api.get('users');
        setUsers(response.data);
      } catch (e) {
        const errorMessage = getAxiosErrorMessage(e, errorMessages);
  
        toast({
          title: 'Erro',
          description: errorMessage,
          status: 'error',
        });
      } finally {
        setIsTableLoading(false);
      }
    }

    getUsers();
  }, []);

  function handleAskForConfirmation(id: number) {
    setActionUserId(id);
    onOpen();
  }

  function handleOpenEditUserModal(id: number) {
    setActionUserId(id);
    onEditUserOpen();
  }

  function handleResetAction() {
    setActionUserId(undefined);
    onClose();
    onEditUserClose();
  }

  async function handleDeleteUser() {
    if (!actionUserId) {
      handleResetAction();
      return;
    }

    try {
      await api.delete(`/users/${actionUserId}`);

      toast({
        title: 'Sucesso',
        description: 'O usuário foi deletado com sucesso.',
        status: 'success',
      });

      setUsers(() => {
        return users.filter((user: IUser) => user.id !== actionUserId);
      });
    } catch (e) {
      const errorMessage = getAxiosErrorMessage(e, errorMessages);

      toast({
        title: 'Erro',
        description: errorMessage,
        status: 'error',
      });
    } finally {
      handleResetAction();
    }
  }

  const handleEditUser: SubmitHandler<FormData> = async ({
    name,
    password,
  }) => {
    if (!actionUserId) {
      handleResetAction();
      return;
    }

    try {
      const response = await api.put(
        `/users/${actionUserId}`,
        {
          name,
          password,
        }
      );

      toast({
        title: 'Sucesso',
        description: 'O usuário foi editado com sucesso.',
        status: 'success',
      });

      const updatedUsers: IUser[] = users.map((user: IUser) => {
        if (user.id !== actionUserId) {
          return user;
        }

        return response.data;
      });

      setUsers(updatedUsers);
    } catch (e) {
      const errorMessage = getAxiosErrorMessage(e, errorMessages);

      toast({
        title: 'Erro',
        description: errorMessage,
        status: 'error',
      });
    } finally {
      handleResetAction();
    }
  }

  return (
    <>
      <Head>
        <title>Listar usuários | Pixit</title>
      </Head>

      <Flex flexDir="column" minHeight="100vh">

        <Flex
          my="8"
          justifyContent="center"
          gap={{ base: '2', md: '4', lg: '6', xl: '8' }}
          px={{ base: '2', md: '4', lg: '6', xl: '8' }}
        >

          <VStack
            p="2rem"
            w="100%"
            spacing="6"
            boxShadow="lg"
            bgColor="white"
            borderRadius="md"
          >
            <Flex w="100%" justifyContent="space-between">
              <Heading as="h2" size="lg" w="100%">
                Usuários
              </Heading>

              <Flex flexDir="row" gap="2" alignItems="center">
                <IconButton
                  icon={<Icon as={IoExitOutline}/>}
                  aria-label='Sair'
                  onClick={() => signOut()}
                />
                <Text>Sair</Text>
              </Flex>
            </Flex>

            <Box
              w="100%"
              overflowX="auto"
              css={{
                "::-webkit-scrollbar": {
                  height: "6px",
                },
                "::-webkit-scrollbar-thumb": {
                  background: "rgba(0, 0, 0, 0.48)",
                  borderRadius: "10px",
                },
              }}
            >
            <Table size="md">
              <Thead>
                <ChakraTr>
                  <Th color='text' isNumeric>ID</Th>
                  <Th color='text'>Nome</Th>
                  <Th color='text'>E-mail</Th>
                  <Th color='text'>Criado em</Th>
                  <Th color='text'>Editado em</Th>
                  <Th color='text'>Editar</Th>
                  <Th color='text'>Excluir</Th>
                </ChakraTr>
              </Thead>

              <Tbody>
                {!!isTableLoading
                ? <ChakraTr>
                    <Td colSpan={6} h="48" textAlign="center" verticalAlign="middle">
                      <Spinner size="xl" color="highlight.500" />
                      <Text>Carregando...</Text>
                    </Td>
                  </ChakraTr>
                : <>
                    {users.length === 0 &&
                      <ChakraTr>
                        <Td colSpan={6} h="48" textAlign="center" verticalAlign="middle" >
                          <Text>Nenhum registro encontrado</Text>
                        </Td>
                      </ChakraTr>
                    }
                    {users.map((user: IUser) => (
                      <Tr
                        key={user.id}
                        user={user}
                        onEditUserModalOpen={handleOpenEditUserModal}
                        onDeleteUserModalOpen={handleAskForConfirmation}
                      />
                    ))}
                  </>
                }
              </Tbody>
            </Table>

            </Box>
          </VStack>

        </Flex>

      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar usuário
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja realmente deletar o usuário? Essa ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => handleResetAction()}>
                Cancelar
              </Button>

              <Button
                ml={3}
                colorScheme="red"
                onClick={() => handleDeleteUser()}
              >
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isEditUserOpen}
        leastDestructiveRef={cancelRef}
        onClose={onEditUserClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            as="form"
            onSubmit={handleSubmit(handleEditUser)}
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Editar usuário
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack gap="4">
                <Input
                  label="Nome"
                  type="text"
                  autoComplete="name"
                  error={errors.name}
                  {...register('name')}
                />

                <Input
                  label="Senha"
                  type="password"
                  autoComplete="new-password"
                  error={errors.password}
                  {...register('password')}
                />
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => handleResetAction()}>
                Cancelar
              </Button>

              <Button
                type="submit"
                ml={3}
                colorScheme="primary"
                isLoading={formState.isSubmitting}
              >
                Salvar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export const getServerSideProps = withSSRAuth(
  async () => {
    return {
      props: {},
    };
  }
);
