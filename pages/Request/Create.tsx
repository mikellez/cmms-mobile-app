import RequestContainer from '../../components/Request/RequestContainer';

const CreateRequest = ({ route, navigation }) => {
  return (
    <RequestContainer route={route} navigation={navigation} action="create"/>
  )
}

export default CreateRequest;