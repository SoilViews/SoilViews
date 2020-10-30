import React from "react";
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";

import styles from "./Step2.module.css";

// import ekate from "./ekate.json"
import data from "../../data/ekate.json";
import haskovo_arrays from "../../data/masivi_haskovo.json";

const Step2 = () => {
  const [province, setProvince] = React.useState("");
  const [mun, setMun] = React.useState("");
  const [settlement, setSettlement] = React.useState("");
  const [array, setArray] = React.useState("");
  const [findGeo, setFindGeo] = React.useState("");
  const [ekatte, setEkatte] = React.useState("");

  //Filter GEO by current selection
  let provinceGeo = data
    .filter((x) => x.province === province && x.settlement === province)
    //TODO filter if province !== settlemend return the first closest element + Elin Pelin case
    .map((item) => {
      return item.geo;
    });

  let munGeo = data
    .filter((x) => x.municipality === mun && x.settlement === mun)
    .map((item) => {
      return item.geo;
    });

  let settlementGeo = data
    .filter((x) => x.settlement === settlement && x.municipality === mun)
    .map((item) => {
      return item.geo;
    });

  let ekatteGeo = data
    .filter(
      (x) =>
        x.settlement === settlement &&
        x.municipality === mun &&
        x.settlement === settlement
    )
    .map((item) => {
      return item.geo;
    });
  //USESTATE CHANGE CONSTANTS

  const provinceChange = (event) => {
    setMun();
    setSettlement();
    setArray();
    setEkatte();
    setFindGeo();
    setProvince(event.target.value);
  };

  const munChange = (event) => {
    setMun(event.target.value);
    setSettlement();
    setArray();
    setEkatte();
    setFindGeo();
    findGeoCondition();
  };

  const settlementChange = (event) => {
    setSettlement(event.target.value);

    setArray();
    setEkatte();
    setFindGeo();
    findGeoCondition();
  };

  const arrayChange = (event) => {
    setArray(event.target.value);

    setEkatte();
    setFindGeo();
    findGeoCondition();
  };

  const ekatteChange = (event) => {
    setEkatte(event.target.value);
    setFindGeo();
    findGeoCondition();
  };

  // let currentGeo = provinceGeo ? province : munGeo ? province && mun : settlementGeo ? province && mun && settlement

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
  // let filterGeo = data
  //   .filter((x) => {
  //     return (
  //       x.municipality === mun && x.settlement === settlement
  //       // && province !== "Хасково"
  //     );
  //   })
  //   .map((item) => {
  //     return item.geo;
  //   });

  //Get current GEO and put it into State

  const findGeoCondition = () => {
    if (province && !mun) {
      setFindGeo(provinceGeo);
    } else if (province && mun && !settlement) {
      setFindGeo(munGeo);
    } else if (province && mun && settlement) {
      setFindGeo(settlementGeo);
    } else if (province && mun && settlement && ekatte) {
      setFindGeo(ekatteGeo);
    } else {
      return null;
    }
  };

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
        {/* PROVINCE */}
        <Grid item xs={12} sm={2}>
          <FormControl>
            <InputLabel className={styles.center}>Област</InputLabel>
            <Select
              className={styles.selectBox}
              labelId=""
              id=""
              value={province}
              onChange={provinceChange}
              // onBlur={findGeoCondition}
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
        {/* MUNICIPALITY */}
        <Grid item xs={12} sm={2}>
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
        {/* SETTLEMENT */}
        <Grid item xs={12} sm={2}>
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
        {/* EKATTE - TODO: could only appear if more than 1 result exists, otherwise siply  */}
        <Grid item xs={12} sm={2}>
          <FormControl>
            <InputLabel>ЕКАТТЕ #</InputLabel>
            <Select
              disabled={!settlement} //Disable until province state is selected
              className={styles.settlementBox}
              labelId=""
              id=""
              value={ekatte}
              onChange={ekatteChange}
              defaultValue={"ekatte"}
            >
              {/* Mapping the reduced list of Municipalities */}
              {filterEkatte.map((item, key) => {
                return (
                  <MenuItem key={key} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        {/* HIDE ARRAY IF NOT "HASKOVO" */}
        {province === "Хасково" ? (
          <Grid item xs={12} sm={2}>
            <FormControl>
              <InputLabel>Масив</InputLabel>
              <Select
                className={styles.selectBox}
                labelId=""
                id=""
                value={array}
                onChange={arrayChange}
              >
                {/* Iterate all arrays from  haskovo_arrays.json */}
                {haskovo_arrays.map((item, key) => {
                  return (
                    <MenuItem key={key} value={item.masiv}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          ""
        )}
      </Grid>
      {/* {settlement ? <Typography>ЕКАТТЕ # {filterEkatte}</Typography> : ""}
      {settlement ? <Typography>Coordinates: {filterGeo}</Typography> : ""}
      {province && !mun ? (
        <Typography>Coordinates for current select: {provinceGeo}</Typography>
      ) : province && mun ? (
        <Typography>Coordinates for current select: {munGeo}</Typography>
      ) : province && mun && settlement ? (
        <Typography>Coordinates for current select: {settlementGeo}</Typography>
      ) : (
        ""
      )} */}
      {province ? (
        <Button variant="contained" color="primary" onClick={findGeoCondition}>
          Find
        </Button>
      ) : (
        ""
      )}
      {findGeo ? (
        <Typography> The current place coordinates are: {findGeo}</Typography>
      ) : (
        ""
      )}
    </div>
  );
};

export default Step2;
