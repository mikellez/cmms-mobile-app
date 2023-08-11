import React, { Component, useEffect, useState } from "react";
import {
  Switch,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import { PieChart } from "react-native-charts-kit";

import instance from "../axios.config";
import { ModuleActionSheet, ModuleActionSheetItem, ModuleDivider, ModuleScreen } from "../components/ModuleLayout";
import { CMMSDashboardData, CMMSPlant, CMMSUser } from "../types/interfaces";
import { _retrieveData } from "../helper/AsyncStorage";
import { set } from "react-native-reanimated";
import { Center, Heading } from "native-base";
import CustomPieChart from "../components/CustomPieChart";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loading from "../components/Loading";

const HomeScreen = ({ navigation }) => {

  const items = [
    { name: 'Pending ', code: '#c21010', total: 0 },
    { name: 'Outstanding ', code: 'purple', total: 0 },
    { name: 'Completed ', code: '#367e18', total: 0 },
  ];

  const [sections, setSections] = useState([
    { title: "Requests", data: items, chart: {}, total: 0 },
    { title: "Checklists", data: items, chart: {}, total: 0 },
    { title: "Change of Parts", data: items, chart: {}, total: 0 },
    { title: "Feedback", data: items, chart: {}, total: 0 },
    { title: "License", data: items, chart: {}, total: 0 },
  ]);

  const [chartData, setChartData] = useState([ ]);
  const screenWidth = Dimensions.get("window").width;

  const fetchData = async (
    type: string,
    plant: number | string,
    field: string,
    datetype: string,
    date: string,
    params?: []
  ): Promise<CMMSDashboardData[]> =>{
    let extra = "";
    if(params){
      extra = `?expand=${params.join(",")}`; 
    }

    const url = `/api/${type}/counts/${field}/${plant}/${datetype}/${date}${extra}`;
    const colors = [
      "#03C988",
      "#FFAC41",
      "#C74B50",
      "#810CA8",
      "#282A3A",
      "#FB2576",
    ];


  return await instance
    .get(url)
    .then((res) => {
      if (res) {
        return res.data.map((item: any, index: number) => {
          return {
            ...item,
            value: parseInt(item.value),
            fill: colors[index],
          };
        });
      }
    })
    .catch((err) => console.log(err));
}

  const dashboardViews: ModuleActionSheetItem[] = [
    {
      label: "Requests",
      value: "requests"
    },
    {
      label: "Checklists",
      value: "checklists"
    },
  ];

  type PickerType = 'date';
  const [active, setActive] = useState("");
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isChecklistReady, setIsChecklistReady] = useState<boolean>(false);
  const [isCOPReady, setIsCOPReady] = useState<boolean>(false);
  const [isFeedbackReady, setIsFeedbackReady] = useState<boolean>(false);
  const [isLicenseReady, setIsLicenseReady] = useState<boolean>(false);
  const [isRequestReady, setIsRequestReady] = useState<boolean>(false);
  const [plant, setPlant] = useState<number | string>("");
  const [field, setField] = useState<string>("status");
  const [pickerwithtype, setPickerWithType] = useState<{
    date: string,
    datetype: PickerType
  }>({ date: 'all', datetype: 'date' });
  const [request, setRequest] = useState<{
    totalPendingRequest: number;
    totalOutstandingRequest: number;
    totalClosedRequest: number;
  }>({ totalPendingRequest: 0, totalOutstandingRequest: 0, totalClosedRequest: 0 });
  const [checklist, setChecklist] = useState<{
    totalPendingChecklist: number;
    totalOutstandingChecklist: number;
    totalClosedChecklist: number;
  }>({ totalPendingChecklist: 0, totalOutstandingChecklist: 0, totalClosedChecklist: 0 });
  const [copData, setCOPData] = useState<CMMSDashboardData[]>();
  const [feedbackData, setFeedbackData] = useState<CMMSDashboardData[]>();
  const [licenseData, setLicenseData] = useState<CMMSDashboardData[]>();
  const [checklistData, setChecklistData] = useState<CMMSDashboardData[]>();
  const [requestData, setRequestData] = useState<CMMSDashboardData[]>([]);
  const [loadUser, setLoadUser] = useState<boolean>(false);
  const [viewType, setViewType] = useState<string>(dashboardViews[0].value as string);
  const [total, setTotal] = useState<number>(0);
  const user: CMMSUser = useSelector<RootState, CMMSUser>((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);

  const isFocused = useIsFocused();

 const fetchRequests = async () => {
    const { datetype, date } = pickerwithtype; 
    const PARAMS = ["id"];

    return await fetchData("request", plant, field, datetype, date, PARAMS).then((result) => {
      if (result) {
        setRequestData(result);
        setIsRequestReady(true);
      }
    });

  }

  const fetchChecklists = async () => {
    const { datetype, date } = pickerwithtype; 
    const PARAMS = ["id"];

    setIsChecklistReady(false);

    return await fetchData("checklist", plant, "status", datetype, date, PARAMS).then((result) => {
      if (result) {
        setChecklistData(result);
        setIsChecklistReady(true);
      }
    });
  }

  const fetchCOPs = async () => {
    const { datetype, date } = pickerwithtype; 
    const PARAMS = ["id"];

    setIsCOPReady(false);

    const getScheduledCOP = instance.get(
      `/api/changeOfParts/scheduled/${plant}/${datetype}/${date}?expand=${PARAMS.join(",")}`
    );

    const getCompletedCOP = instance.get(
      `/api/changeOfParts/completed/${plant}/${datetype}/${date}?expand=${PARAMS.join(",")}`
    );

    const getAllCOP = await Promise.all([getScheduledCOP, getCompletedCOP]);

    const scheduleData = getAllCOP[0].data;
    const completedData = getAllCOP[1].data;

    const totalScheduledCOP = scheduleData?.length || 0;
    const totalCompletedCOP = completedData?.length || 0;

    // console.log('scheduled', getAllCOP)

    setCOPData([
      { name: "Scheduled", value: totalScheduledCOP, fill: "#C74B50", id: 1 },
      { name: "Completed", value: totalCompletedCOP, fill: "#03C988", id: 2 },
    ]);

  }

  const fetchFeedbacks = async () => {
    const { datetype, date } = pickerwithtype; 
    const PARAMS = ["id"];

    setIsFeedbackReady(false);

    const getPendingFeedback = instance.get(
      `/api/feedback/pending/${plant}/${datetype}/${date}?expand=${PARAMS.join(",")}`
    );

    const getOutstandingFeedback = instance.get(
      `/api/feedback/outstanding/${plant}/${datetype}/${date}?expand=${PARAMS.join(",")}`
    );

    const getCompletedFeedback = instance.get(
      `/api/feedback/completed/${plant}/${datetype}/${date}?expand=${PARAMS.join(",")}`
    );

    const getAllFeedback = await Promise.all([getPendingFeedback, getOutstandingFeedback, getCompletedFeedback]);

    const pendingData = getAllFeedback[0].data.rows;
    const outstandingData = getAllFeedback[1].data.rows;
    const completedData = getAllFeedback[2].data.rows;

    const totalPendingFeedback = pendingData?.length || 0;
    const totalOutstandingFeedback = outstandingData?.length || 0;
    const totalCompletedFeedback = completedData?.length || 0;

    // console.log('scheduled', getAllCOP)

    setFeedbackData([
      { name: "Pending", value: totalPendingFeedback, fill: "#C74B50", id: 1 },
      { name: "Outstanding", value: totalOutstandingFeedback, fill: "#C74B50", id: 2 },
      { name: "Completed", value: totalCompletedFeedback, fill: "#03C988", id: 3 },
    ]);

  }

  const fetchLicenses = async () => {
    const { datetype, date } = pickerwithtype; 
    const PARAMS = ["id"];

    setIsLicenseReady(false);

    const getPendingLicense = instance.get(
      `/api/license/pending/${plant}/${datetype}/${date}?expand=${PARAMS.join(",")}`
    );

    const getOutstandingLicense = instance.get(
      `/api/license/outstanding/${plant}/${datetype}/${date}?expand=${PARAMS.join(",")}`
    );

    const getCompletedLicense = instance.get(
      `/api/license/completed/${plant}/${datetype}/${date}?expand=${PARAMS.join(",")}`
    );

        const getDraftLicense = instance.get(
      `/api/license/draft/${plant}/${datetype}/${date}?expand=${PARAMS.join(
        ","
      )}`
    );
    const getAcquiredLicense = instance.get(
      `/api/license/acquired/${plant}/${datetype}/${date}?expand=${PARAMS.join(
        ","
      )}`
    );
    const getLicenseExpiredIn30 = instance.get(
      `/api/license/expired/${plant}/${datetype}/${date}/30?expand=${PARAMS.join(
        ","
      )}`
    );
    const getLicenseExpiredIn60 = instance.get(
      `/api/license/expired/${plant}/${datetype}/${date}/60?expand=${PARAMS.join(
        ","
      )}`
    );
    const getLicenseExpiredIn90 = instance.get(
      `/api/license/expired/${plant}/${datetype}/${date}/90?expand=${PARAMS.join(
        ","
      )}`
    );

    const getAllLicense = await Promise.all([
      getDraftLicense,
      getAcquiredLicense,
      getLicenseExpiredIn30,
      getLicenseExpiredIn60,
      getLicenseExpiredIn90,
    ]);

    const draftLicense = getAllLicense[0].data?.rows;
    const acquiredLicense = getAllLicense[1].data?.rows;
    const licenseExpiredIn30 = getAllLicense[2].data?.rows;
    const licenseExpiredIn60 = getAllLicense[3].data?.rows;
    const licenseExpiredIn90 = getAllLicense[4].data?.rows;

    const totalDraftLicense = draftLicense?.length || 0;
    const totalAcquiredLicense = acquiredLicense?.length || 0;

    // console.log('scheduled', getAllCOP)

    setLicenseData([
      { name: "Draft", value: totalDraftLicense, fill: "#C74B50", id: 1 },
      { name: "Acquired", value: totalAcquiredLicense, fill: "#03C988", id: 3 },
    ]);

  }

  const getPlants = async (url: string) => {
    return await instance
        .get<CMMSPlant[]>(url)
        .then((res) => {
            return res.data.sort((a, b) => a.plant_id - b.plant_id);
        })
        .catch((err) => console.log(err.message));
  }

  useEffect(() => {

    if(isFocused) {
      const { datetype, date } = pickerwithtype;
      const { role_id } = user;

      setIsReady(false);
      setLoading(true);

      if([3, 4].includes(role_id)) { // engineer, specialist
        getPlants("/api/getUserPlants").then(result => {
            if (result) {
              setPlant(result[0].plant_id)
            }
        })

      } else {
        setPlant(0);
      }
    }

  }, [isFocused])

  useEffect(() => {

    if(plant !== "") {

      Promise.all([fetchRequests(), fetchChecklists(), fetchCOPs(), fetchFeedbacks(), fetchLicenses()])
      .then(()=> {
          setSections(prevSections=> {
            const newSections = [...prevSections];

            /**
             * Set Request
             */
            if(requestData && requestData.length > 0) {
              newSections[0].title = "Requests";

              newSections[0].data = [
                { name: 'Pending ', code: '#c21010', total: requestData?.filter((data) => data.id === 1)[0]?.value || 0  },
                { name: 'Outstanding ', code: 'purple', total: requestData?.filter((data) => [2].includes(data.id))?.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0) || 0 },
                { name: 'Completed ', code: '#367e18', total: requestData?.filter((data) => [3, 4, 5, 6].includes(data.id))?.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0) || 0 },
              ];

              newSections[0].chart = requestData.map(item=> ({ 
                name: item.name, 
                population: item.value, 
                color: item.fill, 
                legendFontColor: "#7F7F7F", 
                legendFontSize: 15,
                total: item.value
              }));

              const totalRequest = requestData?.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.value;
              }, 0);

              newSections[0].total = totalRequest;
            }

            /**
             * Set Checklist
             */
            if(checklistData && checklistData.length > 0) {
              newSections[1].title = "Checklists";

              newSections[1].data = [
                { name: 'Pending ', code: '#c21010', total: checklistData?.filter((data) => data.id === 1)[0]?.value || 0 },
                { name: 'Outstanding ', code: 'purple', total: checklistData?.filter((data) => [2].includes(data.id))?.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0) || 0 },
                { name: 'Completed ', code: '#367e18', total: checklistData?.filter((data) => [3, 4, 5, 6].includes(data.id))?.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0) || 0 },
              ];

              newSections[1].chart = checklistData.map(item=> ({ 
                name: item.name, 
                population: item.value, 
                color: item.fill, 
                legendFontColor: "#7F7F7F", 
                legendFontSize: 15,
                total: item.value
              }));

              const totalChecklist = checklistData?.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.value;
              }, 0);

              newSections[1].total = totalChecklist;
            }

            /**
             * Set Change of Parts
             */
            if(copData && copData.length > 0) {
              newSections[2].title = "Change of Parts";

              newSections[2].data = [
                { name: 'Scheduled ', code: '#c21010', total: copData.filter(data => data.id === 1)[0]?.value || 0 },
                { name: 'Completed ', code: '#367e18', total: copData.filter(data => data.id === 2)[0]?.value || 0 },
              ];

              newSections[2].chart = copData.map(item=> ({ 
                name: item.name, 
                population: item.value, 
                color: item.fill, 
                legendFontColor: "#7F7F7F", 
                legendFontSize: 15,
                total: item.value
              }));

              const totalCOP = copData?.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.value;
              }, 0);

              newSections[2].total = totalCOP;
            }

            /**
             * Set Feedbacks
             */
            if(feedbackData && feedbackData.length > 0) {
              newSections[3].title = "Feedback";

              newSections[3].data = [
                { name: 'Pending ', code: '#c21010', total: feedbackData?.filter((data) => data.id === 1)[0]?.value || 0 },
                { name: 'Outstanding ', code: 'purple', total: feedbackData?.filter((data) => data.id === 2)[0]?.value || 0},
                { name: 'Completed ', code: '#367e18', total: feedbackData?.filter((data) => data.id === 3)[0]?.value || 0},
              ];

              newSections[3].chart = feedbackData.map(item=> ({ 
                name: item.name, 
                population: item.value, 
                color: item.fill, 
                legendFontColor: "#7F7F7F", 
                legendFontSize: 15,
                total: item.value
              }));

              const totalFeedback = feedbackData?.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.value;
              }, 0);

              newSections[3].total = totalFeedback;
            }

            /**
             * Set Licenses
             */
            if(licenseData && licenseData.length > 0) {
              newSections[4].title = "License";

              newSections[4].data = [
                { name: 'Draft ', code: '#c21010', total: licenseData?.filter((data) => data.id === 1)[0]?.value || 0 },
                { name: 'Acquired ', code: '#367e18', total: licenseData?.filter((data) => data.id === 2)[0]?.value || 0},
              ];

              newSections[4].chart = licenseData.map(item=> ({ 
                name: item.name, 
                population: item.value, 
                color: item.fill, 
                legendFontColor: "#7F7F7F", 
                legendFontSize: 15,
                total: item.value
              }));

              const totalLicense = licenseData?.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.value;
              }, 0);

              newSections[4].total = totalLicense;
            }

            return newSections;


          })

          setIsReady(true);
          setLoading(false);

        })

    }

  }, [plant, field, pickerwithtype, loading]);

  return (
    <ModuleScreen navigation={navigation}>
      {/*<View style={{padding: 10, flex: 1}}>
        <View style={[styles.container, {flexDirection: 'row', justifyContent: 'space-between'}]}>
          <View style={[styles.box, {backgroundColor: 'powderblue'}]} />
          <View style={[styles.box, {backgroundColor: 'skyblue'}]} />
        </View>
        </View>*/}
      {/*<ModuleActionSheet 
          items={dashboardViews}
          value={viewType}
          setValue={setViewType}
      />*/}
      <SectionGrid
        itemDimension={100}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        spacing={10}
        renderSectionHeader={({ section }) => (
          <>
            <Heading mt={10} size={"sm"}>{section.title}</Heading>
          </>
        )}
        renderItem={({ item }) => (
            <View style={[styles.itemContainer, { backgroundColor: '#eee' }]}>
              {loading ? <Loading/> : <Text style={[styles.itemCount, { color: item.code }]}>{ item.total }</Text>}
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          )
        } 
        sections={sections}      
        renderSectionFooter={({ section }) => {
          return (
          <>
            {!isReady && <Loading/>}
            {isReady && section.total > 0 && <CustomPieChart data={section.chart} accessor="total" absolute={false} total={section.total}/> }
          </>
        )}}
        />
    </ModuleScreen>
  )
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flexGrow: 1,
    margin: 10,
    height: 150,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 5,
    height: 150,
  },
  itemCount: {
    fontSize: 50,
  },
  itemName: {
    fontSize: 16,
    //color: '#ddd',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  legend: {
      marginHorizontal: 10,
   },
   legendItem: {
      flexDirection: "row",
   },
   legendItemValue: {
      marginHorizontal: 10,
   },
});