import React, { useState, useEffect } from "react";
import { Select } from "native-base";
import instance from "../../axios.config";
import { CMMSAsset } from "../../types/interfaces";

interface PlantSelectProps {
    plantId?: number
    value?: string,
    onChange: (itemValue: string) => void
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
            onValueChange={props.onChange}
        >
            {options}
        </Select>
    );
};

export { AssetSelect };