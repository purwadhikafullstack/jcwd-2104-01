import { Text, Image, Flex, Button, Box, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { api_origin } from '../../constraint';
import { getSession } from 'next-auth/react';
import axiosInstance from '../../src/config/api';

export default function ProductCard(props) {
  const toast = useToast();
  const addToCart = async () => {
    const session = await getSession();
    if (!session)
      return toast({
        title: 'Anda perlu melakukan login terlebih dahulu',
        status: 'error',
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const body = {
      quantity: 1,
      productId: props.product.productId,
    };
    const res = await axiosInstance.post('/carts/add-to-cart', body, config);
    toast({
      description: res.data.message,
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const router = useRouter();
  return (
    <Flex
      flexDir={'column'}
      marginTop={'4'}
      width={{ base: '40vw', md: '220px' }}
      maxWidth="250px"
      flexGrow={'1'}
      flexShrink="0"
      mx="2"
    >
      <Box
        cursor="pointer"
        onClick={() => router.push(`/product/${props.product.url}`)}
      >
        <Image
          src={api_origin + props.product.productImage}
          alt="vitamin"
          h="40"
          width="full"
        />
        <Text
          mx="4"
          mb="1"
          mt="3"
          noOfLines={1}
          fontSize={['sm', 'md']}
          lineHeight={4}
        >
          {props.product.productName}
        </Text>
        <Text
          mx="4"
          fontSize={['xs', 'sm']}
          lineHeight={3}
          fontWeight="normal"
          color="#6E6E6E"
          marginBlock={'2'}
        >
          {`${props.product.unit} - stock ${props.product.stock}`}
        </Text>
        <Text mx="4" fontSize={['xs', 'sm']} lineHeight={5} fontWeight="medium">
          Rp. {props?.product?.price?.toLocaleString('id')}
        </Text>
      </Box>
      {props.product.stock != 0 ? (
        <Button
          mx="4"
          onClick={addToCart}
          variant={'outline'}
          colorScheme="twitter"
          marginBlock={'22px'}
        >
          Tambah
        </Button>
      ) : (
        <Button
          mx="4"
          variant={'outline'}
          isDisabled={true}
          marginBlock={'22px'}
        >
          Tambah
        </Button>
      )}
    </Flex>
  );
}
