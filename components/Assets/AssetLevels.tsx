import { useNavigation } from "@react-navigation/native";
import { Button } from "native-base";
import uuid from "react-native-uuid";

const AssetLevels = ({
  data,
  onPress,
  navigation,
}: {
  data: any[];
  onPress?: (obj: any) => void;
  navigation?: any;
}) => {
  return (
    <>
      {data.map((item) => (
        <Button
          w="xs"
          marginY="1"
          key={uuid.v4() as string}
          backgroundColor="#C70F2B"
          onPress={
            onPress
              ? onPress.bind(null, item)
              : () => {
                  navigation.navigate("AssetDetails", {
                    psa_id: item.psa_id,
                  });
                }
          }
        >
          {item.plant_name ||
            item.system_name ||
            item.system_asset_lvl5 ||
            item.system_asset_lvl6 ||
            item.system_asset_lvl7 ||
            item.pai ||
            item}
        </Button>
      ))}
    </>
  );
};

export default AssetLevels;
