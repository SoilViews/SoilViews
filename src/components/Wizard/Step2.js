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
import data from "./testEkate.json"

// var uniqueProvince = [];
// for (var i = 0; i < ekate.length; i++) {
//   if (uniqueProvince.indexOf(ekate[i].province) === -1) {
//     uniqueProvince.push(ekate[i].province);
//   }
// }

const Step2 = () => {
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


  //gets the unique Provinces 
  let uniqieProvince = [...new Set(data.map(item => item.province))]; 

  //Gets the unique municipalities part of the chosen Province
  let uniqueMunicipality = [...new Set (data.filter((item) => {
                        return item.province === province })
                              .map((item,key) => {
                        return <MenuItem key={key} value={item.municipality}>{item.municipality}</MenuItem>
                        }))]; 


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
{/* Iterate provinces in the select menu */}
                  {
                    uniqieProvince
                    .map((item,key) => {
                      return <MenuItem key={key} value={item}>{item}</MenuItem>
                    })
                  }
{/* Iterate provinces in the select menu */}
                </Select>
              </FormControl>
            </Grid>

                       <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl>
                <InputLabel>Община</InputLabel>
                <Select
                  disabled = {!province}  //Disable until province state is fulfilled
                  className={styles.selectBox}
                  labelId=""
                  id=""
                  value={mun}
                  onChange={munChange}
                >
                {uniqueMunicipality}
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
                  <MenuItem value={10}>x</MenuItem>
                  <MenuItem value={20}>y</MenuItem>
                  <MenuItem value={30}>z</MenuItem>
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
