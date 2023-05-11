import React from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import { CMMSAssetDetails } from "../../types/interfaces";
import { Icon, Text, VStack } from "native-base";

interface AssetHierachyProps {
  asset: CMMSAssetDetails;
}

export default function AssetHierachy(props: AssetHierachyProps) {
  return (
    <VStack>
      <Text underline>{props.asset.plant_name}</Text>
      <Text>
        <Icon as={FeatherIcon} name="corner-down-right"></Icon>
        {props.asset.system_name}
      </Text>
      {props.asset.system_asset_lvl5 != "" && (
        <Text>
          <Icon as={FeatherIcon} name="corner-down-right"></Icon>
          {props.asset.system_asset_lvl5}
        </Text>
      )}
      {props.asset.system_asset_lvl6 != "" && (
        <Text>
          <Icon as={FeatherIcon} name="corner-down-right"></Icon>
          {props.asset.system_asset_lvl6}
        </Text>
      )}
      {props.asset.system_asset_lvl7 != "" && (
        <Text>
          <Icon as={FeatherIcon} name="corner-down-right"></Icon>
          {props.asset.system_asset_lvl7}
        </Text>
      )}
      {props.asset.asset_type != props.asset.parent_asset && (
        <Text>
          <Icon as={FeatherIcon} name="corner-down-right"></Icon>
          {props.asset.asset_type}
        </Text>
      )}
      <Text bold>
        <Icon as={FeatherIcon} name="corner-down-right"></Icon>
        {props.asset.asset_name}
      </Text>
    </VStack>
  );
}
