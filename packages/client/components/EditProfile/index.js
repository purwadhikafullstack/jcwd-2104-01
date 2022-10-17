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
  Select,
  Image,
  FormLabel,
  FormControl,
  Flex,
  Box,
  FormErrorMessage,
  Text,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { api_origin } from '../../constraint';
import * as yup from 'yup';

function EditProfile(props) {
  const { isOpen, onClose, userProfile, onSaveProfile } = props;
  const [user, setUser] = useState(userProfile);
  const [imageSource, setImageSource] = useState(api_origin + user.image);
  const [isEmailError, setisEmailError] = useState(true);
  const [isError, setisError] = useState(false);
  const [isFirstNameError, setisFirstNameError] = useState(false);
  const [isPhoneError, setisPhoneError] = useState(false);
  const { first_name, last_name, email, phone, birthDate, image, gender } =
    user;

  let schema = yup.object().shape({
    email: yup.string().email().required('email tidak boleh kosong'),
  });

  useEffect(() => {
    const checkFirstName = () => {
      if (user.profileImages?.size >= 1048576) {
        return setisError(true);
      }
      if (user.first_name === '') {
        setisError(true);
        setisFirstNameError(true);
        return;
      }
      if (user.phone == '') {
        setisError(true);
        setisPhoneError(true);
      } else if (user.phone.length < 9) {
        setisError(true);
        setisPhoneError(true);
      } else if (
        !user.phone.match(
          /^(([1-9]{2,4})[ \\-]*)*?[1-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
        )
      ) {
        setisError(true);
        setisPhoneError(true);
      } else {
        setisError(false);
        setisFirstNameError(false);
        setisPhoneError(false);
        return;
      }
    };
    checkFirstName();
    checkValidity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const cancelImage = () => {
    setImageSource(api_origin + userProfile.image);
    delete user.profileImages;
    setisError(false);
  };

  const checkValidity = async () => {
    const isEmailValid = await schema.isValid({
      email: user.email,
    });
    setisEmailError(isEmailValid);
  };

  const onHandleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    checkValidity();
  };

  const onCancel = () => {
    setUser(userProfile);
    setImageSource(api_origin + userProfile.image);
    delete user.profileImages;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems="center" flexDir={'column'}>
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
            <Box>
              <FormControl>
                <FormLabel
                  mx={'auto'}
                  htmlFor="image"
                  cursor={'pointer'}
                  color="twitter.500"
                  textAlign={'center'}
                >
                  Ubah Foto Profile
                </FormLabel>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  id="image"
                  name="profileImage"
                  accept=".png, .jpg, .gif"
                  onChange={(e) => {
                    setUser({ ...user, profileImages: e.target.files[0] });
                    setImageSource(URL.createObjectURL(e.target.files[0]));
                  }}
                />

                {user.profileImages?.size >= 1048576 && (
                  <Flex direction={'column'}>
                    <Text fontSize={'xs'} color="red">
                      Maksimal Ukuran Gambar adalah 1 Mb
                    </Text>
                    <Button onClick={cancelImage} mx="auto" textColor={'red'}>
                      cancel
                    </Button>
                  </Flex>
                )}
              </FormControl>
            </Box>
          </Flex>
          <FormControl isInvalid={isFirstNameError} mb={3}>
            <FormLabel fontSize={'sm'}>Nama Depan :</FormLabel>
            <Input
              name="first_name"
              type="text"
              value={first_name}
              variant="filled"
              onChange={onHandleChange}
            />
            {isFirstNameError && (
              <FormErrorMessage fontSize={'xs'}>
                Nama depan tidak boleh kosong
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl mb={3}>
            <FormLabel fontSize={'sm'}>Nama Belakang :</FormLabel>
            <Input
              name="last_name"
              type="text"
              value={last_name}
              variant="filled"
              onChange={onHandleChange}
            />
          </FormControl>
          <FormControl isInvalid={!isEmailError} mb={3}>
            <FormLabel fontSize={'sm'}>Email :</FormLabel>
            <Input
              name="email"
              type="text"
              value={email}
              variant="filled"
              onChange={onHandleChange}
            />
            {!isEmailError && (
              <FormErrorMessage fontSize={'xs'}>
                Email tidak valid
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl>
            <FormLabel fontSize={'sm'}>Jenis Kelamin :</FormLabel>
            <Select
              name="gender"
              value={gender}
              variant="filled"
              onChange={onHandleChange}
              mb={3}
            >
              <option value="none" selected>
                pilih jenis kelamin
              </option>
              <option value="Male">Laki-laki</option>
              <option value="Female">Perempuan</option>
            </Select>
          </FormControl>
          <FormControl isInvalid={isPhoneError} mb={3}>
            <FormLabel fontSize={'sm'}>Nomor Handphone :</FormLabel>
            <InputGroup>
              <InputLeftAddon children="+62" />
              <Input
                name="phone"
                type="number"
                value={phone}
                variant="filled"
                onChange={onHandleChange}
              />
            </InputGroup>
            {isPhoneError && (
              <FormErrorMessage fontSize={'xs'}>
                {user.phone == ''
                  ? 'Nomor hanphone tidak boleh kosong'
                  : 'Panjang minimal adalah 10 dan tidak boleh diawal dengan 0'}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl>
            <FormLabel fontSize={'sm'}>Tanggal Lahir :</FormLabel>
            <Input
              name="birthDate"
              value={birthDate?.slice(0, 10)}
              onChange={onHandleChange}
              type="date"
              max="2017-01-01"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button textColor={'red'} mr={3} onClick={onCancel}>
            Reset
          </Button>
          <Button
            isDisabled={!isEmailError || isError}
            colorScheme="green"
            mr={3}
            onClick={() => onSaveProfile(user)}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditProfile;
