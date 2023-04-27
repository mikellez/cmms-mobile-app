import RequestContainer from "../../components/Request/RequestContainer";

const CompleteRequest = ({ route, navigation }) => {
  return (
    <RequestContainer route={route} navigation={navigation} action="complete"/>
  )
}

export default CompleteRequest;