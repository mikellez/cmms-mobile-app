import { Center, Flex, ScrollView, Text, VStack } from "native-base";
import { ModuleScreen } from "../../components/ModuleLayout";
import { useEffect, useState } from "react";
import instance from "../../axios.config";
import { CMMSAssetDetails } from "../../types/interfaces";

const Details = ({ route, navigation }) => {
  const [psaId, setPsaId] = useState(route.params.psa_id);
  const [isLoading, setIsLoading] = useState(false);
  const [assetDetails, setAssetDetails] = useState<CMMSAssetDetails>(null);

  useEffect(() => {
    setIsLoading(true);
    const sendRequest = async () => {
      const res = await instance.get("/api/assetDetails/" + psaId);
      console.log(res.data);
      setAssetDetails(res.data[0]);
      setIsLoading(false);
    };
    sendRequest().catch((err) => console.log(err));
  }, [psaId]);

  return (
    <ModuleScreen navigation={navigation}>
      <ScrollView>
        <Center>
          <Text>{psaId}</Text>
        </Center>
        {/* <Flex flexDirection={"column"}></Flex> */}
        {/* <VStack></VStack> */}
      </ScrollView>
    </ModuleScreen>
  );
};

export default Details;
