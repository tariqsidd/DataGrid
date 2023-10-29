import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box } from '@material-ui/core';
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import {unsubscribe} from "../DataGrid/Reactive/subscriber";
import {indexMap} from './utils'

export const DataGridOptions = {
  addRow: true,
  deleteRow: true,
  duplicateRow: true,
  columnHeight: 40,
  editing: true,
  showErrors: true,
  showErrorAlert: true,
  showExportButton: true,
  showSubmitButton: false,
};


const VirtualTable = ({ itemHeight, incomingData, tableHeaders, buffer=5, numberOfRows=6 }) => {
  const viewportHeight = numberOfRows * itemHeight;
  const [data, setData] = useState([]);
  const [numVisibleItems, setNumVisibleItems] = useState(Math.trunc(viewportHeight / itemHeight));
  const [viewState, setViewState] = useState({
    start: 0,
    end: numVisibleItems
  });

  useEffect(()=>{
    setData(incomingData)
    return ()=>{
      unsubscribe("willRowMutate");
    }
  },[]);

  const viewPortRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const containerStyle = { height: data.length * itemHeight };

  const scrollPos = useCallback(() => {
    const currentIndx = Math.trunc(viewPortRef.current.scrollTop / itemHeight);
    const adjustedIndex = Math.max(0, currentIndx - buffer);
    const endIndex = Math.min(data.length - 1, adjustedIndex + numVisibleItems + buffer);

    if (adjustedIndex !== viewState.start || endIndex !== viewState.end) {
      setViewState({ start: adjustedIndex, end: endIndex });
    }
  }, [itemHeight, numVisibleItems, viewState.start, viewState.end, data.length]);

  const renderRows = useCallback(() => {
    let result = [];
    if(data.length) {
      for (let i = viewState.start; i <= viewState.end; i++) {
        let item = {...data[i], top: i * itemHeight};
        indexMap.set(item.id, i);
        result.push(
          <TableRow
            key={`${item.id}-Row`}
            item={item}
            columns={tableHeaders}
            itemHeight={itemHeight}
            onRowChange={(updatedRow) => {
              const index = data.findIndex((i) => i.id === updatedRow.id);
              if (index !== -1) {
                let _data = data;
                _data[index] = updatedRow;
                setData(_data)
              }
            }}
          />
        );
      }
      return result;
    }
  }, [viewState.start, viewState.end, itemHeight, data, tableHeaders]);

  useEffect(() => {
    if (scrollPositionRef.current) {
      viewPortRef.current.scrollTop = scrollPositionRef.current;
    }
    return () => {
      scrollPositionRef.current = viewPortRef.current.scrollTop;
    };
  }, []);

  useEffect(() => {
    setNumVisibleItems(Math.trunc(viewportHeight / itemHeight));
  }, [itemHeight, viewportHeight]);

  return (
    <Box
      ref={viewPortRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        border: '1px solid rgba(224, 224, 224, 1)',
        overflowY: 'scroll',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      }}
      onScroll={scrollPos}
    >
      <TableHeader columns={tableHeaders} />
      <Box
        style={{
          position: 'absolute',
          width: '100%',
          ...containerStyle
        }}
      >
        {renderRows()}
      </Box>
    </Box>
  );
};

export default VirtualTable;
