import React, { useState, useEffect } from "react";
import { Select } from "native-base";
import { View } from "react-native";
import instance from "../../axios.config";
import { CMMSAsset } from "../../types/interfaces";
import MultiSelect from "react-native-multiple-select";

interface PlantSelectProps {
    plantId?: number
    value?: string,
    onChange: Function
};

const fetchAssets = async (plantId: number) : Promise<CMMSAsset[]> => {
    try {
        const response = await instance.get("/api/asset/" + plantId);
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
};

const AssetSelect = (props: PlantSelectProps) => {
    const [assets, setAssets] = useState<CMMSAsset[]>([]);

    useEffect(() => {
        if (props.plantId) {
            fetchAssets(props.plantId).then(result => {
                if (result) setAssets(result);
            });
        } else setAssets([]);
    }, [props.plantId]);

    const options = assets.map(asset => {
        return (
            <Select.Item 
                key={asset.psa_id} 
                label={asset.asset_name} 
                value={asset.psa_id.toString()} 
            />
        );
    });

    return (
        <Select
            placeholder="Select Asset" 
            selectedValue={props.value ? props.value : null}
            onValueChange={(value) => props.onChange(value)}
        >
            {options}
        </Select>
    );
};


const AssetMultiSelect = (props: PlantSelectProps) => {
    const [assets, setAssets] = useState<CMMSAsset[]>([]);
    const [selectedItems, setSelectedItems] = useState<{id: number, name: string}[]>([]);

    useEffect(() => {
        if (props.plantId) {
            fetchAssets(props.plantId).then(result => {
                if (result) setAssets(result);
            });
        } else setAssets([]);
    }, [props.plantId]);

    const options = assets.map(asset => {
        return {
            id: asset.psa_id,
            name: asset.asset_name
        };
    });

    const handleChange = (items: {id: number, name: string}[]) => {
        setSelectedItems(items);
        props.onChange(items.map(item => item.id));
    }

    return (
        <MultiSelect
            uniqueKey="id"
            items={options}
            selectedItems={selectedItems}
            onSelectedItemsChange={handleChange}
            styleItemsContainer={{maxHeight: 200}}
            selectText=""
            styleDropdownMenu={{ flex: 1, borderColor: "rgb(133, 133, 133))", borderWidth: 1, borderRadius: 5}}
            styleSelectorContainer={{ flex: 1, borderColor: "rgb(133, 133, 133))", borderWidth: 1, borderRadius: 5}}
        />
    );
};

export { AssetSelect, AssetMultiSelect };