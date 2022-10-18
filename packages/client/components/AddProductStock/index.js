import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../../src/config/api';
import { getSession } from 'next-auth/react';
import {
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
} from '@chakra-ui/react';

export default function AddProductStock(props) {
  const {
    isOpen,
    onClose,
    product,
    fetchproductStock,
    fetchProduct,
    fetchproductStockNoFilter,
  } = props;
  const [updateStock, setUpdateStock] = useState();
  const [disabled, setDisabled] = useState(false);
  const toast = useToast();

  const onAddProductStock = async () => {
    try {
      setDisabled(true);
      const session = await getSession();
      const { accessToken } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const body = {
        productId: product.productId,
        updateStock,
        defaultStock: product.stock,
        totalPrice: updateStock * product.price,
      };

      if (product.unit != 'Racikan') {
        var resss = await axiosInstance.patch('/product/stock', body, config);
      } else {
        var resss = await axiosInstance.patch('/product/racikan', body, config);
      }

      toast({
        description: resss.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setUpdateStock();
      fetchproductStock();
      fetchproductStockNoFilter();
      fetchProduct();
      setDisabled(false);
    } catch (error) {
      toast({
        description: error.response.data.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Stok Produk</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            {/* <FormLabel>Masukan Jumlah Stock</FormLabel> */}
            <Input
              type="number"
              name="stokQuantity"
              value={updateStock}
              variant="filled"
              placeholder="Masukan Jumlah Stok"
              onChange={(e) => setUpdateStock(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            isDisabled={disabled}
            colorScheme="twitter"
            mr={3}
            onClick={() => {
              onAddProductStock();
            }}
          >
            Tambah
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
