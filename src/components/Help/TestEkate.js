import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

import styles from "./testEkate.module.css"
import data from "./testEkate.json"

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
          {uniqieProvince.map((item, key) => {
            return <li key={key}>{item}</li>
          })}
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
                  {data.map((item,key) => {
                    return <MenuItem value={key} key={key}>{item.ekatte}</MenuItem>
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