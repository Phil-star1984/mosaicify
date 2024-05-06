import React, { useEffect, useState } from "react";
import axios from "axios";

function TestTwo() {
  const [data, setData] = useState([]);
  const url = `https://opendata.wuerzburg.de/api/explore/v2.1/catalog/datasets/sls-klimabaeume/records?limit=20`;
  const handleClick = async () => {
    try {
      const { data } = await axios.get(url);
      setData(data.results);
      console.log(data.results);
    } catch (error) {
      console.error("Could not fetch data", error);
    }
  };
  return (
    <>
      <h1>Get Data</h1>
      <button onClick={handleClick}>Fetch Data</button>
      <div>
        {!!data &&
          data.map((item, index) => (
            <div key={index}>
              <h1>{item.tree_number}</h1>
              <p style={{ color: "black" }}>{item.soil_composition}</p>
            </div>
          ))}
      </div>
    </>
  );
}

export default TestTwo;
