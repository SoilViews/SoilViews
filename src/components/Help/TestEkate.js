import React from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

import styles from "./testEkate.module.css";
import data from "../../data/ekate.json";

const TestEkate = () => {
  //javascript
  const [province, setProvince] = React.useState("");
  const [mun, setMun] = React.useState("");
  const [land, setLand] = React.useState("");
  const [array, setArray] = React.useState("");

  const provinceChange = (event) => {
    setProvince(event.target.value);
  };

  const munChange = (event) => {
    setMun(event.target.value);
  };

  const landChange = (event) => {
    setLand(event.target.value);
  };

  const arrayChange = (event) => {
    setArray(event.target.value);
  };
  //TODO: Sort data
  //gets the unique Provinces
  let uniqueProvince = [...new Set(data.map((item) => item.province))].map(
    (item, key) => {
      return (
        <MenuItem key={key} value={item}>
          {item}
        </MenuItem>
      );
    }
  );

  //filter Municipalities by their province 
  let filterMun = data
    .filter((x) => x.province === province)
    .map(item => {
      return item.municipality
    });

//removing the duplicate values from the array of filtered provinces
  let ReduceDupMun = filterMun.reduce((acc,item) => {
    if (!acc.includes(item)){
      acc.push(item);
    }
  return acc
  },[])

  //Mapping the reduced list of Municipalities
  let uniqueMunicipalityMapped = ReduceDupMun.map((item,key) => {
  return <MenuItem key={key} value={item}>{item}</MenuItem>
  })

  return (
    <div>
      <Grid item xs={12} md={6}>
        <Grid className={styles.center} container spacing={5}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormControl>
              <InputLabel>Област</InputLabel>
              <Select
                className={styles.selectBox}
                labelId=""
                id=""
                value={province}
                onChange={provinceChange}
              >
                <MenuItem disabled>-Select a province-</MenuItem>
                {/* Iterate provinces in the select menu */}
                {uniqueProvince}
                {/* Iterate provinces in the select menu */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormControl>
              <InputLabel>Община</InputLabel>
              <Select
                disabled={!province} //Disable until province state is fulfilled
                className={styles.selectBox}
                labelId=""
                id=""
                value={mun}
                onChange={munChange}
              >
                {uniqueMunicipalityMapped}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormControl>
              <InputLabel>Землище</InputLabel>
              <Select
                className={styles.selectBox}
                labelId=""
                id=""
                value={land}
                onChange={landChange}
              >
                {data.map((item, key) => {
                  return (
                    <MenuItem value={key} key={key}>
                      {item.ekatte}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={3}>
            <FormControl>
              <InputLabel>Масив</InputLabel>
              <Select
                className={styles.selectBox}
                labelId=""
                id=""
                value={array}
                onChange={arrayChange}
              >
                <MenuItem value={10}>101</MenuItem>
                <MenuItem value={20}>102</MenuItem>
                <MenuItem value={30}>103</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default TestEkate;
