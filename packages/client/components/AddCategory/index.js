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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function AddCategory(props) {
  const { isOpen, onClose, onSaveCategory } = props;
  const [imageSource, setImageSource] = useState();
  const [category, setCategory] = useState({ category: '' });
  const [isError, setisError] = useState(false);
  const [isCategoryError, setisCategoryError] = useState(false);

  useEffect(() => {
    const checkCategory = () => {
      if (category.category === '') {
        setisError(true);
        setisCategoryError(true);
        return;
      } else {
        setisError(false);
        setisCategoryError(false);
        return;
      }
    };
    checkCategory();
  }, [category]);

  const onHandleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const onCancel = () => {
    setCategory({ category: '' });
    setImageSource();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Kategory</ModalHeader>
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
                  Masukkan gambar category
                </FormLabel>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  id="image"
                  name="profileImage"
                  accept=".png, .svg"
                  onChange={(e) => {
                    setCategory({
                      ...category,
                      categoryImages: e.target.files[0],
                    });
                    setImageSource(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </FormControl>
            </Box>
          </Flex>
          <FormControl isInvalid={isCategoryError} mb={3}>
            <FormLabel fontSize={'sm'}>Nama Kategory :</FormLabel>
            <Input
              name="category"
              type="text"
              variant="filled"
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
              onSaveCategory(category);
              onCancel();
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
