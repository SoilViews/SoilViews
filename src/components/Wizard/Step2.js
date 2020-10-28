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
//import full file and test for unique values in each category

// import ekate from "./ekate.json"
import data from "../../data/ekate.json";

// var uniqueProvince = [];
// for (var i = 0; i < ekate.length; i++) {
//   if (uniqueProvince.indexOf(ekate[i].province) === -1) {
//     uniqueProvince.push(ekate[i].province);
//   }
// }

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
  let ReduceDupMun = filterMun.reduce((acc, item) => {
    if (!acc.includes(item)) {
      acc.push(item);
    }
    return acc;
  }, []);

  //filter Municipalities by their province with filter() and map()

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4">Find your land on the map</Typography>
          <ul>
            <li>Find your land on the map and mark it using the map tools.</li>
            <li>Or upload a digital file of your land</li>
          </ul>
        </Grid>
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
                  {/* Mapping the reduced list of Municipalities */}
                  {ReduceDupMun.map((item, key) => {
                    return (
                      <MenuItem key={key} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl>
                <InputLabel>Населено място</InputLabel>
                <Select
                  disabled={!settlement} //Disable until province state is fulfilled
                  className={styles.selectBox}
                  labelId=""
                  id=""
                  value={settlement}
                  onChange={settlementChange}
                >
                  {/* List unique settlements by selected municipality */}
                  {}
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
      </Grid>
    </div>
  );
};

export default Step2;
