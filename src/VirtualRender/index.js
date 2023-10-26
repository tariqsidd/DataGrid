import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box } from '@material-ui/core';

const TableCell = React.memo(({ children, width }) => {
  return(
    <Box
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        width: width,
        textAlign: 'left',
        padding: '16px',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01071em',
      }}
    >
      {children}
    </Box>
  )
});

const TableRow = ({ item, itemheight, columns }) => {
  return(
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        top: item.top,
        height: itemheight,
        width: '100%',
        backgroundColor: '#fff',
        '&:nth-of-type(odd)': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.07)',
        }
      }}
      onClick={()=>{console.log('onClick')}}
      onDoubleClick={()=>{console.log('onDoubleClick')}}
      draggable={true}
      onDragStart={()=>{console.log('onDragStart', item)}}
      onDragOver ={(event)=>{
        event.preventDefault();
      }}
      onDrop={(e)=>{
        console.log('onDrop', item)}
      }
    >
      {columns.map((column, index) => (
        <TableCell key={index} width={`${100 / columns.length}%`}>{item[column.headerFieldName]}</TableCell>
      ))}
    </Box>
  )
};

const TableHeader = ({ columns }) => {
  return(
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        position: 'sticky',
        top: 0,
        backgroundColor: '#f5f5f5',
        zIndex: 1,
        borderBottom: '2px solid rgba(224, 224, 224, 1)',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01071em',
        color: 'rgba(0, 0, 0, 0.87)'
      }}
    >
      {columns.map((header, index) => (
        <TableCell key={index} width={`${100 / columns.length}%`}>{header.headerName}</TableCell>
      ))}
    </Box>
  )
};


const Table = ({ itemheight, incomingData, tableHeaders, buffer=5, numberOfRows=6 }) => {
  const viewportHeight = numberOfRows * itemheight;
  const [numVisibleItems, setNumVisibleItems] = useState(Math.trunc(viewportHeight / itemheight));
  const [viewState, setViewState] = useState({
    start: 0,
    end: numVisibleItems
  });

  // console.log('numVisibleItems', numVisibleItems)

  const viewPortRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const containerStyle = { height: incomingData.length * itemheight };

  const scrollPos = useCallback(() => {
    const currentIndx = Math.trunc(viewPortRef.current.scrollTop / itemheight);
    const adjustedIndex = Math.max(0, currentIndx - buffer);
    const endIndex = Math.min(incomingData.length - 1, adjustedIndex + numVisibleItems + buffer);

    if (adjustedIndex !== viewState.start || endIndex !== viewState.end) {
      setViewState({ start: adjustedIndex, end: endIndex });
    }
  }, [itemheight, numVisibleItems, viewState.start, viewState.end, incomingData.length]);

  const renderRows = useCallback(() => {
    let result = [];
    for (let i = viewState.start; i <= viewState.end; i++) {
      let item = { ...incomingData[i], top: i * itemheight };
      result.push(<TableRow key={i} item={item} itemheight={itemheight} columns={tableHeaders} />);
    }
    return result;
  }, [viewState.start, viewState.end, itemheight, incomingData, tableHeaders]);

  useEffect(() => {
    if (scrollPositionRef.current) {
      viewPortRef.current.scrollTop = scrollPositionRef.current;
    }
    return () => {
      scrollPositionRef.current = viewPortRef.current.scrollTop;
    };
  }, []);

  useEffect(() => {
    setNumVisibleItems(Math.trunc(viewportHeight / itemheight));
  }, [itemheight, viewportHeight]);

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

export default Table;
