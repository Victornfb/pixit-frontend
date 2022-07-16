import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Icon as ChakraIcon,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { RiEye2Line, RiEyeCloseLine } from 'react-icons/ri';

interface IInputProps extends InputProps {
  name: string;
  label?: string;
  type?: string;
  error?: FieldError;
  Icon?: React.ElementType;
  iconDirection?: 'left' | 'right';
  errorMessageAbsolute?: boolean;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  {
    Icon,
    iconDirection,
    name,
    label,
    type,
    error,
    errorMessageAbsolute,
    w,
    order,
    ...rest
  },
  ref,
) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <FormControl isInvalid={!!error} w={w} order={order}>
      {label && (
        <FormLabel
          fontSize="1rem"
          htmlFor={label}
          id={`label_${name}`}
          textAlign={{ base: 'left', lg: 'left' }}
        >
          {label}
        </FormLabel>
      )}

      {type === 'password' ? (

        <InputGroup>
          {Icon && iconDirection === 'left' && (
            <InputLeftElement h="100%">
              <ChakraIcon
                as={Icon}
                color="primary.500"
                w="1.25rem"
                h="1.25rem"
              />
            </InputLeftElement>
          )}
          <ChakraInput
            name={name}
            id={name}
            type={show ? 'text' : 'password'}
            variant="filled"
            size="lg"
            bgColor="white"
            borderColor="primary.500"
            _focus={{
              borderColor: 'primary.500',
            }}
            ref={ref}
            {...rest}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              setTimeout(() => {
                if (rest.onKeyDown) {
                  rest.onKeyDown(e);
                }
              }, 1);
            }}
          />
          <InputRightElement h="100%" width="4rem">
            <Button
              bg="transparent"
              _hover={{ bg: 'transparent' }}
              onClick={handleClick}
            >
              {show ? (
                <ChakraIcon as={RiEye2Line} fill="primary" />
              ) : (
                <ChakraIcon as={RiEyeCloseLine} fill="primary" />
              )}
            </Button>
          </InputRightElement>
        </InputGroup>

      ) : (

        <InputGroup>
          {Icon && iconDirection === 'left' && (
            <InputLeftElement h="100%">
              <ChakraIcon
                as={Icon}
                color="primary.500"
                w="1.25rem"
                h="1.25rem"
              />
            </InputLeftElement>
          )}
          {Icon && iconDirection === 'right' && (
            <InputRightElement h="100%">
              <ChakraIcon
                as={Icon}
                color="primary.500"
                w="1.25rem"
                h="1.25rem"
              />
            </InputRightElement>
          )}
          <ChakraInput
            name={name}
            id={name}
            type={type}
            variant="filled"
            size="lg"
            bgColor="white"
            borderColor="primary.500"
            _focus={{
              borderColor: 'primary.500',
            }}
            ref={ref}
            {...rest}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              setTimeout(() => {
                if (rest.onKeyDown) {
                  rest.onKeyDown(e);
                }
              }, 1);
            }}
          />
        </InputGroup>

      )}

      {error && (
        <FormErrorMessage
          position={errorMessageAbsolute ? 'absolute' : 'initial'}
        >
          {error?.message
            ? error.message
            : `O campo "${label || name}" é obrigatório.`}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default forwardRef(InputBase);
