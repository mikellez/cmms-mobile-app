import React, { useEffect, useState } from "react";
import { ModuleScreen } from "../../components/ModuleLayout";
import { Button, Center, Link, ScrollView, Text, VStack } from "native-base";
import instance from "../../axios.config";
import AssetLevels from "../../components/Assets/AssetLevels";
import AssetLevelName from "../../components/Assets/AssetLevelName";

const Assets = ({ navigation }) => {
  const inititalHierarchyState = {
    level: 1,
    plant: null,
    system: null,
    system_asset: null,
    system_asset_name: null,
    asset_type: null,
    sub_component1: null,
    plant_asset_instrument: null,
  };
  const [loading, setLoading] = useState(false);
  const [plants, setPlants] = useState(null);
  const [systems, setSystems] = useState(null);
  const [systemAssets, setSystemAssets] = useState(null);
  const [systemAssetNames, setSystemAssetNames] = useState(null);
  const [subComponents, setSubComponents] = useState(null);
  const [assetTypes, setAssetTypes] = useState(null);
  const [hierarchy, setHierarchy] = useState(inititalHierarchyState);

  // Reset all state on unmount
  useEffect(() => {
    const reset = navigation.addListener("focus", () => {
      setHierarchy(inititalHierarchyState);
    });
    return reset;
  }, [navigation]);

  const sendRequest = async (url: string) => {
    setLoading(true);
    try {
      const res = await instance.get(url);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllPlants = async () => {
    const data = await sendRequest(`/api/getPlants`);
    setPlants(data);
    setLoading(false);
  };

  const fetchLvl3 = async () => {
    const data = await sendRequest(`/api/asset/mobile/${hierarchy.plant.id}`);
    setSystems(data);
    setLoading(false);
  };

  const fetchLvl4 = async () => {
    const data = await sendRequest(
      `/api/asset/mobile/${hierarchy.plant.id}/${hierarchy.system.id}`
    );
    setSystemAssets(data);
    setLoading(false);
  };

  // optional 5, 6
  const fetchLvl5 = async () => {
    const data = await sendRequest(
      `/api/asset/mobile/${hierarchy.plant.id}/${
        hierarchy.system.id
      }/${hierarchy.system_asset.replaceAll(" ", "_")}`
    );
    // console.log(data);

    if (data && data.dict) {
      setAssetTypes(data);
    } else {
      setSystemAssetNames(data);
    }
    setLoading(false);
  };

  const fetchLvl6 = async () => {
    const data = await sendRequest(
      `/api/asset/mobile/${hierarchy.plant.id}/${
        hierarchy.system.id
      }/${hierarchy.system_asset.replaceAll(
        " ",
        "_"
      )}/${hierarchy.system_asset_name.replaceAll(" ", "_")}`
    );

    // console.log(data);

    if (data) {
      setAssetTypes(data);
      if (data.subComponents && data.subComponents.length > 0) {
        setSubComponents(data.subComponents);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (hierarchy.level == 1) {
      fetchAllPlants();
    } else if (hierarchy.level == 2) {
      fetchLvl3();
    } else if (hierarchy.level == 3) {
      fetchLvl4();
    } else if (hierarchy.level == 4) {
      fetchLvl5();
    } else if (hierarchy.level == 5 && systemAssetNames) {
      fetchLvl6();
    }
  }, [hierarchy.level]);

  const showLevels =
    (hierarchy.level === 4 && !systemAssetNames && !subComponents) ||
    (hierarchy.level === 5 && systemAssetNames && !subComponents) ||
    (hierarchy.level === 6 && systemAssetNames && subComponents);

  const sortData = (data: any[], property?: string | null) => {
    return data.sort((a, b) => {
      let x = property ? a[property] : a;
      let y = property ? b[property] : b;
      return x < y ? -1 : x > y ? 1 : 0;
    });
  };

  if (loading) {
    return (
      <ModuleScreen navigation={navigation}>
        <Center>
          <Text>Loading...</Text>
        </Center>
      </ModuleScreen>
    );
  }

  return (
    <ModuleScreen navigation={navigation}>
      <ScrollView>
        <Center>
          <Text>
            {hierarchy.level === 1 && "Select a plant"}
            <Text
              underline
              onPress={() =>
                setHierarchy((prevState) => {
                  return {
                    ...inititalHierarchyState,
                    level: 2,
                    plant: prevState.plant,
                  };
                })
              }
            >
              {hierarchy.plant && hierarchy.plant.plant}
            </Text>

            {hierarchy.system && (
              <AssetLevelName
                name={hierarchy.system.system}
                onPress={() =>
                  setHierarchy((prevState) => {
                    return {
                      ...inititalHierarchyState,
                      level: 3,
                      plant: prevState.plant,
                      system: prevState.system,
                    };
                  })
                }
              />
            )}
            {hierarchy.system_asset && (
              <AssetLevelName
                name={hierarchy.system_asset}
                onPress={() =>
                  setHierarchy((prevState) => {
                    return {
                      ...inititalHierarchyState,
                      level: 4,
                      plant: prevState.plant,
                      system: prevState.system,
                      system_asset: prevState.system_asset,
                    };
                  })
                }
              />
            )}

            {hierarchy.system_asset_name && (
              <AssetLevelName
                name={hierarchy.system_asset_name}
                onPress={() =>
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      level: 5,
                      asset_type: null,
                      sub_component1: null,
                      plant_asset_instrument: null,
                    };
                  })
                }
              />
            )}

            {hierarchy.sub_component1 && (
              <AssetLevelName
                name={hierarchy.sub_component1}
                onPress={() =>
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      level: 6,
                      asset_type: null,
                      plant_asset_instrument: null,
                    };
                  })
                }
              />
            )}

            {hierarchy.asset_type && (
              <AssetLevelName name={hierarchy.asset_type} />
            )}
          </Text>
        </Center>
        <Center marginY={3}>
          <VStack>
            {hierarchy.level == 1 && plants && (
              <AssetLevels
                data={sortData(plants, "plant_name")}
                onPress={(plant) =>
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      level: 2,
                      plant: {
                        id: plant.plant_id,
                        plant: plant.plant_name,
                      },
                    };
                  })
                }
              />
            )}

            {hierarchy.level == 2 && systems && (
              <AssetLevels
                data={sortData(systems, "system_name")}
                onPress={(system) =>
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      level: 3,
                      system: {
                        id: system.system_id,
                        system: system.system_name,
                      },
                    };
                  })
                }
              />
            )}

            {hierarchy.level == 3 && systemAssets && (
              <AssetLevels
                data={sortData(systemAssets, "system_asset_lvl5")}
                onPress={(systemAsset) =>
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      level: 4,
                      system_asset: systemAsset.system_asset_lvl5,
                    };
                  })
                }
              />
            )}

            {hierarchy.level == 4 && systemAssetNames && (
              <AssetLevels
                data={sortData(systemAssetNames, "system_asset_lvl6")}
                onPress={(systemAssetName) =>
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      level: 5,
                      system_asset_name: systemAssetName.system_asset_lvl6,
                    };
                  })
                }
              />
            )}

            {hierarchy.level == 5 && systemAssetNames && subComponents && (
              <AssetLevels
                data={sortData(subComponents, "system_asset_lvl7")}
                onPress={(subComponent) =>
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      level: 6,
                      sub_component1: subComponent.system_asset_lvl7,
                    };
                  })
                }
              />
            )}

            {showLevels &&
              assetTypes &&
              assetTypes.dict &&
              hierarchy.system_asset &&
              !hierarchy.asset_type && (
                <AssetLevels
                  data={sortData(Object.keys(assetTypes.dict))}
                  onPress={(asset) =>
                    setHierarchy((prevState) => {
                      return {
                        ...prevState,
                        level: prevState.level + 1,
                        asset_type: asset,
                      };
                    })
                  }
                />
              )}

            {showLevels &&
              assetTypes &&
              assetTypes.pai &&
              hierarchy.system_asset &&
              !hierarchy.asset_type &&
              !hierarchy.plant_asset_instrument && (
                <AssetLevels
                  data={sortData(assetTypes.pai, "pai")}
                  navigation={navigation}
                />
              )}

            {hierarchy.asset_type &&
              assetTypes.dict[hierarchy.asset_type].length > 0 &&
              assetTypes.dict[hierarchy.asset_type].map((asset) => (
                <Button
                  w="xs"
                  marginY={1}
                  key={Math.random()}
                  backgroundColor="#C70F2B"
                  onPress={() => {
                    navigation.navigate("AssetDetails", {
                      psa_id: asset.psa_id,
                    });
                  }}
                >
                  {asset.pai}
                </Button>
              ))}

            {/* {hierarchy.asset_type &&
              assetTypes.dict[hierarchy.asset_type].length > 0 && (
                <AssetLevels
                  data={assetTypes.dict[hierarchy.asset_type]}
                  // onPress={() =>
                  //   setHierarchy((prevState) => {
                  //     return {
                  //       ...prevState,
                  //     };
                  //   })
                  // }
                />
              )} */}
          </VStack>
          {hierarchy.level > 1 && (
            <Button
              backgroundColor={"gray.400"}
              marginY={2}
              onPress={() => {
                if (hierarchy.asset_type) {
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      asset_type: null,
                      level: prevState.level - 1,
                    };
                  });
                } else if (hierarchy.sub_component1) {
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      sub_component1: null,
                      level: prevState.level - 1,
                    };
                  });
                } else if (hierarchy.system_asset_name) {
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      system_asset_name: null,
                      level: prevState.level - 1,
                    };
                  });
                } else if (hierarchy.system_asset) {
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      system_asset: null,
                      level: prevState.level - 1,
                    };
                  });
                } else if (hierarchy.system) {
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      system: null,
                      level: prevState.level - 1,
                    };
                  });
                } else if (hierarchy.plant) {
                  setHierarchy((prevState) => {
                    return {
                      ...prevState,
                      plant: null,
                      level: prevState.level - 1,
                    };
                  });
                }
              }}
            >
              Back
            </Button>
          )}
        </Center>
      </ScrollView>
    </ModuleScreen>
  );
};

export default Assets;
