import {Button, Icon, Td, Tr as ChakraTr } from "@chakra-ui/react";
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

interface IUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface ActivityTrProps {
  user: IUser;
  onEditUserModalOpen: (id: number) => void;
  onDeleteUserModalOpen: (id: number) => void;
}

export function ActivityTr({ user, onEditUserModalOpen, onDeleteUserModalOpen }: ActivityTrProps) {
  return (
    <ChakraTr _hover={{bgColor: 'tableHover'}}>
      <Td isNumeric>{user.id}</Td>
      <Td>{user.name}</Td>
      <Td>{user.email}</Td>
      <Td>
        {
          new Date(user.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        }
      </Td>
      <Td>
        {
          new Date(user.updated_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        }
      </Td>
      <Td>
        <Button
          onClick={() => onEditUserModalOpen(user.id)}
        >
          <Icon as={AiOutlineEdit} />
        </Button>
      </Td>
      <Td>
        <Button
          onClick={() => onDeleteUserModalOpen(user.id)}
        >
          <Icon as={AiOutlineDelete} />
        </Button>
      </Td>
    </ChakraTr>
  )
}