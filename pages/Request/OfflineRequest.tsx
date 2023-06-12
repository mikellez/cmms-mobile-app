import { NativeBaseProvider } from 'native-base';

import App from '../App';
import OfflineRequestContainer from '../../components/Request/OfflineRequestContainer';

const OfflineRequest = ({ route, navigation }) => {

  return (
    <App navigation={navigation} layout="empty">
      <OfflineRequestContainer navigation={navigation} route={route}/>
    </App>

  )
}

export default OfflineRequest;