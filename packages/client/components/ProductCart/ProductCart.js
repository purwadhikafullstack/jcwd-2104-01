import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { FcFullTrash } from 'react-icons/fc';
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Img,
  Text,
} from '@chakra-ui/react';

import React, { useEffect, useState } from 'react';

import axiosInstance from '../../src/config/api';
import { getSession } from 'next-auth/react';
import { api_origin } from '../../constraint';

const Cartlist = ({
  cartId,
  productImage,
  productName,
  desc,
  price,
  quantity,
  unit,
  stock,
  fetchCartList,

  totalPrice,
}) => {
  const [selected, setSelected] = useState(false);
  const [input, setInput] = useState(quantity);

  useEffect(() => {
    if (quantity <= stock) {
      editQuantity();
      fetchCartList();
      totalPrice();
    }
  }, [input]);
  const increase = () => {
    let count = parseInt(input) + 1;
    count = count >= stock ? stock : count;
    setInput(input + 1);
  };

  const decrase = () => {
    let count = parseInt(input.quantity) - 1;
    count = count < 1 ? 1 : count;
    setInput(input - 1);
  };

  const editQuantity = async () => {
    const session = await getSession();
    const { accessToken } = session.user;

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    try {
      const respon = await axiosInstance.patch(
        `/carts/edit-quantity/${cartId}`,
        { quantity: input },
        config,
      );
      fetchCartList();
      totalPrice();
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async () => {
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    try {
      const respon = await axiosInstance.delete(
        `/carts/delete-cart/${cartId}`,
        config,
      );

      window.location.reload();
      fetchCartList();
      totalPrice();
    } catch (error) {
      console.log(error);
    }
  };
  const selectedProduct = () => {
    if (!toggleSelected) {
      setSelected((prev) => [...prev, cartId]);
      setSelected(true);
    } else {
      setSelected(selected.filter((event) => event.id !== cartId));
      setToggleSelected(false);
    }
  };
  return (
    <>
      <GridItem colSpan={5}>
        <Box width="100%" justifyContent="space-between">
          <Box display="flex" justifyContent="left">
            <Img
              width={['71px', '86px', '86px']}
              height={['71px', '86px', '86px']}
              mr={3}
              src={api_origin + productImage}
            />
            <Box width="100%" justifyContent="space-between">
              <Box justifyContent="space-between" width="100%">
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Box>
                    <Text as={'b'}>{productName}</Text>
                    <Text variant="caption-bold">{desc}</Text>
                  </Box>

                  <Box
                    display={['block', 'flex']}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box textAlign={['right', 'center']}>
                      <Text variant="subtitle-bold">
                        Rp. {price.toLocaleString('id')}
                      </Text>
                    </Box>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={2}
                >
                  <Text variant="caption">Kemasan : {unit}</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </GridItem>
      <GridItem colSpan={5} padding={[0, 4]} alignItems="center">
        <Grid templateColumns="repeat(5,1fr)">
          <GridItem colSpan={[0, 1]} />
          <GridItem colSpan={[5, 4]}>
            <Box display="flex" alignItems="center" justifyContent="end">
              <HStack spacing={4}>
                <Box borderLeft="1px solid teal" onClick={() => onDelete()}>
                  <Icon ml={3} color="red" as={FcFullTrash} />
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  height="30px"
                  background="#F6FAFB"
                  borderRadius="8px"
                >
                  <IconButton
                    onClick={() => decrase()}
                    borderLeftRadius="8px"
                    isDisabled={input <= 1}
                    background="#F6FAFB"
                    boxSize="30px"
                  >
                    <Icon color="teal" as={MinusIcon} />
                  </IconButton>
                  <Text mx={6}>{input}</Text>
                  <IconButton
                    onClick={() => increase()}
                    borderRightRadius="8px"
                    isDisabled={input == stock}
                    background="#F6FAFB"
                    boxSize="30px"
                  >
                    <Icon color="teal" as={AddIcon} />
                  </IconButton>
                </Box>
              </HStack>
            </Box>
          </GridItem>
        </Grid>
      </GridItem>
      <Grid
        background="#F6FAFB"
        width="100%"
        display={['flex', 'none']}
        paddingY={2}
        paddingX={2}
        bottom={0}
        position="fixed"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box pl="10px">
          <Text variant="subtitle-bold">Total</Text>
          <Text variant="subtitle-bold">Rp. {price.toLocaleString('id')}</Text>
        </Box>
        <Button width="60%" variant="outline" colorScheme="twitter">
          Bayar
        </Button>
      </Grid>
    </>
  );
};
export default Cartlist;
