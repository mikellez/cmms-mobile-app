import { Text } from "native-base";

const AssetLevelName = ({
  name,
  onPress,
}: {
  name: string;
  onPress?: () => void;
}) => {
  return (
    <>
      <Text>{" > "}</Text>
      <Text underline onPress={onPress}>
        {name}
      </Text>
    </>
  );
};

export default AssetLevelName;
