import RequestContainer from '../../components/Request/RequestContainer';

const AssignRequest = ({ route, navigation }) => {
  return (
    <RequestContainer route={route} navigation={navigation} action="assign"/>
  )
}

export default AssignRequest;