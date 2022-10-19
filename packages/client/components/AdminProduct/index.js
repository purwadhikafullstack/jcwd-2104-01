import {
  Box,
  Button,
  Flex,
  Image,
  Spacer,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { api_origin } from '../../constraint';
import axiosInstance from '../../src/config/api';
import EditProduct from '../EditProduct';

export default function AdminProduct(props) {
  const toast = useToast();
  const router = useRouter();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const cancelDeleteRef = useRef();

  const onDeleteController = async () => {
    try {
      let path = router.asPath;
      const result = await axiosInstance.delete(
        `/product/${props.product.productId}`,
      );
      toast({
        title: result.data.message,
        status: 'success',
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
      onDeleteClose();
      router.push(path);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Flex my="4" boxShadow={'md'} h="15vh">
        <Box w="20%">
          <Image
            src={api_origin + props.product.productImage}
            alt="vitamin"
            h="full"
            w="full"
            p="2"
          />
        </Box>
        <Flex direction="column">
          <Text>{props.product.productName}</Text>
          <Text>Rp. {props.product?.price?.toLocaleString('id')}</Text>
          <Text>{`${props.product.unit} - stock ${props.product.stock}`}</Text>
          {/* <Button
            cursor="pointer"
            onClick={() => router.push(`/inventory/${props.product.productId}`)}
          >
            Detail
          </Button> */}
          <Button
            w="fit-content"
            cursor="pointer"
            variant="link"
            colorScheme="twitter"
            onClick={() =>
              router.push(`/admin/inventory/${props.product.productId}`)
            }
          >
            Stock Detail
          </Button>
        </Flex>
        <Spacer />
        <Flex w="20%" justifyContent="space-evenly" alignItems={'center'}>
          <Button variant="outline" colorScheme="red" onClick={onDeleteOpen}>
            Hapus
          </Button>
          {!router.asPath.includes('isRacikan') && (
            <Button
              variant="outline"
              colorScheme="twitter"
              onClick={onEditOpen}
            >
              Edit
            </Button>
          )}
        </Flex>
      </Flex>
      <EditProduct
        isOpen={isEditOpen}
        onClose={onEditClose}
        products={props.product}
        categories={props.categories}
      />
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Kategori
            </AlertDialogHeader>

            <AlertDialogBody>
              Apakah kamu yakin ? Kamu tidak akan bisa mengembalikan product
              yang sudah dihapus
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelDeleteRef} onClick={onDeleteClose}>
                Batalkan
              </Button>
              <Button colorScheme="red" onClick={onDeleteController} ml={3}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
