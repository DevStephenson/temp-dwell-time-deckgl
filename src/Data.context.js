import React, { createContext, useState } from "react";

export const DataContext = createContext();

const DataContextProvider = (props) => {
    const [dataset , setData] = useState(props.dataInitialState)
    const [selectedPort , setSelectedPort] = useState({})
    const [mapSizeFilter , setMapSizeFilter] = useState("count")
    const [mapColorFilter , setMapColorFilter] = useState("count")
    const [gridCategoryFilter , setGridCategoryFilter] = useState("")
    const [mapViewState , setMapViewState] = useState(props.mapInitialState)
    const [filterList, setFilterList] = useState(["discharge", "loading"]);

    return (<DataContext.Provider value={{
        dataset,
        selectedPort,
        mapSizeFilter,
        mapColorFilter,
        gridCategoryFilter,
        mapViewState,
        filterList,
        onUpdateDataset:setData,
        onUpdateSelectedPort:setSelectedPort,
        onUpdateMapSizeFilter:setMapSizeFilter,
        onUpdateMapColorFilter:setMapColorFilter,
        onGridFilter:setGridCategoryFilter,
        onSetMapViewState: setMapViewState,
        onUpdateFilterList: setFilterList
    }}>
        {props.children}
    </DataContext.Provider>)
}

export default DataContextProvider 