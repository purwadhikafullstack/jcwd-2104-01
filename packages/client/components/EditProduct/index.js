import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Image,
  FormLabel,
  FormControl,
  Flex,
  Box,
  FormErrorMessage,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { api_origin } from '../../constraint';
import axiosInstance from '../../src/config/api';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function EditProduct(props) {
  const { isOpen, onClose, products, categories } = props;
  const [imageSource, setImageSource] = useState(
    api_origin + products.productImage,
  );
  const [product, setProduct] = useState(products);
  const [isError, setisError] = useState(false);
  const [isCategoryError, setisCategoryError] = useState(false);

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const checkProduct = () => {
      if (product.productName === '') {
        setisError(true);
        setisCategoryError(true);
        return;
      } else {
        setisError(false);
        setisCategoryError(false);
        return;
      }
    };
    checkProduct();
  }, [product]);

  const onUpdateProduct = async (body) => {
    if (!body.categoryId) {
      return alert('Harap isi kolom kategori obat');
    }
    let path = router.asPath;
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    try {
      const updateProduct = {
        productId: body.productId,
        productName: body.productName,
        desc: body.desc,
        price: body.price,
        unit: body.unit,
        satuanUnit: body.satuanUnit,
        quantity: body.detailProduct.quantity,
        categoryId: body.categoryId,
      };
      if (body.productImage.name) {
        const gambar = body.productImage;
        const data = new FormData();
        const fileName = Date.now() + gambar.name;
        data.append('name', fileName);
        data.append('gambar', gambar);
        updateProduct.productImage = `/public/product/${fileName}`;
        try {
          await axiosInstance.post('/product/upload', data, config);
        } catch (error) {
          return alert(error.response.data.message);
        }
      }
      try {
        const res = await axiosInstance.patch(
          '/product',
          updateProduct,
          config,
        );
        toast({
          title: res.data.message,
          status: 'success',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        return alert(error.response?.data?.message);
      }
      onClose();
      router.push(path);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  const renderCategory = () => {
    return categories.map((category) => (
      <option key={category.categoryId} value={category.categoryId}>
        {category.category}
      </option>
    ));
  };

  const onHandleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const onCancel = () => {
    setProduct({
      productName: products.productName,
      categoryId: products.categoryId,
      price: products.price,
      unit: products.unit,
      satuanUnit: products.satuanUnit,
      desc: products.desc,
      detailProduct: products.detailProduct,
    });
    setImageSource(api_origin + products.productImage);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ubah Produk</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems="center" flexDir={'column'}>
            {imageSource && (
              <Box>
                <Image
                  objectFit={'cover'}
                  mb="4"
                  rounded={'full'}
                  w="80px"
                  h="80px"
                  src={imageSource}
                  alt="profile image"
                />
              </Box>
            )}
            <Box>
              <FormControl>
                <FormLabel
                  mx={'auto'}
                  htmlFor="image"
                  cursor={'pointer'}
                  color="twitter.500"
                  textAlign={'center'}
                >
                  Masukkan gambar Produk
                </FormLabel>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  id="image"
                  name="productImage"
                  accept=".png, .svg"
                  onChange={(e) => {
                    setProduct({
                      ...product,
                      productImage: e.target.files[0],
                    });
                    setImageSource(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </FormControl>
            </Box>
          </Flex>
          <FormControl isInvalid={isCategoryError} mb={3}>
            <FormLabel fontSize={'sm'}>Nama Produk :</FormLabel>
            <Input
              name="productName"
              type="text"
              value={product.productName}
              variant="filled"
              onChange={onHandleChange}
            />
            {isCategoryError && (
              <FormErrorMessage fontSize={'xs'}>
                Nama produk tidak boleh kosong
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={isCategoryError} mb={3}>
            <FormLabel fontSize={'sm'}>Kategori :</FormLabel>
            <Select
              _focusVisible
              name="categoryId"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              placeholder="Pilih Kategori"
              variant="filled"
              onChange={onHandleChange}
              // value={products.Categories[0].category}
            >
              {renderCategory()}
            </Select>
            {isCategoryError && (
              <FormErrorMessage fontSize={'xs'}>
                kategori obat tidak boleh kosong
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={isCategoryError} mb={3}>
            <FormLabel fontSize={'sm'}>Kemasan :</FormLabel>
            <Select
              _focusVisible
              name="unit"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              placeholder="Pilih Kemasan"
              variant="filled"
              onChange={onHandleChange}
              value={product.unit}
            >
              <option value="botol">Botol</option>
              <option value="strip">Strip</option>
              <option value="box">Box</option>
            </Select>
            {isCategoryError && (
              <FormErrorMessage fontSize={'xs'}>
                Kemasan obat tidak boleh kosong
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={isCategoryError} mb={3}>
            <FormLabel fontSize={'sm'}>Bentuk Obat :</FormLabel>
            <Select
              _focusVisible
              name="satuanUnit"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              placeholder="Pilih Bentuk Obat"
              variant="filled"
              onChange={onHandleChange}
              value={product.satuanUnit}
            >
              <option value="tablet">Tablet</option>
              <option value="kapsul">Kapsul</option>
              <option value="kaplet">Kaplet</option>
              <option value="pil">Pil</option>
              <option value="mL">mililiter</option>
            </Select>
            {isCategoryError && (
              <FormErrorMessage fontSize={'xs'}>
                Bentuk obat tidak boleh kosong
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={isCategoryError} mb={3}>
            <FormLabel fontSize={'sm'}>Jumlah Obat per-Kemasan :</FormLabel>
            <Input
              name="quantity"
              type="number"
              value={product.detailProduct?.quantity}
              variant="filled"
              onChange={(e) => {
                setProduct({
                  ...product,
                  detailProduct: { [e.target.name]: Number(e.target.value) },
                });
              }}
            />
            {isCategoryError && (
              <FormErrorMessage fontSize={'xs'}>
                Jumlah obat per-kemasan tidak boleh kosong
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={isCategoryError} mb={3}>
            <FormLabel fontSize={'sm'}>Harga :</FormLabel>
            <Input
              name="price"
              type="number"
              value={product.price}
              variant="filled"
              onChange={onHandleChange}
            />
            {isCategoryError && (
              <FormErrorMessage fontSize={'xs'}>
                Nama kategori tidak boleh kosong
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={isCategoryError} mb={3}>
            <FormLabel fontSize={'sm'}>Deskripsi :</FormLabel>
            <Textarea
              name="desc"
              type="text"
              value={product.desc}
              onChange={onHandleChange}
            />
            {isCategoryError && (
              <FormErrorMessage fontSize={'xs'}>
                Nama kategori tidak boleh kosong
              </FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button textColor={'red'} mr={3} onClick={onCancel}>
            Reset
          </Button>
          <Button
            isDisabled={isError}
            colorScheme="green"
            mr={3}
            onClick={() => {
              onUpdateProduct(product);
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
