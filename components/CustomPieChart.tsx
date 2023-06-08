import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { PieChart } from "react-native-charts-kit";
import { Center } from "native-base";

const CustomPieChart = ({ data, accessor, absolute, total }) => {
  // Order by asscesor value

  const sortedData = useMemo(() => {
    return data.sort((a, b) => b[accessor] - a[accessor]);
  }, [data, accessor, data.length]);

  const percentages = useMemo(() => {
    // Get the total value of all dataitems
    const grandTotal = data.reduce((acum, item) => acum + item[accessor], 0);

    return data.reduce((acum, item) => {
        const percentageOfDataItem = (item[accessor] * 100) / grandTotal;
        return {
          ...acum,
          [item.name]: percentageOfDataItem.toFixed(2),
        };
    }, {});
  }, [absolute, data, accessor]);

  const screenWidth = Dimensions.get("window").width;

   return (
      <Center>
        <Text>Total Requests: {total}</Text>
        <PieChart
          data={data}
          width={screenWidth}
          height={250}
          chartConfig={{
            backgroundGradientFrom: "#1E2923",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#08130D",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5,
            useShadowColorFromDataset: false // optional
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={Dimensions.get("window").width / 4}
          hasLegend={false}
          center={[10, 10]}
          absolute />
         <View style={styles.legend}>
            {sortedData.map((dataItem) => (
               <View style={styles.legendItem} key={dataItem.name}>
                  <FontAwesome name="circle" size={24} color={dataItem.color} />
                  <Text style={styles.legendItemValue}>
                     {absolute
                        ? dataItem[accessor]
                        : `(${dataItem[accessor]}) ${percentages[dataItem.name]}%`}
                  </Text>

                  <Text>{dataItem.name}</Text>
               </View>
            ))}
         </View>
      </Center>
   );
};

const styles = StyleSheet.create({
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

export default CustomPieChart;