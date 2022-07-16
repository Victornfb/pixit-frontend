import Head from 'next/head';
import NextLink from 'next/link';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { IoDocumentOutline } from 'react-icons/io5';

import { useForm } from 'react-hook-form';
import { withSSRAuth } from '../utils/withSSRAuth';

const errorMessages = {
	500: 'Erro interno no servidor',
};

export default function ListUsers() {
  return (
    <>
      <Head>
        <title>Listar usuários | Pixit</title>
      </Head>
      <Flex flexDir="column" minHeight="100vh">



      </Flex>
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
