import { HStack, Icon, IconButton, Image } from "native-base";

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Header = () => {
  return (
    <HStack bg="#D9D9D9" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%" borderBottomColor={'#C8102E'} borderBottomWidth={2}>
      <HStack alignItems="center">
        <IconButton icon={<Icon size="lg" as={MaterialIcons} name="menu" color="#C8102E" />} />
      </HStack>
      <HStack alignItems="center">
        <Image size={'2xl'} style={{ resizeMode: 'contain', width: 150, height: 20 }} alt="fallback text" source={ require('../assets/keppellogo.png')} />
      </HStack>
      <HStack alignItems="center">
        <IconButton icon={<Icon size="lg" as={FontAwesome} name="user-circle-o" color="#C8102E" />} />
      </HStack>
    </HStack>
  );
}

export default Header;