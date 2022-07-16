import { Button, ButtonProps, useTheme } from '@chakra-ui/react';

interface PrimaryButtonProps extends ButtonProps {
  colorScheme?: string;
  children: React.ReactNode;
}

export function PrimaryButton({
  colorScheme = 'primary',
  children,
  ...rest
}: PrimaryButtonProps) {
  const { colors } = useTheme();

  return (
    <Button
      px="6"
      colorScheme={colorScheme}
      verticalAlign="middle"
      boxShadow={
        colorScheme === 'primary'
          ? `0px 2px 10px ${colors.primary['500']}B3`
          : `0px 2px 10px ${colors.gray['500']}B3`
      }
      {...rest}
    >
      {children}
    </Button>
  );
}
