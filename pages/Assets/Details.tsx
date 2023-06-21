import { Button, Center, HStack, Icon, Image, Link, ScrollView, Text, VStack } from "native-base";
import { ModuleHeader, ModuleScreen } from "../../components/ModuleLayout";
import { useEffect, useState } from "react";
import instance from "../../axios.config";
import { CMMSAssetDetails } from "../../types/interfaces";
import AssetHierachy from "../../components/Assets/AssetHierarchy";
import { Table, Rows } from "react-native-table-component";
import { Linking } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Loading from "../../components/Loading";
//import RNFetchBlob from "react-native-fetch-blob";

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
      // console.log(res.data.uploaded_files);
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

  const downloadFile = async (index: number) => {
    const fileUrl = `http://192.168.20.93:3001/api/asset/mobile/${psaId}/uploadedFile/${index}`;

    try {
      // Open the file URL using the device's default app for handling the file type
      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        console.log(`Cannot open URL: ${fileUrl}`);
      }
    } catch (error) {
      console.log('Error opening URL:', error);
    }
    /*const fileUrl = `http://192.168.20.93:3001/api/asset/mobile/${psaId}/uploadedFile/${index}`;
    // Get today's date to add the time suffix in filename
    let date = new Date(); // File URL which we want to download
    let FILE_URL = fileUrl; // Function to get extention of the file url
    const response = await fetch(FILE_URL);
    const contentType = response.headers.get("content-type");

    let file_ext = `.${contentType.split("/")[1]}`; // config: To get response by passing the downloading related options // fs: Root directory path to download

    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          `/${filename[index].split(".")[0]}_` +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: "downloading file...",
        notification: true, // useDownloadManager works with Android only
        useDownloadManager: true,
      },
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename=test`,
      },
    };
    config(options)
      .fetch("GET", FILE_URL)
      .then((res) => {
        // Alert after successful downloading
        console.log("res -> ", JSON.stringify(res));
        alert("File Downloaded Successfully.");
      })
      .catch((err) => {
        console.log("err -> ", err);
      });
      */
  };

  const filesToDownload = (
    <VStack>
      {filevalue.map((file, index) => {
        return (
          <Link key={index} onPress={downloadFile.bind(null, index)}>
            {filename[index]}
          </Link>
        );
      })}
    </VStack>
  );

  if (isLoading) {
    return (
      <ModuleScreen navigation={navigation}>
        <Loading/>
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
      <ModuleHeader header="Asset">
        <HStack >
          <Button padding={2} bg="#C8102E" leftIcon={<Icon as={MaterialCommunityIcons} name="arrow-left" size="sm"/>} size="xs" onPress={()=>navigation.goBack()}/>
        </HStack>
      </ModuleHeader>

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
