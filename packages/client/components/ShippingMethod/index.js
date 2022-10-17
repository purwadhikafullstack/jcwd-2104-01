import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  FormLabel,
  FormControl,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axiosInstance from '../../src/config/api';

function ShippingMethod(props) {
  const {
    isOpen,
    onClose,
    setSelectedShippingCost,
    setSelectedShipper,
    totalPrice,
  } = props;

  const [getOngkir, setGetOngkir] = useState([]);
  const [selectedKurir, setSelectedKurir] = useState('');
  const [selectedOngkir, setSelectedOngkir] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (selectedKurir) {
      fetchOngkir();
    }
  }, [selectedKurir]);

  const fetchOngkir = async () => {
    try {
      const origin = '152';
      const destination = props.destination;
      const weight = 1000;
      const courier = selectedKurir;

      const resGetOngkir = await axiosInstance.get(
        `rajaongkir/ongkos/${origin}/${destination}/${weight}/${courier}`,
      );
      setGetOngkir(resGetOngkir.data.rajaongkir.results[0].costs);
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderOngkir = () => {
    if (selectedKurir == 'pos') {
      return getOngkir.map((ongkir) => (
        <option
          key={ongkir.service}
          value={`${ongkir.service},${ongkir.cost[0].value},${ongkir.cost[0].etd}`}
        >
          {`${ongkir.description} (${ongkir.service}), Biaya: Rp ${Number(
            ongkir.cost[0].value,
          ).toLocaleString('id')}, Estimasi: ${ongkir.cost[0].etd}`}
        </option>
      ));
    } else {
      return getOngkir.map((ongkir) => (
        <option
          key={ongkir.service}
          value={`${ongkir.service},${ongkir.cost[0].value},${ongkir.cost[0].etd}`}
        >
          {`${ongkir.description} (${ongkir.service}), Biaya: Rp ${Number(
            ongkir.cost[0].value,
          ).toLocaleString('id')}, Estimasi: ${ongkir.cost[0].etd} hari`}
        </option>
      ));
    }
  };

  const onHandleChangeKurir = (e) => {
    setSelectedKurir(e.target.value);
  };

  const onHandleChangeOngkir = (e) => {
    setSelectedOngkir(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pilih Metode Pengiriman</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel fontSize={'sm'}>Kurir Pengiriman</FormLabel>
            <Select
              _focusVisible
              name="kurir"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              placeholder="Pilih Kurir"
              variant="filled"
              onChange={onHandleChangeKurir}
            >
              <option value="jne">Jalur Nugraha Ekakurir (JNE)</option>
              <option value="tiki">Citra Van Titipan Kilat (TIKI)</option>
              <option value="pos">POS Indonesia (POS)</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize={'sm'}>Jenis Pengiriman</FormLabel>
            <Select
              _focusVisible
              name="ongkir"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              placeholder="Pilih Jenis Pengiriman"
              variant="filled"
              onChange={onHandleChangeOngkir}
            >
              {renderOngkir()}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              setSelectedKurir('');
              setSelectedOngkir('');
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="twitter"
            mr={3}
            onClick={() => {
              setSelectedShippingCost(selectedOngkir);
              setSelectedShipper(selectedKurir);
              toast({
                description: 'Berhasil Memilih Metode Pengiriman',
                position: 'top',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
              onClose();
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ShippingMethod;
