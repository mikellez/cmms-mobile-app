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
  ]);

  const [chartData, setChartData] = useState([ ]);
  const screenWidth = Dimensions.get("window").width;

  const fetchData = async (
    type: string,
    plant: number | string,
    field: string,
    datetype: string,
    date: string
  ): Promise<CMMSDashboardData[]> =>{
    const url = `/api/${type}/counts/${field}/${plant}/${datetype}/${date}`;
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

    return await fetchData("request", plant, field, datetype, date).then((result) => {
      if (result) {
        setRequestData(result);
        setIsRequestReady(true);
      }
    });

  }

  const fetchChecklists = async () => {
    const { datetype, date } = pickerwithtype; 

    setIsChecklistReady(false);

    return await fetchData("checklist", plant, "status", datetype, date).then((result) => {
      if (result) {
        setChecklistData(result);
        setIsChecklistReady(true);
      }
    });
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

      Promise.all([fetchRequests(), fetchChecklists()])
      .then(()=> {
          setSections(prevSections=> {
            const newSections = [...prevSections];

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
    padding: 10,
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