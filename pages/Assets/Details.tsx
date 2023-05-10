import { Center, Image, Link, ScrollView, Text, VStack } from "native-base";
import { ModuleScreen } from "../../components/ModuleLayout";
import { useEffect, useState } from "react";
import instance from "../../axios.config";
import { CMMSAssetDetails } from "../../types/interfaces";
import AssetHierachy from "../../components/Assets/AssetHierarchy";
import { Table, Rows } from "react-native-table-component";
import RNFetchBlob from "rn-fetch-blob";
import RNFS from "react-native-fs";

const Details = ({ route, navigation }) => {
  const [psaId, setPsaId] = useState(route.params.psa_id);
  const [isLoading, setIsLoading] = useState(false);
  const [assetDetails, setAssetDetails] = useState<CMMSAssetDetails>(null);
  const [fileraw, setFileraw] = useState(null);

  let tableData;
  const widthArr = [180, 150];

  useEffect(() => {
    setIsLoading(true);
    const sendRequest = async () => {
      const res = await instance.get("/api/assetDetails/" + psaId);
      // console.log(res.data);
      setAssetDetails(res.data[0]);
      setFileraw(res.data[0].uploaded_files);
      setIsLoading(false);
    };
    sendRequest().catch((err) => console.log(err));
  }, [psaId]);

  let filename = [""];
  let filevalue = [""];
  if (fileraw !== undefined && fileraw !== null && fileraw.length > 0) {
    filename = fileraw.map((file) => file[0]);
    filevalue = fileraw.map((file) => file[1]);
  }

  // const { config, fs } = RNFetchBlob;
  // let { DownloadDir } = fs.dirs;
  // let options = {
  //   fileCache: true,
  //   addAndroidDownloads: {
  //     useDownloadManager: true,
  //     notification: false,
  //     path:
  //       DownloadDir +
  //       "/me_" +
  //       Math.floor(new Date().getTime() + new Date().getSeconds() / 2),
  //     description: "Downloading...",
  //   },
  // };

  const filesToDownload = (
    <VStack>
      {filevalue.map((file, index) => {
        return (
          <Link
            key={index}
            href={file}
            onPress={async () => {
              // config(options)
              //   .fetch(
              //     "GET",
              //     "http://www.africau.edu/images/default/sample.pdf"
              //   )
              //   .then((res) => {
              //     console.log("do some magic in here");
              //   });
              // await RNFS.downloadFile({ fromUrl: "", toFile: "" });
            }}
            // download={filename[index]}
          >
            {filename[index]}
          </Link>
        );
      })}
    </VStack>
  );

  if (isLoading) {
    return (
      <ModuleScreen navigation={navigation}>
        <Center>
          <Text>Loading...</Text>
        </Center>
      </ModuleScreen>
    );
  }

  if (assetDetails) {
    tableData = [
      ["Asset Name", assetDetails.asset_name],
      ["Asset Hierarchy", <AssetHierachy asset={assetDetails} />],
      ["Description", assetDetails.asset_description],
      ["Brand", assetDetails.brand || "-"],
      ["Model Number", assetDetails.model_number || "-"],
      ["Technical Spec", assetDetails.technical_specs || "-"],
      ["Location", assetDetails.asset_location || "-"],
      ["Country of Manufacture", assetDetails.manufacture_country || "-"],
      ["Warranty Expiry Date", assetDetails.warranty || "-"],
      ["Remarks", assetDetails.remarks || "-"],
      ["Files", filesToDownload || "-"],
    ];
  }

  return (
    <ModuleScreen navigation={navigation}>
      <ScrollView>
        <Center>
          <Text underline fontSize={18} marginBottom={5}>
            Overview
          </Text>
          {assetDetails && assetDetails.uploaded_image && (
            <Image
              src={assetDetails.uploaded_image}
              size={"2xl"}
              alt="Asset Image"
              marginBottom={5}
            />
          )}
          {assetDetails && tableData && (
            <Table>
              <Rows
                data={tableData}
                widthArr={widthArr}
                style={{
                  margin: 6,
                }}
              ></Rows>
            </Table>
          )}
        </Center>
      </ScrollView>
    </ModuleScreen>
  );
};

export default Details;
