import React from "react";
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

import styles from "./Step2.module.css";

// import ekate from "./ekate.json"
import data from "../../data/ekate.json";

const Step2 = () => {
  const [province, setProvince] = React.useState("");
  const [mun, setMun] = React.useState("");
  const [settlement, setSettlement] = React.useState("");
  const [array, setArray] = React.useState("");

  const provinceChange = (event) => {
    setProvince(event.target.value);
  };

  const munChange = (event) => {
    setMun(event.target.value);
  };

  const settlementChange = (event) => {
    setSettlement(event.target.value);
  };

  const arrayChange = (event) => {
    setArray(event.target.value);
  };

  //gets the unique Provinces using new Set
  let uniqueProvince = [...new Set(data.map((item) => item.province))];

  //filter Municipalities by their province with filter() and map()
  let filterMun = data
    .filter((x) => x.province === province)
    .map((item) => {
      return item.municipality;
    });

  //removing the duplicate values from the array of filtered provinces using reduce()
  let uniqueMun = filterMun.reduce((unique, item) => {
    if (!unique.includes(item)) {
      unique.push(item);
    }
    return unique;
  }, []);

  //filter Municipalities by their province with filter() and map()
  let filterSettlement = data
    .filter((x) => x.municipality === mun)
    .map((item) => {
      return item.settlement;
    });

  //removing the duplicate values from the array of filtered provinces using reduce()
  let uniqueSettlement = filterSettlement.reduce((unique, item) => {
    if (!unique.includes(item)) {
      unique.push(item);
    }
    return unique;
  }, []);

  //filter ekatte number by mun and settlement
  let filterEkatte = data
    .filter((x) => {
      return x.settlement === settlement && x.municipality === mun;
    })
    .map((item) => {
      return item.ekatte;
    });
  //filter coordinates by mun and settlement
  let filterGeo = data
    .filter((x) => {
      return (
        x.municipality === mun &&
        x.settlement === settlement &&
        province !== "Хасково"
      );
    })
    .map((item) => {
      return item.geo;
    });

  return (
    <div>
      <Typography variant="h4">Find your land on the map</Typography>
      <ul>
        <li>Find your land on the map and mark it using the map tools.</li>
        <li>Or upload a digital file of your land</li>
      </ul>
      <Grid
        className={styles.center}
        spacing={1}
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={3}>
          <FormControl>
            <InputLabel className={styles.center}>Област</InputLabel>
            <Select
              className={styles.selectBox}
              labelId=""
              id=""
              value={province}
              onChange={provinceChange}
            >
              {/* Iterate unique provinces in the select menu */}
              {uniqueProvince.map((item, key) => {
                return (
                  <MenuItem key={key} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
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
              {/* Mapping the reduced list of Municipalities */}
              {uniqueMun.map((item, key) => {
                return (
                  <MenuItem key={key} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl>
            <InputLabel>Населено място</InputLabel>
            <Select
              disabled={!mun} //Disable until province state is selected
              className={styles.settlementBox}
              labelId=""
              id=""
              value={settlement}
              onChange={settlementChange}
            >
              {/* Mapping the reduced list of Municipalities */}
              {uniqueSettlement.map((item, key) => {
                return (
                  <MenuItem key={key} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
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
      {settlement ? <Typography>ЕКАТТЕ # {filterEkatte}</Typography> : ""}
      {settlement ? <Typography>Coordinates: {filterGeo}</Typography> : ""}
    </div>
  );
};

export default Step2;
