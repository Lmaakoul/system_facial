import React, { useState } from 'react';
import { XYPlot, VerticalBarSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, Hint } from 'react-vis';

const Analyse = () => {
  const [hintValue, setHintValue] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const data = [
    { x: 'Monday', y: 8 },
    { x: 'Tuesday', y: 6 },
    { x: 'Wednesday', y: 7 },
    { x: 'Thursday', y: 5 },
    { x: 'Friday', y: 4 },
    { x: 'Saturday', y: 2 },
    { x: 'Sunday', y: 3 }
  ];

  const handleBarClick = (datapoint) => {
    setSelectedData(datapoint);
  };

  return (
    <div>
      <h2>Analyse</h2>
      <XYPlot
        xType="ordinal"
        width={600}
        height={400}
        xDistance={100}
        onMouseLeave={() => setHintValue(null)}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalBarSeries
          data={data}
          onValueMouseOver={datapoint => setHintValue(datapoint)}
          onValueClick={handleBarClick}
          color="#007bff"
        />
        {hintValue && <Hint value={hintValue} />}
      </XYPlot>
      {selectedData && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Details</h3>
          <p><strong>Day:</strong> {selectedData.x}</p>
          <p><strong>Hours:</strong> {selectedData.y}</p>
        </div>
      )}
    </div>
  );
};

export default Analyse;
