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
  FormLabel,
  FormControl,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import axiosInstance from '../../src/config/api';

function EditAddress(props) {
  const {
    isOpen,
    onClose,
    addressId,
    address,
    province_name,
    city,
    fetchUserAddresses,
  } = props;
  const [addressDetail, setAddressDetail] = useState(address);
  const [getProvince, setGetProvince] = useState([]);
  const [getCity, setGetCity] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [currentProvince, setCurrentProvince] = useState(province_name);
  const [currentCity, setCurrentCity] = useState(city);

  const toast = useToast();

  const splitProvince = selectedProvince?.split(',');
  const splitCity = selectedCity?.split(',');

  useEffect(() => {
    getAllProvince();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getAllCity();
    }
  }, [selectedProvince]);

  const onEditAddress = async () => {
    try {
      setDisabled(true);
      const session = await getSession();
      const { accessToken } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const body = {
        address: addressDetail,
        province_id: splitProvince[0],
        province: splitProvince[1],
        city_id: splitCity[0],
        city_name: splitCity[1],
      };

      const res = await axiosInstance.patch(
        `/addresses/edit/${addressId}`,
        body,
        config,
      );
      toast({
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setAddressDetail();
      setCurrentProvince();
      setCurrentCity();
      fetchUserAddresses();
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    } finally {
      setDisabled(false);
    }
  };

  const getAllProvince = async () => {
    try {
      const resGetProvince = await axiosInstance('/rajaongkir/provinsi');
      setGetProvince(resGetProvince.data.rajaongkir.results);
    } catch (error) {
      console.log({ error });
    }
  };
  const getAllCity = async () => {
    try {
      const resGetCity = await axiosInstance.get(
        `/rajaongkir/kota/${selectedProvince}`,
      );
      setGetCity(resGetCity.data.rajaongkir.results);
    } catch (error) {
      console.log({ error });
    }
  };

  const renderProvince = () => {
    return getProvince.map((province) => (
      <option
        key={province.province_id}
        value={`${province.province_id},${province.province}`}
      >
        {province.province}
      </option>
    ));
  };

  const renderCity = () => {
    return getCity.map((city) => (
      <option key={city.city_id} value={`${city.city_id},${city.city_name}`}>
        {city.city_name}
      </option>
    ));
  };

  const onHandleChange = (e) => {
    setAddressDetail(e.target.value);
  };

  const onHandleChangeProvince = (e) => {
    setSelectedProvince(e.target.value);
    setCurrentProvince(e.target.value);
  };

  const onHandleChangeCity = (e) => {
    setSelectedCity(e.target.value);
    setCurrentCity(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ubah Alamat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel fontSize={'sm'}>Alamat</FormLabel>
            <Input
              name="address"
              type="text"
              value={addressDetail}
              variant="filled"
              mb={3}
              fontWeight={400}
              placeholder="Tulis Alamat"
              onChange={onHandleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize={'sm'}>Provinsi</FormLabel>
            <Select
              _focusVisible
              name="province_id"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              placeholder="Pilih Provinsi"
              variant="filled"
              value={currentProvince}
              onChange={onHandleChangeProvince}
            >
              {renderProvince()}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize={'sm'}>Kota</FormLabel>
            <Select
              _focusVisible
              name="city_id"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              placeholder="Pilih Kota"
              variant="filled"
              value={currentCity}
              onChange={onHandleChangeCity}
            >
              {renderCity()}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            isDisabled={disabled}
            colorScheme="twitter"
            mr={3}
            onClick={() => onEditAddress()}
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditAddress;
