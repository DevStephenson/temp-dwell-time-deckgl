export const convertAggregatedCSV = (data) => {
    const list = [];
    const dataStringLines = data.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );
  
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }
  
        // remove the blank rows
  
        if (Object.values(obj).filter((x) => x).length > 0) {
          if (obj.name !== "" && obj.longitude && obj.latitude) {
              console.log('hit')
            obj.coordinates = [parseFloat(obj.Longitude), parseFloat(obj.Latitude)];
            obj.dwell_d = parseInt(obj.dwell_d);
            list.push(obj);
          }
        }
        
      }
    }
    return list;
  };