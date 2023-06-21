import React, { useState, useEffect } from "react";
import { Select } from "native-base";
import { View } from "react-native";
import instance from "../../axios.config";
import { CMMSAsset } from "../../types/interfaces";
import MultiSelect from "react-native-multiple-select";
import SelectPicker from "../SelectPicker";

interface AssetSelectProps {
    plantId?: number
    value?: string,
    onChange: Function
};

interface AssetMultiSelectProps extends AssetSelectProps {
    defaultValues?: number[],
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

const AssetSelect = (props: AssetSelectProps) => {
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


const AssetMultiSelect = (props: AssetMultiSelectProps) => {
    const [assets, setAssets] = useState<CMMSAsset[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        if (props.plantId) {
            fetchAssets(props.plantId).then(result => {
                if (result) setAssets(result);
            });
        } else setAssets([]);
    }, [props.plantId]);

    useEffect(() => {
        if (props.defaultValues) {
            const defaultItems = assets
                .filter(asset => props.defaultValues.includes(asset.psa_id))
                .map(asset => asset.psa_id)
            setSelectedItems(defaultItems);
        }
    }, [props.defaultValues, assets])

    const options = assets.map(asset => {
        return {
            //id: asset.psa_id,
            //name: asset.asset_name
            value: asset.psa_id,
            label: asset.asset_name
        };
    });

    const handleChange = (items: number[]) => {
        setSelectedItems(items);
        props.onChange(items.map(item => item.value));
    };

    return (
        <SelectPicker items={options} placeholder={"Select Asset"} onItemChange={handleChange} multiple={true}/>
        /*<MultiSelect
            uniqueKey="id"
            items={options}
            selectedItems={selectedItems}
            onSelectedItemsChange={handleChange}
            styleItemsContainer={{maxHeight: 200}}
            selectText=""
            styleDropdownMenu={{ flex: 1, borderColor: "rgb(133, 133, 133))", borderWidth: 1, borderRadius: 5}}
            styleSelectorContainer={{ flex: 1, borderColor: "rgb(133, 133, 133))", borderWidth: 1, borderRadius: 5}}
        />*/
    );
};

export { AssetSelect, AssetMultiSelect };