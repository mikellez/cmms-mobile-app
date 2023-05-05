import React, { useState, useEffect } from "react";
import { Box, Select } from "native-base";
import instance from "../../axios.config";
import { StyleProp, ViewStyle } from "react-native";
import sizes from "native-base/lib/typescript/theme/base/sizes";

interface PlantSelectProps {
    accessControl?: boolean;
    value?: string;
    onChange: (itemValue: string) => void;
    selectAllPlants?: boolean;
    maxHeight?: number;
    style?: StyleProp<ViewStyle>;
}

const fetchPlants = async (url: string) => {
    try {
        const response = await instance.get(url);
        return response.data;
    } catch (err) {
        console.log(err);
    }
    instance.get("");
};

const PlantSelect = (props: PlantSelectProps) => {
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        const url = props.accessControl ? "/api/getUserPlants" : "/api/getPlants";
        fetchPlants(url).then((result) => {
            setPlants(result);
        });
    }, []);

    const options = plants.map((plant) => {
        return (
            <Select.Item
                key={plant.plant_id}
                label={plant.plant_name}
                value={plant.plant_id.toString()}
            />
        );
    });

    return (
        <Select
            placeholder="Select Plant"
            selectedValue={props.value ? props.value : null}
            onValueChange={props.onChange}
            minW={110}
            maxH={props.maxHeight}
            style={props.style}
        >
            {props.selectAllPlants && <Select.Item key={0} label={"View All Plants"} value={"0"} />}
            {options}
        </Select>
    );
};

export { PlantSelect };
